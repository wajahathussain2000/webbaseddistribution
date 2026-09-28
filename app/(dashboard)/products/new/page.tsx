"use client";

import { useState } from "react";
import Link from "next/link";
import { createProduct } from "@/app/actions/product";

export default function NewProductPage() {
  const [productType, setProductType] = useState("PHARMACY");
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/products" className="text-[#64748B] hover:text-[#0F172A] transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Add New Product</h1>
          <p className="text-sm text-[#64748B] mt-1">Fill in the details to add a new item to the master list.</p>
        </div>
      </div>

      <form 
        action={async (formData) => {
          setIsSubmitting(true);
          await createProduct(formData);
        }} 
        className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm p-8 space-y-8"
      >
        {/* Section 1: Basic Info */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-[#0F172A] border-b border-[#E2E8F0] pb-2">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[#0F172A]">SKU</label>
              <input name="code" type="text" required placeholder="e.g. PRD-001" className="px-3 py-2 border border-[#E2E8F0] rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono text-sm" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[#0F172A]">Barcode</label>
              <input name="barcode" type="text" placeholder="e.g. 8901234567890" className="px-3 py-2 border border-[#E2E8F0] rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono text-sm" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[#0F172A]">Product Name</label>
              <input name="nameEn" type="text" required placeholder="e.g. Panadol Extra 500mg" className="px-3 py-2 border border-[#E2E8F0] rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[#0F172A]">Supplier Name</label>
              <input name="supplierName" type="text" placeholder="e.g. ABC Pharma" className="px-3 py-2 border border-[#E2E8F0] rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[#0F172A]">Company Name</label>
              <input name="companyName" type="text" placeholder="e.g. GSK" className="px-3 py-2 border border-[#E2E8F0] rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[#0F172A]">Brand</label>
              <input name="brand" type="text" placeholder="e.g. Panadol" className="px-3 py-2 border border-[#E2E8F0] rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[#0F172A]">Category</label>
              <input name="category" type="text" placeholder="e.g. Medicine" className="px-3 py-2 border border-[#E2E8F0] rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[#0F172A]">Sub-Category</label>
              <input name="subCategory" type="text" placeholder="e.g. Painkiller" className="px-3 py-2 border border-[#E2E8F0] rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[#0F172A]">Product Type</label>
              <select 
                name="type" 
                value={productType}
                onChange={(e) => setProductType(e.target.value)}
                className="px-3 py-2 border border-[#E2E8F0] rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
              >
                <option value="PHARMACY">Pharmacy (Medicines, Health)</option>
                <option value="FMCG">FMCG (Consumer Goods, Food)</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[#0F172A]">Valuation Method (Costing)</label>
              <select 
                name="valuationMethod" 
                className="px-3 py-2 border border-[#E2E8F0] rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
              >
                <option value="FIFO">FIFO (First In, First Out)</option>
                <option value="FEFO">FEFO (First Expiry, First Out)</option>
                <option value="LIFO">LIFO (Last In, First Out)</option>
                <option value="AVERAGE">Weighted Average Cost</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Unit & Packaging */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-[#0F172A] border-b border-[#E2E8F0] pb-2">Unit & Packaging</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[#0F172A]">UOM Unit</label>
              <input name="uomUnit" type="text" placeholder="e.g. PCS, BOX" className="px-3 py-2 border border-[#E2E8F0] rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[#0F172A]">Inner Box Unit</label>
              <input name="innerBoxUnit" type="text" placeholder="e.g. 10" className="px-3 py-2 border border-[#E2E8F0] rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[#0F172A]">Packageing Material</label>
              <input name="packagingMaterial" type="text" placeholder="e.g. Cardboard" className="px-3 py-2 border border-[#E2E8F0] rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm" />
            </div>
          </div>
        </div>

        {/* Section 3: Pricing */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-[#0F172A] border-b border-[#E2E8F0] pb-2">Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[#0F172A]">Cost Price</label>
              <input name="cost" type="number" step="0.01" required placeholder="0.00" className="px-3 py-2 border border-[#E2E8F0] rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono text-sm" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[#0F172A]">Trade Price or Distributor Landing Price</label>
              <input name="tradePrice" type="number" step="0.01" required placeholder="0.00" className="px-3 py-2 border border-[#E2E8F0] rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono text-sm" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[#0F172A]">Retailer Buying Price (RBP / Wholesale)</label>
              <input name="rbp" type="number" step="0.01" placeholder="0.00" className="px-3 py-2 border border-[#E2E8F0] rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono text-sm" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[#0F172A]">Retail Price</label>
              <input name="retailPrice" type="number" step="0.01" required placeholder="0.00" className="px-3 py-2 border border-[#E2E8F0] rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono text-sm" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[#0F172A]">Recommended Consumer Price (RCP)</label>
              <input name="rcp" type="number" step="0.01" placeholder="0.00" className="px-3 py-2 border border-[#E2E8F0] rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono text-sm" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[#0F172A]">Minimum Selling Price Floor (Base Unit)</label>
              <input name="minSellingPrice" type="number" step="0.01" placeholder="0.00" className="px-3 py-2 border border-[#E2E8F0] rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono text-sm" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[#0F172A]">DSR / Sales Rep Incentive (% per unit)</label>
              <input name="dsrIncentive" type="number" step="0.01" placeholder="0.00" className="px-3 py-2 border border-[#E2E8F0] rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono text-sm" />
            </div>
          </div>
        </div>

        {/* Section 4: Inventory Limits */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-[#0F172A] border-b border-[#E2E8F0] pb-2">Inventory Limits</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[#0F172A]">min Qty</label>
              <input name="minQty" type="number" placeholder="e.g. 10" className="px-3 py-2 border border-[#E2E8F0] rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[#0F172A]">Max Qty</label>
              <input name="maxQty" type="number" placeholder="e.g. 1000" className="px-3 py-2 border border-[#E2E8F0] rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[#0F172A]">Total Shelf Life (Days)</label>
              <input name="totalShelfLifeDays" type="number" placeholder="e.g. 365" className="px-3 py-2 border border-[#E2E8F0] rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm" />
            </div>
          </div>
        </div>

        {/* Section 5: Taxation */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-[#0F172A] border-b border-[#E2E8F0] pb-2">Taxation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[#0F172A]">tax code</label>
              <input name="taxCode" type="text" placeholder="e.g. TAX-01" className="px-3 py-2 border border-[#E2E8F0] rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[#0F172A]">tax method (Inclusive or Exclusive)</label>
              <select 
                name="taxMethod" 
                className="px-3 py-2 border border-[#E2E8F0] rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
              >
                <option value="EXCLUSIVE">Exclusive</option>
                <option value="INCLUSIVE">Inclusive</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[#0F172A]">GST or Vat</label>
              <input name="gstVat" type="number" step="0.01" placeholder="e.g. 18" className="px-3 py-2 border border-[#E2E8F0] rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[#0F172A]">Additional Cess / Excise Levy % (If Applicable)</label>
              <input name="additionalCess" type="number" step="0.01" placeholder="e.g. 5" className="px-3 py-2 border border-[#E2E8F0] rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm" />
            </div>
          </div>
        </div>

        {/* Section 6: Dynamic Advanced Fields */}
        <div className="space-y-4 bg-[#F8FAFC] p-4 rounded-lg border border-[#E2E8F0]">
          <h2 className="text-md font-semibold text-[#0F172A]">
            {productType === "PHARMACY" ? "Pharmacy Specific Details" : "FMCG Specific Details"}
          </h2>
          
          {productType === "PHARMACY" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-[#0F172A]">Generic Name (Salt)</label>
                <input name="genericName" type="text" placeholder="e.g. Paracetamol" className="px-3 py-2 border border-[#E2E8F0] rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm" />
              </div>
              <div className="flex items-center gap-4 mt-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input name="isColdChain" type="checkbox" className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500" />
                  <span className="text-sm font-medium text-[#0F172A]">Requires Cold Chain Storage (Fridge)</span>
                </label>
              </div>
              <div className="flex items-center gap-4 mt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input name="isPrescription" type="checkbox" className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500" />
                  <span className="text-sm font-medium text-[#0F172A]">Prescription Required</span>
                </label>
              </div>
            </div>
          )}

          {productType === "FMCG" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-[#0F172A]">Case Size (Units per Carton)</label>
                <input name="caseSize" type="number" placeholder="e.g. 24" className="px-3 py-2 border border-[#E2E8F0] rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm" />
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end border-t border-[#E2E8F0] pt-6">
          <Link href="/products" className="px-4 py-2 text-sm font-medium text-[#64748B] hover:text-[#0F172A] mr-4">
            Cancel
          </Link>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-700 hover:to-emerald-600 text-white px-6 py-2 rounded-md text-sm font-semibold shadow-md transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Saving..." : "Save Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
