"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPosTransaction } from "@/app/actions/pos";

export default function PosScreen({ products }: { products: any[] }) {
  const [barcodeInput, setBarcodeInput] = useState("");
  const [cart, setCart] = useState<any[]>([]);
  const [paymentMode, setPaymentMode] = useState("CASH");
  const [amountTendered, setAmountTendered] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const barcodeRef = useRef<HTMLInputElement>(null);

  // Keep focus on barcode input for fast scanning
  useEffect(() => {
    if (!receiptData && !isProcessing) {
      barcodeRef.current?.focus();
    }
  }, [receiptData, isProcessing, cart]);

  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    const scannedCode = barcodeInput.trim();
    if (!scannedCode) return;

    // Find product by barcode or product code
    const product = products.find(p => 
      p.code === scannedCode || 
      p.barcodes?.some((b: any) => b.barcode === scannedCode)
    );

    if (!product) {
      setErrorMsg("Product not found for barcode: " + scannedCode);
      setBarcodeInput("");
      return;
    }

    const availableStock = product.stockBalances?.reduce((sum: number, b: any) => sum + b.qtyAvailable, 0) || 0;

    setCart(prev => {
      const existing = prev.find(item => item.productId === product.id);
      const newQty = existing ? existing.qty + 1 : 1;
      
      if (newQty > availableStock) {
        setErrorMsg(`Cannot add more. Available stock for ${product.nameEn}: ${availableStock}`);
        return prev;
      }

      if (existing) {
        return prev.map(item => item.productId === product.id ? { ...item, qty: newQty } : item);
      }
      return [...prev, {
        productId: product.id,
        name: product.nameEn,
        rate: product.retailPrice || 0,
        qty: 1
      }];
    });

    setBarcodeInput("");
  };

  const updateQty = (productId: string, delta: number) => {
    setErrorMsg("");
    setCart(prev => {
      const product = products.find(p => p.id === productId);
      const availableStock = product?.stockBalances?.reduce((sum: number, b: any) => sum + b.qtyAvailable, 0) || 0;

      return prev.map(item => {
        if (item.productId === productId) {
          const newQty = item.qty + delta;
          if (newQty < 1) return item; // remove logic could go here
          if (newQty > availableStock) {
            setErrorMsg(`Insufficient stock. Only ${availableStock} available.`);
            return item;
          }
          return { ...item, qty: newQty };
        }
        return item;
      });
    });
  };

  const removeItem = (productId: string) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.qty * item.rate), 0);
  const changeGiven = amountTendered > subtotal ? amountTendered - subtotal : 0;

  const processPayment = async () => {
    if (cart.length === 0) return;
    setIsProcessing(true);
    setErrorMsg("");

    try {
      const receiptNumber = 'REC-' + Math.floor(100000 + Math.random() * 900000);
      
      const payload = {
        receiptNumber,
        paymentMethod: paymentMode,
        amountTendered: amountTendered || subtotal, // exact change if not specified
        changeGiven,
        items: cart.map(item => ({
          productId: item.productId,
          qty: item.qty,
          rate: item.rate
        }))
      };

      const result = await createPosTransaction(payload);
      
      if (result.success) {
        setReceiptData({
          ...payload,
          date: new Date().toLocaleString(),
          items: cart,
          total: subtotal
        });
        setCart([]);
        setAmountTendered(0);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to process transaction");
    } finally {
      setIsProcessing(false);
    }
  };

  const printReceipt = () => {
    window.print();
  };

  const resetPos = () => {
    setReceiptData(null);
    setBarcodeInput("");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
      
      {/* LEFT: Products & Scanning */}
      <div className="lg:col-span-2 bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex flex-col min-h-[600px]">
        
        {/* Barcode Scanner Input */}
        <form onSubmit={handleBarcodeSubmit} className="mb-4">
          <label className="text-sm font-bold text-[#0F172A] block mb-2">Scan Barcode or Enter Product Code</label>
          <div className="flex gap-3">
            <input 
              ref={barcodeRef}
              type="text" 
              autoFocus
              placeholder="Waiting for scanner..." 
              value={barcodeInput} 
              onChange={e => setBarcodeInput(e.target.value)} 
              className="flex-1 border-2 border-teal-500 p-3 rounded-lg text-lg font-mono text-[#0F172A] focus:ring-4 focus:ring-teal-100 outline-none transition" 
            />
            <button type="submit" className="bg-[#0F172A] hover:bg-slate-800 text-white px-6 rounded-lg font-semibold shadow-sm">
              Add
            </button>
          </div>
          {errorMsg && <p className="text-red-500 text-sm mt-2 font-medium bg-red-50 p-2 rounded">{errorMsg}</p>}
        </form>
        
        <h3 className="font-bold text-[#0F172A] border-b pb-2 mb-4 mt-2">Current Cart ({cart.length} items)</h3>
        
        <div className="flex-1 overflow-auto border rounded-lg">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-slate-50 border-b text-[#64748B] text-xs uppercase tracking-wider sticky top-0">
              <tr>
                <th className="p-3">Item</th>
                <th className="p-3 text-center">Qty</th>
                <th className="p-3 text-right">Rate</th>
                <th className="p-3 text-right">Total</th>
                <th className="p-3 text-center"></th>
              </tr>
            </thead>
            <tbody>
              {cart.map(item => (
                <tr key={item.productId} className="border-b text-[#0F172A] hover:bg-slate-50">
                  <td className="p-3 font-medium">{item.name}</td>
                  <td className="p-3">
                    <div className="flex items-center justify-center gap-2">
                      <button type="button" onClick={() => updateQty(item.productId, -1)} className="w-6 h-6 rounded bg-slate-200 hover:bg-slate-300 font-bold">-</button>
                      <span className="w-8 text-center font-mono">{item.qty}</span>
                      <button type="button" onClick={() => updateQty(item.productId, 1)} className="w-6 h-6 rounded bg-slate-200 hover:bg-slate-300 font-bold">+</button>
                    </div>
                  </td>
                  <td className="p-3 text-right font-mono">${item.rate.toFixed(2)}</td>
                  <td className="p-3 text-right font-bold text-teal-700">${(item.qty * item.rate).toFixed(2)}</td>
                  <td className="p-3 text-center">
                    <button type="button" onClick={() => removeItem(item.productId)} className="text-red-500 hover:text-red-700">
                      <svg className="w-5 h-5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                  </td>
                </tr>
              ))}
              {cart.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-[#64748B]">
                    <div className="flex flex-col items-center">
                      <svg className="w-12 h-12 text-slate-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4v16m8-8H4"/></svg>
                      <p>Cart is empty. Scan an item to begin.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* RIGHT: Payment & Actions */}
      <div className="bg-slate-50 p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col h-full">
        <h3 className="font-bold text-[#0F172A] border-b pb-2 mb-4">Payment Summary</h3>
        
        <div className="flex-1 space-y-6">
          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[#64748B] font-medium">Subtotal</span>
              <span className="font-bold font-mono text-lg text-[#0F172A]">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center border-t border-dashed pt-2 mt-2">
              <span className="text-lg font-bold text-[#0F172A]">Amount Due</span>
              <span className="text-3xl font-black font-mono text-teal-600">${subtotal.toFixed(2)}</span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#64748B] mb-1 uppercase tracking-wider">Payment Method</label>
              <select 
                value={paymentMode} 
                onChange={e => setPaymentMode(e.target.value)} 
                className="w-full border border-slate-300 p-3 rounded-lg text-sm text-[#0F172A] bg-white focus:ring-2 focus:ring-teal-500 font-semibold"
              >
                <option value="CASH">Cash</option>
                <option value="CARD">Credit / Debit Card</option>
                <option value="MOBILE_WALLET">Mobile Wallet / QR</option>
              </select>
            </div>
            
            {paymentMode === "CASH" && (
              <div>
                <label className="block text-xs font-bold text-[#64748B] mb-1 uppercase tracking-wider">Amount Tendered</label>
                <input 
                  type="number" 
                  min={subtotal}
                  step="0.01"
                  value={amountTendered || ''} 
                  onChange={e => setAmountTendered(parseFloat(e.target.value) || 0)} 
                  placeholder={subtotal.toFixed(2)}
                  className="w-full border border-slate-300 p-3 rounded-lg text-lg text-[#0F172A] font-mono focus:ring-2 focus:ring-teal-500"
                />
              </div>
            )}

            {paymentMode === "CASH" && changeGiven > 0 && (
              <div className="bg-orange-50 p-3 rounded-lg border border-orange-200 flex justify-between items-center">
                <span className="font-bold text-orange-800">Change Due:</span>
                <span className="font-black font-mono text-xl text-orange-600">${changeGiven.toFixed(2)}</span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-200">
          <button 
            disabled={cart.length === 0 || isProcessing || (paymentMode === 'CASH' && amountTendered > 0 && amountTendered < subtotal)}
            onClick={processPayment} 
            className="w-full py-4 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-md active:scale-95 flex justify-center items-center gap-2 text-lg"
          >
            {isProcessing ? "Processing..." : "Complete Checkout"}
            {!isProcessing && <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>}
          </button>
        </div>
      </div>

      {/* THERMAL RECEIPT MODAL */}
      {receiptData && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm print:bg-white print:p-0">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full overflow-hidden flex flex-col max-h-[90vh] print:shadow-none print:w-[80mm] print:rounded-none">
            
            {/* Modal Header (Hidden on print) */}
            <div className="bg-teal-600 text-white p-4 flex justify-between items-center print:hidden">
              <h3 className="font-bold">Transaction Complete</h3>
              <button onClick={resetPos} className="text-white hover:text-teal-200">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>

            {/* Receipt Content (Printed area) */}
            <div className="p-6 bg-white text-black font-mono text-sm overflow-auto print:p-2 print:text-xs" id="thermal-receipt">
              <div className="text-center mb-6">
                <h2 className="font-bold text-xl uppercase mb-1">Company POS</h2>
                <p className="text-xs text-gray-500">123 Main Street, City</p>
                <p className="text-xs text-gray-500">Phone: 555-0123</p>
                <p className="text-xs text-gray-500">Tax ID: 987654321</p>
                <div className="border-b border-dashed border-gray-400 mt-4"></div>
              </div>

              <div className="mb-4 text-xs">
                <div className="flex justify-between"><span className="text-gray-500">Receipt No:</span> <span className="font-bold">{receiptData.receiptNumber}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Date:</span> <span>{receiptData.date}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Payment:</span> <span>{receiptData.paymentMethod}</span></div>
              </div>

              <div className="border-b border-dashed border-gray-400 mb-2"></div>
              
              <table className="w-full text-xs mb-4">
                <thead>
                  <tr className="border-b border-dashed border-gray-400">
                    <th className="text-left py-1 w-1/2">Item</th>
                    <th className="text-center py-1">Qty</th>
                    <th className="text-right py-1">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {receiptData.items.map((item: any, i: number) => (
                    <tr key={i}>
                      <td className="py-1 truncate">{item.name}</td>
                      <td className="text-center py-1">{item.qty}</td>
                      <td className="text-right py-1">${(item.qty * item.rate).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="border-b border-dashed border-gray-400 mb-4"></div>

              <div className="space-y-1 mb-6 text-sm">
                <div className="flex justify-between font-bold text-lg">
                  <span>TOTAL DUE</span>
                  <span>${receiptData.total.toFixed(2)}</span>
                </div>
                {receiptData.paymentMethod === 'CASH' && (
                  <>
                    <div className="flex justify-between text-xs text-gray-600 mt-2">
                      <span>Amount Tendered</span>
                      <span>${receiptData.amountTendered.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xs font-bold mt-1">
                      <span>CHANGE</span>
                      <span>${receiptData.changeGiven.toFixed(2)}</span>
                    </div>
                  </>
                )}
              </div>

              <div className="text-center text-xs text-gray-500 mt-8 mb-4 flex flex-col items-center">
                <svg className="w-16 h-16 mb-2 text-gray-800" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4 6h2v12H4zm4 0h1v12H8zm3 0h2v12h-2zm3 0h1v12h-1zm3 0h3v12h-3z" />
                </svg>
                <p>{receiptData.receiptNumber}</p>
                <p className="mt-4">Thank you for your purchase!</p>
                <p>Please come again.</p>
              </div>
            </div>

            {/* Modal Footer (Hidden on print) */}
            <div className="p-4 bg-gray-50 border-t flex gap-3 print:hidden">
              <button onClick={resetPos} className="flex-1 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-100 transition-colors">
                New Sale
              </button>
              <button onClick={printReceipt} className="flex-1 py-2 bg-slate-900 text-white rounded-lg font-semibold shadow-md hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
                Print Receipt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PRINT CSS OVERRIDES */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * { visibility: hidden; }
          #thermal-receipt, #thermal-receipt * { visibility: visible; }
          #thermal-receipt { position: absolute; left: 0; top: 0; width: 80mm; margin: 0; padding: 10px; font-family: monospace; }
        }
      `}} />
    </div>
  );
}
