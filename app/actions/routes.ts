"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createRoute(data: {
  name: string;
  code: string;
  territoryId: string | null;
  visitDays: string;
}) {
  let tenant = await prisma.tenant.findFirst();
  if (!tenant) throw new Error("No tenant found");

  await prisma.route.create({
    data: {
      tenantId: tenant.id,
      name: data.name,
      code: data.code,
      territoryId: data.territoryId || null,
      visitDays: data.visitDays,
    }
  });

  revalidatePath("/routes");
  return { success: true };
}

export async function updateRoute(id: string, data: {
  name: string;
  code: string;
  territoryId: string | null;
  visitDays: string;
}) {
  let tenant = await prisma.tenant.findFirst();
  if (!tenant) throw new Error("No tenant found");

  await prisma.route.update({
    where: { id },
    data: {
      name: data.name,
      code: data.code,
      territoryId: data.territoryId || null,
      visitDays: data.visitDays,
    }
  });

  revalidatePath("/routes");
  return { success: true };
}
