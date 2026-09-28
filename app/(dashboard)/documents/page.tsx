import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function DocumentsPage() {
  let docs: any[] = [];
  
  try {
    docs = await prisma.documentAttachment.findMany({
      include: { uploadedBy: { include: { user: true } } },
      orderBy: { uploadedAt: 'desc' },
      take: 20
    });
  } catch (err) {
    console.error("Prisma error:", err);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Document & Data Archive</h1>
          <p className="text-sm text-[#64748B] mt-1">Manage files, scan QR codes, monitor expiring licenses, and handle bulk data tasks.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-[#E2E8F0] hover:bg-gray-50 text-[#0F172A] px-4 py-2 rounded-md text-sm font-semibold shadow-sm transition-all flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
            Import Data
          </button>
          <button className="bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-700 hover:to-emerald-600 text-white px-4 py-2 rounded-md text-sm font-semibold shadow-md transition-all active:scale-[0.98]">
            + Upload File
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm border-l-4 border-l-teal-500">
          <p className="text-sm font-medium text-[#64748B]">Total Files Archived</p>
          <p className="text-2xl font-bold text-[#0F172A] mt-2">
            {docs.length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm border-l-4 border-l-orange-500">
          <p className="text-sm font-medium text-[#64748B]">Expiring Documents</p>
          <p className="text-2xl font-bold text-orange-600 mt-2">
            0
          </p>
          <p className="text-xs text-[#64748B] mt-1">Contracts & Licenses in next 30 days</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm border-l-4 border-l-purple-500">
          <p className="text-sm font-medium text-[#64748B]">Document Templates</p>
          <p className="text-2xl font-bold text-[#0F172A] mt-2">3</p>
          <p className="text-xs text-[#64748B] mt-1">Invoice, Receipt, PO</p>
        </div>
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-xl shadow-md text-white relative overflow-hidden">
          <div className="absolute right-[-20px] top-[-20px] opacity-10">
             <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
          </div>
          <p className="text-sm font-medium text-slate-200">Full-Text Search</p>
          <div className="mt-3 flex">
            <input type="text" placeholder="Search inside PDFs..." className="w-full text-xs font-bold bg-white/10 text-white placeholder-slate-400 px-3 py-2 rounded-l border-y border-l border-slate-700 focus:outline-none" />
            <button className="bg-teal-600 px-3 py-2 rounded-r flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-[#E2E8F0] flex gap-4 bg-gray-50/50 items-center justify-between">
          <h2 className="font-bold text-[#0F172A]">Recent Uploads</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-3 font-semibold">File Name</th>
                <th className="px-6 py-3 font-semibold">Attached To</th>
                <th className="px-6 py-3 font-semibold text-center">Type / Size</th>
                <th className="px-6 py-3 font-semibold">Uploaded By</th>
                <th className="px-6 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {docs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                       <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                       <p className="text-[#64748B] font-medium">Your archive is empty.</p>
                       <p className="text-xs text-[#94A3B8] mt-1">Upload documents directly to invoices, customers, or products.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                docs.map(doc => (
                  <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                         <div className="bg-red-50 text-red-600 p-2 rounded">
                           <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                         </div>
                         <div>
                           <p className="font-bold text-[#0F172A]">{doc.fileName}</p>
                           <p className="text-xs text-[#64748B]">{new Date(doc.uploadedAt).toLocaleDateString()}</p>
                         </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-semibold tracking-wide border border-gray-200">
                        {doc.entityType}
                      </span>
                      <div className="text-xs font-mono text-[#64748B] mt-1">Ref: {doc.entityId}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="text-xs font-bold text-[#0F172A]">{doc.fileType}</div>
                      <div className="text-xs text-[#64748B]">{(doc.sizeBytes / 1024).toFixed(2)} KB</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-[#0F172A]">{doc.uploadedBy?.user?.name || 'System User'}</div>
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <button className="text-teal-600 hover:text-teal-800 font-medium">Download</button>
                      <button className="text-red-600 hover:text-red-800 font-medium">Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
