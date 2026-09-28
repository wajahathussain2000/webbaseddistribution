import { prisma } from "@/lib/prisma";
import RouteForm from "./RouteForm";

export default async function NewRoutePage() {
  let territories: any[] = [];
  try {
    territories = await prisma.territory.findMany({
      orderBy: { name: 'asc' }
    });
  } catch (err) {
    console.error("Prisma error:", err);
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A]">Create New Route</h1>
        <p className="text-sm text-[#64748B]">Define a new route and assign it to a territory.</p>
      </div>
      
      <RouteForm territories={territories} />
    </div>
  );
}
