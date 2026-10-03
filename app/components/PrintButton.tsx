"use client";

export default function PrintButton() {
  return (
    <button 
      onClick={() => window.print()} 
      className="bg-white border border-[#E2E8F0] px-4 py-2 rounded-md shadow-sm text-sm font-semibold hover:bg-slate-50 transition-colors"
    >
      Print Report
    </button>
  );
}
