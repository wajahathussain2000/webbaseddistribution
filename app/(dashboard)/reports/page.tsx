"use client";

import { useState, useEffect } from "react";
import { generateReport } from "@/app/actions/reports";

// Massive catalog of reports from 8.1
const REPORT_CATEGORIES = [
  {
    category: "Sales",
    reports: [
      "Daily Sales Summary", "Sales by Customer", "Sales by Product", "Sales by Brand",
      "Sales by Principal", "Sales by Category", "Sales by Route", "Sales by Salesman", 
      "Sales by Branch", "Invoice Register", "Sales Return Register", "Discount & Scheme Report",
      "Pending Orders", "Order vs Delivery (Fill Rate)", "Top and Bottom Customers",
      "Sales Trend & Comparison", "Salesman Performance", "Below-Cost Sales", "Cancelled Invoices"
    ]
  },
  {
    category: "Purchase",
    reports: [
      "PO Register", "Pending PO", "GRN Register", "Purchase by Supplier", 
      "Purchase by Product", "Purchase Return", "Price Variance", "Supplier Rate Comparison",
      "Landed Cost Sheet", "Purchase vs Budget"
    ]
  },
  {
    category: "Inventory",
    reports: [
      "Current Stock (Item/Batch/WH)", "Stock Ledger", "Stock Valuation (FIFO/LIFO/Average)",
      "Stock Aging", "Near-Expiry Stock", "Expired Stock", "Fast/Slow/Dead Stock",
      "Reorder List", "Stock Count Variance", "Transfer Register", "Van Stock", 
      "Batch History & Trace", "Negative Stock", "ABC Analysis", "Days of Stock Left"
    ]
  },
  {
    category: "Credit & Recovery",
    reports: [
      "Customer Ledger & Statement", "Aging Report", "Overdue List", "Credit-Limit Exceeded",
      "PDC Register", "Bounced Cheques", "Recovery vs Target", "Salesman-wise Outstanding",
      "Promise-to-Pay List", "Bad-Debt List", "Collection Forecast"
    ]
  },
  {
    category: "Accounting & Tax",
    reports: [
      "Trial Balance", "General Ledger", "Cash Book", "Bank Book", "Profit & Loss",
      "Balance Sheet", "Cash Flow", "Bank Reconciliation", "Profit by Branch/Route",
      "Sales Tax Summary", "Sales Tax Detail", "Withholding Tax", "Fixed Asset Register", "Financial Ratios"
    ]
  }
];

