import PosScreen from "./PosScreen";

export default function RetailPosPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A]">Retail POS</h1>
        <p className="text-sm text-[#64748B]">Fast billing and counter checkout.</p>
      </div>
      
      <PosScreen products={[]} />
    </div>
  );
}
