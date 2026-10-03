"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createPurchaseOrder } from "@/app/actions/purchase";
import { createQuickProduct } from "@/app/actions/product";
import AiScannerButton from "@/app/components/AiScannerButton";

export default function PurchaseOrderForm({ suppliers, products, accounts }: { suppliers: any[], products: any[], accounts: any[] }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localProducts, setLocalProducts] = useState(products);

  // Form State
  const [supplierId, setSupplierId] = useState(suppliers[0]?.id || "");
  const [accountId, setAccountId] = useState(accounts[0]?.id || "");
  const [poNumber, setPoNumber] = useState(`PO-${Math.floor(Math.random() * 10000)}`);
  const [expectedDate, setExpectedDate] = useState("");
  const [notes, setNotes] = useState("");

  // Print State
  const [printData, setPrintData] = useState<any>(null);

  // OCR AI State Handler
  const handleScanData = (data: any) => {
    if (data.poNumber) setPoNumber(data.poNumber);
    if (data.expectedDate) setExpectedDate(data.expectedDate);
    if (data.notes) setNotes(data.notes);

    if (data.items && data.items.length > 0) {
      const newItems = data.items.map((aiItem: any) => {
        const matchedProduct = localProducts.find(p => p.nameEn.toLowerCase().includes(aiItem.name.toLowerCase()));
        return {
          productId: matchedProduct?.id || "",
          tempName: matchedProduct ? "" : aiItem.name,
          qty: aiItem.qty || 1,
          rate: aiItem.rate || matchedProduct?.cost || 0,
          uomId: matchedProduct?.baseUomId || "",
          barcode: ""
        };
      });
      setItems(newItems);
      alert(`AI successfully scanned ${newItems.length} items from the invoice!`);
    }
  };

  // Dynamic Line Items State
  const [items, setItems] = useState([
    { productId: "", tempName: "", qty: 1, rate: 0, uomId: "", barcode: "" }
  ]);

  const addItem = () => {
    setItems([...items, { productId: "", tempName: "", qty: 1, rate: 0, uomId: "", barcode: "" }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    if (field === "productId") {
      const product = localProducts.find(p => p.id === value);
      newItems[index] = {
        ...newItems[index],
        productId: value,
        tempName: "", // Clear temp name once a product is selected
        rate: product ? product.cost || product.tradePrice : 0,
        uomId: product ? product.baseUomId : "",
        barcode: product && product.barcode ? product.barcode : ""
      };
    } else {
      newItems[index] = { ...newItems[index], [field]: value };
    }
    setItems(newItems);
  };

  const handleQuickAdd = async (index: number, tempName: string, rate: number) => {
    try {
      const newProduct = await createQuickProduct(tempName, rate);
      setLocalProducts([...localProducts, newProduct]);
      
      const newItems = [...items];
      newItems[index] = {
        ...newItems[index],
        productId: newProduct.id,
        tempName: "",
        rate: newProduct.cost || 0,
        uomId: newProduct.baseUomId || "",
        barcode: ""
      };
      setItems(newItems);
    } catch (err) {
      alert("Failed to create product. Please ensure you have a Unit of Measure created.");
    }
  };

  const subtotal = items.reduce((sum, item) => sum + (item.qty * item.rate), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplierId || items.some(i => !i.productId)) {
      alert("Please select a supplier and ensure all items have a valid product selected from the dropdown.");
      return;
    }
    setIsSubmitting(true);
    await createPurchaseOrder({
      supplierId,
      accountId,
      poNumber,
      expectedDate,
      notes,
      items
    });
    setIsSubmitting(false);

    // Prepare data for printing
    const selectedSupplier = suppliers.find(s => s.id === supplierId);
    const enrichedItems = items.map(item => {
      const p = localProducts.find(prod => prod.id === item.productId);
      return {
        ...item,
        productName: p?.nameEn || "Unknown",
        productCode: p?.code || ""
      };
    });

    setPrintData({
      supplier: selectedSupplier,
      poNumber,
      expectedDate,
      notes,
      items: enrichedItems,
      subtotal
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDone = () => {
    router.push("/purchase");
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden">
      {/* Header Info */}
      <div className="p-6 border-b border-[#E2E8F0] space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-[#0F172A]">Order Details</h2>
          <div className="flex items-center gap-2">
            <AiScannerButton onScanComplete={handleScanData} buttonText="Scan AI Invoice" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#0F172A]">Supplier</label>
            <select
              value={supplierId} onChange={e => setSupplierId(e.target.value)} required
              className="px-3 py-2 border border-[#E2E8F0] rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
            >
              <option value="">Select Supplier...</option>
              {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#0F172A]">Payment Method / GL</label>
            <select
              value={accountId} onChange={e => setAccountId(e.target.value)} required
              className="px-3 py-2 border border-[#E2E8F0] rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
            >
              <option value="">Select Account...</option>
              {accounts.map(a => <option key={a.id} value={a.id}>{a.code} - {a.name}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#0F172A]">PO Number</label>
            <input value={poNumber} onChange={e => setPoNumber(e.target.value)} type="text" required className="px-3 py-2 border border-[#E2E8F0] rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono text-sm bg-gray-50" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#0F172A]">Expected Delivery</label>
            <input value={expectedDate} onChange={e => setExpectedDate(e.target.value)} type="date" className="px-3 py-2 border border-[#E2E8F0] rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm" />
          </div>
        </div>
      </div>

      {/* Line Items */}
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-[#0F172A]">Line Items</h2>
          <button type="button" onClick={addItem} className="text-sm font-medium text-teal-600 hover:text-teal-800 bg-teal-50 px-3 py-1.5 rounded-md">
            + Add Row
          </button>
        </div>

        <table className="w-full text-left text-sm mb-6 border-collapse">
          <thead className="bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B]">
            <tr>
              <th className="px-4 py-3 font-semibold w-1/3">Product</th>
              <th className="px-4 py-3 font-semibold w-32">Barcode</th>
              <th className="px-4 py-3 font-semibold w-24">Qty</th>
              <th className="px-4 py-3 font-semibold w-24">Rate (Rs)</th>
              <th className="px-4 py-3 font-semibold w-24 text-right">Total</th>
              <th className="px-4 py-3 font-semibold w-12 text-center"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index} className="border-b border-[#E2E8F0] align-top">
                <td className="p-2 border-x border-[#E2E8F0]">
                  <select
                    value={item.productId} onChange={e => updateItem(index, 'productId', e.target.value)} required
                    className="w-full px-2 py-1.5 border border-[#E2E8F0] rounded focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                  >
                    <option value="">Select Product...</option>
                    {localProducts.map(p => <option key={p.id} value={p.id}>{p.code} - {p.nameEn}</option>)}
                  </select>
                  {item.tempName && (
                    <div className="mt-1.5 p-2 text-xs text-orange-700 bg-orange-50 border border-orange-200 rounded-md">
                      <div className="flex items-center gap-1.5 mb-1.5 font-medium">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        AI Scanned: "{item.tempName}"
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="opacity-80">Product not found.</span>
                        <button type="button" onClick={() => handleQuickAdd(index, item.tempName, item.rate)} className="bg-orange-600 hover:bg-orange-700 text-white px-2 py-1 rounded shadow-sm text-xs transition-colors">
                          + Add as New Product
                        </button>
                      </div>
                    </div>
                  )}
                </td>
                <td className="p-2 border-x border-[#E2E8F0]">
                  <input type="text" placeholder="Scan/Enter" value={item.barcode || ""} onChange={e => updateItem(index, 'barcode', e.target.value)} className="w-full px-2 py-1.5 border border-[#E2E8F0] rounded focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm font-mono" />
                </td>
                <td className="p-2 border-x border-[#E2E8F0]">
                  <input type="number" min="1" value={item.qty} onChange={e => updateItem(index, 'qty', parseFloat(e.target.value) || 0)} required className="w-full px-2 py-1.5 border border-[#E2E8F0] rounded focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm text-center" />
                </td>
                <td className="p-2 border-x border-[#E2E8F0]">
                  <input type="number" min="0" step="0.01" value={item.rate} onChange={e => updateItem(index, 'rate', parseFloat(e.target.value) || 0)} required className="w-full px-2 py-1.5 border border-[#E2E8F0] rounded focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono text-sm text-right" />
                </td>
                <td className="p-2 border-x border-[#E2E8F0] text-right font-mono font-medium text-[#0F172A] bg-gray-50">
                  {(item.qty * item.rate).toFixed(2)}
                </td>
                <td className="p-2 border-r border-[#E2E8F0] text-center">
                  <button type="button" onClick={() => removeItem(index)} className="text-red-500 hover:text-red-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-between items-start">
          <div className="w-1/2">
            <label className="text-sm font-semibold text-[#0F172A] block mb-1">Notes</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} placeholder="Add any special instructions for the supplier..." className="w-full px-3 py-2 border border-[#E2E8F0] rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm" />
          </div>
          <div className="w-1/3 bg-[#F8FAFC] p-4 rounded-lg border border-[#E2E8F0]">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[#64748B] text-sm">Subtotal</span>
              <span className="font-mono text-[#0F172A]">Rs {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center border-t border-[#E2E8F0] pt-2 mt-2">
              <span className="font-semibold text-[#0F172A]">Total Amount</span>
              <span className="font-bold font-mono text-xl text-teal-700">Rs {subtotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-[#E2E8F0] bg-gray-50 flex justify-end gap-4">
        <Link href="/purchase" className="px-4 py-2 text-sm font-medium text-[#64748B] hover:text-[#0F172A]">
          Cancel
        </Link>
        <button type="submit" disabled={isSubmitting} className="bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-700 hover:to-emerald-600 text-white px-6 py-2 rounded-md text-sm font-semibold shadow-md transition-all active:scale-[0.98] disabled:opacity-70">
          {isSubmitting ? "Creating PO..." : "Save Purchase Order"}
        </button>
      </div>

      {/* A4 PRINT MODAL */}
      {printData && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm print:bg-white print:p-0 print:block">
          {/* Modal Container */}
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-auto flex flex-col print:shadow-none print:max-w-none print:w-[210mm] print:h-[297mm] print:overflow-visible print:max-h-none print:m-0 print:rounded-none relative">

            {/* Action Bar (Hidden on print) */}
            <div className="sticky top-0 bg-slate-900 text-white p-4 flex justify-between items-center print:hidden z-10 shadow-md">
              <h3 className="font-bold">Purchase Order Generated Successfully</h3>
              <div className="flex gap-3">
                <button type="button" onClick={handlePrint} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded font-semibold text-sm transition-colors flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                  Print (A4)
                </button>
                <button type="button" onClick={handleDone} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded font-semibold text-sm transition-colors">
                  Close & Go to List
                </button>
              </div>
            </div>

            {/* A4 Page Content */}
            <div className="p-10 bg-white text-black print:p-[20mm]" id="a4-po-document">
              {/* Header */}
              <div className="flex justify-between items-start mb-10 border-b-2 border-slate-800 pb-6">
                <div>
                  <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-2 uppercase">Purchase Order</h1>
                  <p className="text-sm text-slate-500 font-medium">Original Document</p>
                </div>
                <div className="text-right">
                  <h2 className="text-xl font-bold text-teal-700">YOUR COMPANY NAME</h2>
                  <p className="text-sm text-slate-600 mt-1">123 Business Avenue, City Center</p>
                  <p className="text-sm text-slate-600">Email: purchase@yourcompany.com</p>
                  <p className="text-sm text-slate-600">Phone: +1 234 567 890</p>
                </div>
              </div>

              {/* Meta Info */}
              <div className="grid grid-cols-2 gap-10 mb-10">
                <div className="bg-slate-50 p-4 border border-slate-200 rounded-lg">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Vendor / Supplier</h3>
                  <p className="text-lg font-bold text-slate-800">{printData.supplier?.name}</p>
                  <p className="text-sm text-slate-600 mt-1">{printData.supplier?.address || "No address provided"}</p>
                  <p className="text-sm text-slate-600">Contact: {printData.supplier?.phone || "N/A"}</p>
                </div>

                <div className="bg-slate-50 p-4 border border-slate-200 rounded-lg">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Order Information</h3>
                  <table className="w-full text-sm">
                    <tbody>
                      <tr>
                        <td className="py-1 text-slate-500 font-medium">PO Number:</td>
                        <td className="py-1 text-right font-bold font-mono">{printData.poNumber}</td>
                      </tr>
                      <tr>
                        <td className="py-1 text-slate-500 font-medium">Order Date:</td>
                        <td className="py-1 text-right font-semibold">{new Date().toLocaleDateString()}</td>
                      </tr>
                      <tr>
                        <td className="py-1 text-slate-500 font-medium">Expected Delivery:</td>
                        <td className="py-1 text-right font-semibold">{printData.expectedDate ? new Date(printData.expectedDate).toLocaleDateString() : 'ASAP'}</td>
                      </tr>
                      <tr>
                        <td className="py-1 text-slate-500 font-medium">Payment terms:</td>
                        <td className="py-1 text-right font-semibold">{accounts.find(a => a.id === accountId)?.name || 'N/A'}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Items Table */}
              <table className="w-full text-sm border-collapse mb-8">
                <thead>
                  <tr className="bg-slate-800 text-white">
                    <th className="py-3 px-4 text-left font-semibold rounded-tl-lg">Item Code</th>
                    <th className="py-3 px-4 text-left font-semibold">Description</th>
                    <th className="py-3 px-4 text-center font-semibold">Qty</th>
                    <th className="py-3 px-4 text-right font-semibold">Unit Price</th>
                    <th className="py-3 px-4 text-right font-semibold rounded-tr-lg">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {printData.items.map((item: any, i: number) => (
                    <tr key={i} className="border-b border-slate-200">
                      <td className="py-3 px-4 font-mono text-slate-600">{item.productCode}</td>
                      <td className="py-3 px-4 font-semibold text-slate-800">{item.productName}</td>
                      <td className="py-3 px-4 text-center">{item.qty}</td>
                      <td className="py-3 px-4 text-right font-mono text-slate-600">Rs {item.rate.toFixed(2)}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-800">Rs {(item.qty * item.rate).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals */}
              <div className="flex justify-between items-start mt-8">
                <div className="w-1/2">
                  {printData.notes && (
                    <div>
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Remarks / Instructions</h3>
                      <p className="text-sm text-slate-600 italic bg-slate-50 p-3 rounded border border-slate-200">{printData.notes}</p>
                    </div>
                  )}
                </div>
                <div className="w-1/3">
                  <div className="border-t-2 border-slate-800 pt-4 flex justify-between items-center">
                    <span className="text-lg font-bold text-slate-800">Grand Total</span>
                    <span className="text-2xl font-black font-mono text-teal-700">Rs {printData.subtotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Signatures */}
              <div className="mt-24 pt-8 border-t border-slate-200 grid grid-cols-2 gap-10">
                <div className="text-center">
                  <div className="border-b border-slate-400 w-48 mx-auto mb-2"></div>
                  <p className="text-sm text-slate-500 font-semibold uppercase">Authorized By</p>
                </div>
                <div className="text-center">
                  <div className="border-b border-slate-400 w-48 mx-auto mb-2"></div>
                  <p className="text-sm text-slate-500 font-semibold uppercase">Vendor Acceptance</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Global Print Styles for A4 */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @media print {
          @page { size: A4; margin: 0; }
          body * { visibility: hidden; }
          .print\\:block { display: block !important; }
          #a4-po-document, #a4-po-document * { visibility: visible; }
          #a4-po-document { 
            position: absolute; 
            left: 0; 
            top: 0; 
            width: 210mm; 
            min-height: 297mm;
            margin: 0; 
            padding: 20mm !important;
            background: white !important;
          }
        }
      `}} />
    </form>
  );
}