export default function ComprehensiveReportsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReport, setSelectedReport] = useState("Daily Sales Summary");
  const [dateFilter, setDateFilter] = useState("this_month");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [reportData, setReportData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const runReport = async () => {
    setIsLoading(true);
    setErrorMessage("");
    const res = await generateReport(selectedReport, dateFilter);
    if (res.success) {
      setReportData(res.data);
    } else {
      setErrorMessage(res.message);
      setReportData([]);
    }
    setIsLoading(false);
  };

  // Run automatically on load or report change
  useEffect(() => {
    runReport();
  }, [selectedReport]);

  // Filter reports based on search query
  const filteredCategories = REPORT_CATEGORIES.map(cat => ({
    ...cat,
    reports: cat.reports.filter(r => r.toLowerCase().includes(searchQuery.toLowerCase()))
  })).filter(cat => cat.reports.length > 0);

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Comprehensive Reporting Engine</h1>
          <p className="text-sm text-[#64748B] mt-1">Generate, filter, and export complex multi-table joined reports instantly.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-[#E2E8F0] hover:bg-gray-50 text-red-600 px-4 py-2 rounded-md text-sm font-semibold shadow-sm transition-all flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            Export PDF
          </button>
          <button className="bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-700 hover:to-emerald-600 text-white px-4 py-2 rounded-md text-sm font-semibold shadow-md transition-all active:scale-[0.98] flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M8 13h2v4H8z"/><path d="M14 13h2v4h-2z"/></svg>
            Export to Excel
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-[#E2E8F0] shrink-0 grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
        
        {/* Searchable Report Dropdown */}
        <div className="md:col-span-5 relative">
          <label className="block text-xs font-bold text-[#64748B] uppercase tracking-wider mb-2">Select Report</label>
          <div 
            className="w-full bg-gray-50 border border-gray-200 text-[#0F172A] px-4 py-2.5 rounded-lg cursor-pointer flex justify-between items-center"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <span className="font-semibold text-sm">{selectedReport}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
          </div>
          
          {isDropdownOpen && (
            <div className="absolute top-full mt-2 w-full bg-white border border-[#E2E8F0] shadow-xl rounded-lg z-50 max-h-96 flex flex-col">
              <div className="p-3 border-b border-gray-100 shrink-0">
                <input 
                  type="text" 
                  placeholder="Search 100+ reports..." 
                  className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-md text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              <div className="overflow-y-auto p-2">
                {filteredCategories.length === 0 ? (
                  <p className="p-4 text-center text-sm text-gray-500">No reports found.</p>
                ) : (
                  filteredCategories.map((cat, idx) => (
                    <div key={idx} className="mb-3 last:mb-0">
                      <div className="px-3 py-1 text-xs font-bold text-teal-600 uppercase tracking-wider bg-teal-50 rounded mb-1">{cat.category}</div>
                      {cat.reports.map((report, rIdx) => (
                        <div 
                          key={rIdx} 
                          className={`px-3 py-2 text-sm rounded cursor-pointer hover:bg-gray-50 ${selectedReport === report ? 'bg-teal-50 text-teal-700 font-bold' : 'text-gray-700'}`}
                          onClick={() => {
                            setSelectedReport(report);
                            setIsDropdownOpen(false);
                            setSearchQuery("");
                          }}
                        >
                          {report}
                        </div>
                      ))}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Date Filter Dropdown */}
        <div className="md:col-span-3">
          <label className="block text-xs font-bold text-[#64748B] uppercase tracking-wider mb-2">Time Period</label>
          <select 
            className="w-full bg-gray-50 border border-gray-200 text-[#0F172A] px-4 py-2.5 rounded-lg text-sm font-semibold focus:outline-none focus:border-teal-500"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          >
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="this_week">This Week</option>
            <option value="this_month">This Month</option>
            <option value="last_month">Last Month</option>
            <option value="this_quarter">This Quarter</option>
            <option value="this_year">This Year</option>
            <option value="custom">Custom Date Range...</option>
          </select>
        </div>

        {/* Custom Date Pickers (if custom is selected) */}
        {dateFilter === 'custom' && (
           <>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-[#64748B] uppercase tracking-wider mb-2">Start Date</label>
                <input type="date" className="w-full bg-gray-50 border border-gray-200 text-[#0F172A] px-3 py-2.5 rounded-lg text-sm font-semibold focus:outline-none" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-[#64748B] uppercase tracking-wider mb-2">End Date</label>
                <input type="date" className="w-full bg-gray-50 border border-gray-200 text-[#0F172A] px-3 py-2.5 rounded-lg text-sm font-semibold focus:outline-none" />
              </div>
           </>
        )}

        {dateFilter !== 'custom' && (
          <div className="md:col-span-4 flex items-end">
             <button onClick={runReport} disabled={isLoading} className="w-full bg-[#0F172A] hover:bg-slate-800 text-white px-4 py-2.5 rounded-lg text-sm font-bold shadow-md transition-all active:scale-[0.98] disabled:opacity-50">
               {isLoading ? "Running..." : "Run Report"}
             </button>
          </div>
        )}
      </div>

      {/* Generated Report Data Table Area */}
      <div className="flex-1 bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-[#E2E8F0] flex gap-4 bg-gray-50/50 items-center justify-between shrink-0">
          <h2 className="font-bold text-[#0F172A]">{selectedReport}</h2>
          <span className="text-xs text-[#64748B] font-mono">Generated: {new Date().toLocaleString()}</span>
        </div>
        
        {/* Mock Table Area representing massive joined data */}
        <div className="flex-1 overflow-auto p-0">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] uppercase tracking-wider text-xs sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="px-6 py-3 font-semibold border-r border-gray-100">Date</th>
                <th className="px-6 py-3 font-semibold border-r border-gray-100">Branch</th>
                <th className="px-6 py-3 font-semibold border-r border-gray-100">Reference</th>
                <th className="px-6 py-3 font-semibold border-r border-gray-100">Customer / Supplier</th>
                <th className="px-6 py-3 font-semibold border-r border-gray-100">Product Category</th>
                <th className="px-6 py-3 font-semibold border-r border-gray-100">Quantity</th>
                <th className="px-6 py-3 font-semibold text-right">Total Value (Rs)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {errorMessage ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-red-500 font-semibold">{errorMessage}</td>
                </tr>
              ) : reportData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">No data found for this report.</td>
                </tr>
              ) : (
                reportData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-teal-50 transition-colors">
                    <td className="px-6 py-3 border-r border-gray-50">{row.date}</td>
                    <td className="px-6 py-3 border-r border-gray-50 font-medium">{row.branch}</td>
                    <td className="px-6 py-3 border-r border-gray-50 font-mono text-xs">{row.reference}</td>
                    <td className="px-6 py-3 border-r border-gray-50 text-indigo-700 font-bold">{row.party}</td>
                    <td className="px-6 py-3 border-r border-gray-50 text-[#64748B]">{row.category}</td>
                    <td className="px-6 py-3 border-r border-gray-50">{row.quantity}</td>
                    <td className="px-6 py-3 text-right font-bold text-[#0F172A]">Rs {row.total?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  </tr>
                ))
              )}
            </tbody>
            <tfoot className="bg-gray-50 font-bold text-[#0F172A] sticky bottom-0 border-t border-gray-200">
              <tr>
                <td colSpan={5} className="px-6 py-3 text-right uppercase text-xs">Total:</td>
                <td className="px-6 py-3">{reportData.reduce((sum, r) => sum + (r.quantity || 0), 0)}</td>
                <td className="px-6 py-3 text-right">Rs {reportData.reduce((sum, r) => sum + (r.total || 0), 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
