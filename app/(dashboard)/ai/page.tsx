import { prisma } from "@/lib/prisma";
import Link from "next/link";
import AiChatWindow from "@/components/AiChatWindow";

export default async function AiDashboardPage() {
  let insights: any[] = [];
  
  try {
    insights = await prisma.aiInsight.findMany({
      orderBy: { confidenceScore: 'desc' },
      take: 20
    });
  } catch (err) {
    console.error("Prisma error:", err);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center gap-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
            AI Command Center
          </h1>
          <p className="text-sm text-[#64748B] mt-1">Smart predictions, fraud detection, and automated suggestions requiring your approval.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-[#E2E8F0] hover:bg-gray-50 text-[#0F172A] px-4 py-2 rounded-md text-sm font-semibold shadow-sm transition-all flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a10 10 0 1 0 10 10 10 10 0 0 0-10-10zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/><path d="M12 6v6l4 2"/></svg>
            Historical Accuracy
          </button>
          <button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-4 py-2 rounded-md text-sm font-semibold shadow-md transition-all active:scale-[0.98]">
            Scan System Now
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-purple-200 shadow-sm border-l-4 border-l-purple-500 hover:shadow-md transition-all cursor-pointer">
          <p className="text-sm font-medium text-[#64748B]">Demand Forecasting</p>
          <p className="text-2xl font-bold text-[#0F172A] mt-2">12</p>
          <p className="text-xs text-purple-600 mt-1 font-medium">Restock suggestions ready</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-red-200 shadow-sm border-l-4 border-l-red-500 hover:shadow-md transition-all cursor-pointer">
          <p className="text-sm font-medium text-[#64748B]">Fraud & Anomalies</p>
          <p className="text-2xl font-bold text-red-600 mt-2">2</p>
          <p className="text-xs text-[#64748B] mt-1">Suspicious returns flagged</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-orange-200 shadow-sm border-l-4 border-l-orange-500 hover:shadow-md transition-all cursor-pointer">
          <p className="text-sm font-medium text-[#64748B]">Expiry Risks</p>
          <p className="text-2xl font-bold text-orange-600 mt-2">5</p>
          <p className="text-xs text-[#64748B] mt-1">Batches expiring in 60 days</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-green-200 shadow-sm border-l-4 border-l-green-500 hover:shadow-md transition-all cursor-pointer">
          <p className="text-sm font-medium text-[#64748B]">Route Optimization</p>
          <p className="text-2xl font-bold text-green-600 mt-2">18%</p>
          <p className="text-xs text-[#64748B] mt-1">Est. fuel savings today</p>
        </div>
      </div>
      
      {/* Live AI Chat Interface */}
      <AiChatWindow />

      <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden flex flex-col mt-6">
        <div className="p-4 border-b border-[#E2E8F0] flex gap-4 bg-gray-50/50 items-center justify-between">
          <h2 className="font-bold text-[#0F172A]">AI Action Inbox</h2>
          <span className="text-xs text-[#64748B]">Review and approve AI suggestions</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-3 font-semibold">AI Confidence</th>
                <th className="px-6 py-3 font-semibold">Category</th>
                <th className="px-6 py-3 font-semibold">Insight & Recommendation</th>
                <th className="px-6 py-3 font-semibold text-center">Status</th>
                <th className="px-6 py-3 font-semibold text-right">Human Approval</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {insights.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                       <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                       <p className="text-[#64748B]">No AI insights currently pending.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                insights.map(insight => (
                  <tr key={insight.id} className="hover:bg-purple-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-gray-200 rounded-full h-2 max-w-[60px]">
                          <div className={`h-2 rounded-full ${insight.confidenceScore > 85 ? 'bg-green-500' : insight.confidenceScore > 60 ? 'bg-orange-500' : 'bg-red-500'}`} style={{ width: `${insight.confidenceScore}%` }}></div>
                        </div>
                        <span className="text-xs font-bold text-[#0F172A]">{insight.confidenceScore}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-semibold tracking-wide">
                        {insight.type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                       <div className="font-bold text-[#0F172A]">{insight.insightTitle}</div>
                       <div className="text-xs text-[#64748B] max-w-md truncate">{insight.insightDetails}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold
                        ${insight.status === 'APPROVED' ? 'bg-[#10B981]/10 text-[#10B981]' : 
                          insight.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                          'bg-purple-100 text-purple-700'}`}
                      >
                        {insight.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button className="bg-green-50 text-green-700 hover:bg-green-100 px-3 py-1.5 rounded-md text-xs font-bold transition-colors">
                        Approve
                      </button>
                      <button className="bg-red-50 text-red-700 hover:bg-red-100 px-3 py-1.5 rounded-md text-xs font-bold transition-colors">
                        Reject
                      </button>
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
