import { prisma } from "@/lib/prisma";
import RouteForm from "../../new/RouteForm";
import { notFound } from "next/navigation";

export default async function EditRoutePage({ params }: { params: { id: string } }) {
  const route = await prisma.route.findUnique({
    where: { id: params.id }
  });
  
  if (!route) {
    notFound();
  }

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
        <h1 className="text-2xl font-bold text-[#0F172A]">Edit Route</h1>
        <p className="text-sm text-[#64748B]">Modify the details of an existing route.</p>
      </div>
      
      <RouteForm territories={territories} initialData={route} />
    </div>
  );
}
