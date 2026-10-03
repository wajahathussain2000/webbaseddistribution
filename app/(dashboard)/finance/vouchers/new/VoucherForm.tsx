"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createVoucher } from "@/app/actions/finance";
import AiScannerButton from "@/app/components/AiScannerButton";

export default function VoucherForm({ accounts, customers, suppliers }: { accounts: any[], customers: any[], suppliers: any[] }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [type, setType] = useState<"RECEIPT" | "PAYMENT">("RECEIPT");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [referenceNumber, setReferenceNumber] = useState(`RV-${Math.floor(Math.random() * 10000)}`);
  const [mainAccountId, setMainAccountId] = useState("");
  const [notes, setNotes] = useState("");
  
  const [partyType, setPartyType] = useState<"CUSTOMER" | "SUPPLIER" | "OTHER">("CUSTOMER");
  const [offsetAccountId, setOffsetAccountId] = useState("");
  const [costCentreId, setCostCentreId] = useState("");
  const [amount, setAmount] = useState<number>(0);

  const handleScanData = (data: any) => {
    // Determine type heuristically (if there's items with rate, it's a bill/receipt -> PAYMENT for company usually)
    // We'll leave the type manual for now to be safe.
    
    if (data.notes) setNotes(data.notes);
    if (data.expectedDate) setDate(data.expectedDate);
    
    // Sum total
    if (data.items && data.items.length > 0) {
      const total = data.items.reduce((sum: number, item: any) => sum + ((item.qty || 1) * (item.rate || 0)), 0);
      setAmount(total);
      alert(`AI scanned the receipt! Total amount: Rs ${total}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mainAccountId || !offsetAccountId || amount <= 0) {
      alert("Please fill all required fields and ensure amount is greater than 0.");
      return;
    }

    setIsSubmitting(true);
    await createVoucher({
      type,
      date,
      referenceNumber,
      notes,
      mainAccountId,
      entries: [
        {
          accountId: offsetAccountId,
          costCentreId: partyType !== "OTHER" ? costCentreId : undefined,
          amount,
        }
      ]
    });
    router.push("/finance/vouchers"); // We'll create this list page later or redirect to reports
  };

  const handleTypeChange = (newType: "RECEIPT" | "PAYMENT") => {
    setType(newType);
    setReferenceNumber(newType === "RECEIPT" ? `RV-${Math.floor(Math.random() * 10000)}` : `PV-${Math.floor(Math.random() * 10000)}`);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-[#E2E8F0] bg-slate-50 flex justify-between items-center">
        <div className="flex gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="radio" name="vtype" checked={type === "RECEIPT"} onChange={() => handleTypeChange("RECEIPT")} className="w-4 h-4 text-teal-600 focus:ring-teal-500" />
          <span className="font-semibold text-slate-700">Receipt Voucher (Cash In)</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer ml-6">
          <span className="font-semibold text-slate-700">Payment Voucher (Cash Out)</span>
        </label>
        </div>
        <AiScannerButton onScanComplete={handleScanData} buttonText="Scan Bill/Receipt" />
      </div>

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#0F172A]">Date</label>
            <input value={date} onChange={e => setDate(e.target.value)} type="date" required className="px-3 py-2 border border-[#E2E8F0] rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#0F172A]">Voucher Number</label>
            <input value={referenceNumber} onChange={e => setReferenceNumber(e.target.value)} type="text" required className="px-3 py-2 border border-[#E2E8F0] rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono text-sm bg-gray-50" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#0F172A]">{type === "RECEIPT" ? "Deposit To (Bank/Cash)" : "Pay From (Bank/Cash)"}</label>
            <select value={mainAccountId} onChange={e => setMainAccountId(e.target.value)} required className="px-3 py-2 border border-[#E2E8F0] rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm">
              <option value="">Select Account...</option>
              {accounts.filter(a => a.type === "ASSET").map(a => <option key={a.id} value={a.id}>{a.code} - {a.name}</option>)}
            </select>
          </div>
        </div>

        <div className="p-5 border border-[#E2E8F0] rounded-lg bg-slate-50 space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">{type === "RECEIPT" ? "Received From" : "Paid To"}</h3>
          
          <div className="flex gap-4 mb-4">
            {["CUSTOMER", "SUPPLIER", "OTHER"].map(pt => (
              <label key={pt} className="flex items-center gap-2 cursor-pointer text-sm">
                <input type="radio" name="partyType" checked={partyType === pt} onChange={() => setPartyType(pt as any)} className="text-teal-600" />
                <span className="font-medium text-slate-600 capitalize">{pt.toLowerCase()}</span>
              </label>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {partyType === "CUSTOMER" && (
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-[#0F172A]">Select Customer</label>
                <select value={costCentreId} onChange={e => setCostCentreId(e.target.value)} required className="px-3 py-2 border border-[#E2E8F0] rounded-md text-sm">
                  <option value="">Select Customer...</option>
                  {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            )}
            {partyType === "SUPPLIER" && (
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-[#0F172A]">Select Supplier</label>
                <select value={costCentreId} onChange={e => setCostCentreId(e.target.value)} required className="px-3 py-2 border border-[#E2E8F0] rounded-md text-sm">
                  <option value="">Select Supplier...</option>
                  {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
            )}
            
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[#0F172A]">Offset GL Account</label>
              <select value={offsetAccountId} onChange={e => setOffsetAccountId(e.target.value)} required className="px-3 py-2 border border-[#E2E8F0] rounded-md text-sm">
                <option value="">Select Account...</option>
                {accounts.map(a => <option key={a.id} value={a.id}>{a.code} - {a.name}</option>)}
              </select>
              <p className="text-xs text-slate-500">For customers, choose "Accounts Receivable". For suppliers, choose "Accounts Payable".</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#0F172A]">Amount (Rs)</label>
            <input value={amount} onChange={e => setAmount(parseFloat(e.target.value) || 0)} type="number" min="1" required className="px-3 py-2 border border-[#E2E8F0] rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-lg font-mono font-bold text-teal-700" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#0F172A]">Remarks / Narration</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} className="px-3 py-2 border border-[#E2E8F0] rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm" placeholder="e.g. Payment for Invoice #1234" />
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-[#E2E8F0] bg-gray-50 flex justify-end gap-4">
        <button type="submit" disabled={isSubmitting} className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-md text-sm font-semibold shadow-md transition-all active:scale-[0.98] disabled:opacity-70">
          {isSubmitting ? "Saving..." : "Post Voucher"}
        </button>
      </div>
    </form>
  );
}
