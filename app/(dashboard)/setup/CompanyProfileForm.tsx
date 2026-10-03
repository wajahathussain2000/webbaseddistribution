"use client";

import { useState } from "react";
import { updateCompanyProfile } from "@/app/actions/setup";

export default function CompanyProfileForm({ tenant }: { tenant: any }) {
  const [name, setName] = useState(tenant?.name || "");
  const [address, setAddress] = useState(tenant?.address || "");
  const [phone, setPhone] = useState(tenant?.phone || "");
  const [taxNumber, setTaxNumber] = useState(tenant?.taxNumber || "");
  const [licenseNumbers, setLicenseNumbers] = useState(tenant?.licenseNumbers || "");
  const [bankDetails, setBankDetails] = useState(tenant?.bankDetails || "");
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateCompanyProfile({ name, address, phone, taxNumber, licenseNumbers, bankDetails });
      alert("Company profile updated successfully!");
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden flex flex-col mb-6">
      <div className="p-4 border-b border-[#E2E8F0] flex gap-4 bg-gray-50/50 items-center justify-between">
        <div className="flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-teal-600"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          <h2 className="font-bold text-[#0F172A]">Company Profile Settings</h2>
        </div>
        <button disabled={isSubmitting} type="submit" className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-1.5 rounded-md text-sm font-semibold transition-colors">
          {isSubmitting ? "Saving..." : "Save Profile"}
        </button>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <label className="text-sm font-semibold text-slate-700 block mb-1">Company Name *</label>
          <input value={name} onChange={e => setName(e.target.value)} type="text" className="w-full px-3 py-2 border rounded-md focus:ring-teal-500 focus:border-teal-500" required />
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-700 block mb-1">Tax / GST Number</label>
          <input value={taxNumber} onChange={e => setTaxNumber(e.target.value)} type="text" className="w-full px-3 py-2 border rounded-md" placeholder="e.g. 1234567-8" />
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-700 block mb-1">Phone Number</label>
          <input value={phone} onChange={e => setPhone(e.target.value)} type="text" className="w-full px-3 py-2 border rounded-md" />
        </div>
        <div className="md:col-span-2">
          <label className="text-sm font-semibold text-slate-700 block mb-1">Registered Address</label>
          <input value={address} onChange={e => setAddress(e.target.value)} type="text" className="w-full px-3 py-2 border rounded-md" />
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-700 block mb-1">Drug / Trade Licenses</label>
          <input value={licenseNumbers} onChange={e => setLicenseNumbers(e.target.value)} type="text" className="w-full px-3 py-2 border rounded-md" />
        </div>
        <div className="md:col-span-3">
          <label className="text-sm font-semibold text-slate-700 block mb-1">Bank Account Details (Printed on Invoices)</label>
          <input value={bankDetails} onChange={e => setBankDetails(e.target.value)} type="text" placeholder="Bank Name, Account Title, IBAN" className="w-full px-3 py-2 border rounded-md" />
        </div>
      </div>
    </form>
  );
}
