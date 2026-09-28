import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function Customer360Page() {
  // Normally we would get the ID from params, but for demo we fetch the first customer
  let customer: any = null;
  try {
    customer = await prisma.customer.findFirst({
      include: {
        ledgers: { orderBy: { date: 'desc' }, take: 5 },
        visits: { orderBy: { date: 'desc' }, take: 5 },
        bouncedCheques: { orderBy: { date: 'desc' }, take: 5 },
        contacts: true,
        addresses: true,
        documents: true,
        salesOrders: { orderBy: { date: 'desc' }, take: 5 }
      }
    });

    // Dummy data generation if none exists
    if (!customer) {
      return <div className="p-10 text-center">No customers found. Please add a customer first.</div>;
    }
  } catch (err) {
    console.error(err);
    return <div className="p-10 text-center">Database error. Did you run npx prisma generate?</div>;
  }

  // Artificial Risk calculation for the premium AI feature
  const getRiskColor = (score: number) => {
    if (score < 30) return "text-green-600 bg-green-50 border-green-200";
    if (score < 70) return "text-orange-600 bg-orange-50 border-orange-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/customers" className="text-[#64748B] hover:text-[#0F172A] transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Customer 360 View</h1>
          <p className="text-sm text-[#64748B] mt-1">Complete profile, financials, and AI Risk analysis for {customer.name}.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Column 1: Identity & KYC */}
        <div className="space-y-6">
          <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getRiskColor(customer.riskScore)}`}>
                AI RISK SCORE: {customer.riskScore}/100
              </span>
            </div>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="h-16 w-16 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-sm">
                {customer.name.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#0F172A]">{customer.name}</h2>
                <p className="text-sm font-medium text-[#64748B]">{customer.shopName || customer.code}</p>
                <span className="inline-block mt-1 bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs font-semibold">
                  Class: {customer.classification || 'B'} • {customer.category}
                </span>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-[#64748B]">Phone</span>
                <span className="font-medium text-[#0F172A]">{customer.phone || 'N/A'}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-[#64748B]">Route / Area</span>
                <span className="font-medium text-[#0F172A]">{customer.route || 'N/A'} / {customer.area || 'N/A'}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-[#64748B]">Drug Licence</span>
                <span className="font-mono text-teal-700">{customer.drugLicenceNumber || 'Not Provided'}</span>
              </div>
              <div className="flex justify-between pb-2">
                <span className="text-[#64748B]">Approval Status</span>
                <span className={`font-bold ${customer.approvalStatus === 'APPROVED' ? 'text-green-600' : 'text-orange-600'}`}>
                  {customer.approvalStatus}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm p-6">
            <h3 className="font-bold text-[#0F172A] mb-4">KYC Documents</h3>
            {customer.documents.length === 0 ? (
              <p className="text-sm text-[#64748B] italic">No documents uploaded.</p>
            ) : (
              <ul className="space-y-2">
                {customer.documents.map((doc: any) => (
                  <li key={doc.id} className="flex justify-between text-sm items-center">
                    <span className="text-teal-600 font-medium hover:underline cursor-pointer">{doc.title}</span>
                    <span className="text-xs text-[#64748B]">Exp: {doc.expiryDate ? new Date(doc.expiryDate).toLocaleDateString() : 'N/A'}</span>
                  </li>
                ))}
              </ul>
            )}
            <button className="mt-4 w-full text-xs font-semibold text-[#64748B] border border-dashed border-[#E2E8F0] rounded-md py-2 hover:bg-gray-50 hover:text-[#0F172A] transition-colors">
              + Upload Document
            </button>
          </div>
        </div>

        {/* Column 2: Financials & Ledger */}
        <div className="space-y-6">
          <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm p-6">
            <h3 className="font-bold text-[#0F172A] mb-4 flex items-center justify-between">
              Credit Overview
              <span className="text-xs font-normal text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">Profitability: High</span>
            </h3>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-3 rounded-lg border border-[#E2E8F0]">
                <div className="text-xs text-[#64748B] mb-1">Credit Limit</div>
                <div className="font-mono font-bold text-[#0F172A]">Rs {customer.creditLimit.toLocaleString()}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-[#E2E8F0]">
                <div className="text-xs text-[#64748B] mb-1">Credit Days</div>
                <div className="font-mono font-bold text-[#0F172A]">{customer.creditDays} Days</div>
              </div>
            </div>

            <h4 className="text-sm font-semibold text-[#0F172A] mb-2">Recent Ledger Activity</h4>
            {customer.ledgers.length === 0 ? (
              <p className="text-sm text-[#64748B] italic">No financial activity.</p>
            ) : (
              <div className="space-y-3">
                {customer.ledgers.map((l: any) => (
                  <div key={l.id} className="flex justify-between text-sm border-b border-gray-100 pb-2 last:border-0">
                    <div>
                      <div className="font-medium text-[#0F172A]">{l.documentType}</div>
                      <div className="text-xs text-[#64748B]">{new Date(l.date).toLocaleDateString()} • {l.documentId}</div>
                    </div>
                    <div className="text-right">
                      {l.debit > 0 && <div className="font-mono text-red-600">Dr {l.debit.toLocaleString()}</div>}
                      {l.credit > 0 && <div className="font-mono text-green-600">Cr {l.credit.toLocaleString()}</div>}
                      <div className="text-xs font-mono font-bold text-[#0F172A]">Bal: {l.balance.toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white border border-red-200 rounded-xl shadow-sm p-6 bg-red-50/30">
            <h3 className="font-bold text-red-900 mb-4 flex justify-between">
              Cheque Bounce History
              <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">{customer.bouncedCheques.length} Incidents</span>
            </h3>
            {customer.bouncedCheques.length === 0 ? (
              <p className="text-sm text-[#64748B] italic">Clean record. No bounced cheques.</p>
            ) : (
              <div className="space-y-2 text-sm">
                {customer.bouncedCheques.map((b: any) => (
                  <div key={b.id} className="flex justify-between border-b border-red-100 pb-2">
                    <span className="text-red-800">#{b.chequeNumber}</span>
                    <span className="font-mono font-bold text-red-600">Rs {b.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Column 3: Field Operations */}
        <div className="space-y-6">
          <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm p-6">
            <h3 className="font-bold text-[#0F172A] mb-4 flex items-center justify-between">
              Salesman Visits
              <Link href="#" className="text-xs text-teal-600 hover:underline">View Map</Link>
            </h3>
            {customer.visits.length === 0 ? (
              <p className="text-sm text-[#64748B] italic">No recorded visits.</p>
            ) : (
              <div className="relative border-l border-[#E2E8F0] ml-2 pl-4 space-y-4">
                {customer.visits.map((v: any, idx: number) => (
                  <div key={v.id} className="relative">
                    <div className={`absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full ${v.orderAmount > 0 ? 'bg-teal-500' : 'bg-orange-500'}`}></div>
                    <div className="text-xs text-[#64748B]">{new Date(v.date).toLocaleDateString()}</div>
                    <div className="text-sm font-medium text-[#0F172A]">
                      {v.orderAmount > 0 ? `Order placed: Rs ${v.orderAmount.toLocaleString()}` : 'No Order'}
                    </div>
                    {v.noSaleReason && <div className="text-xs text-orange-600 italic mt-0.5">Reason: {v.noSaleReason}</div>}
                    {v.notes && <div className="text-xs text-[#64748B] mt-1">Note: {v.notes}</div>}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm p-6">
             <h3 className="font-bold text-[#0F172A] mb-4">Contacts & Addresses</h3>
             <div className="space-y-4 text-sm">
                <div>
                  <div className="font-semibold text-[#0F172A] border-b border-[#E2E8F0] pb-1 mb-2">Additional Contacts</div>
                  {customer.contacts.length === 0 ? <p className="text-xs text-[#64748B]">None</p> : 
                    customer.contacts.map((c: any) => (
                      <div key={c.id} className="mb-2">
                        <span className="font-medium">{c.name}</span> <span className="text-xs text-teal-600 bg-teal-50 px-1 rounded">{c.role}</span>
                        <div className="text-xs text-[#64748B]">{c.phone || c.email}</div>
                      </div>
                    ))
                  }
                </div>
                <div>
                  <div className="font-semibold text-[#0F172A] border-b border-[#E2E8F0] pb-1 mb-2">Delivery Addresses</div>
                  {customer.addresses.length === 0 ? <p className="text-xs text-[#64748B]">{customer.address || 'None'}</p> : 
                    customer.addresses.map((a: any) => (
                      <div key={a.id} className="mb-2 text-[#64748B]">
                        <span className="text-xs font-semibold text-[#0F172A]">{a.type}: </span>
                        {a.address}, {a.city}
                      </div>
                    ))
                  }
                </div>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
