"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createProduct(formData: FormData) {
  // In a real app, we get the tenantId from the logged-in user's session.
  // For this prototype, we'll fetch the first tenant or create one.
  let tenant = await prisma.tenant.findFirst();
  if (!tenant) {
    tenant = await prisma.tenant.create({ data: { name: "Default Company" } });
  }

  // We need a Base UOM to create a product. Fetch or create a default one.
  let uom = await prisma.unitOfMeasure.findFirst({ where: { tenantId: tenant.id } });
  if (!uom) {
    uom = await prisma.unitOfMeasure.create({ 
      data: { tenantId: tenant.id, code: "BOX", name: "Box" } 
    });
  }

  const code = formData.get("code") as string;
  const nameEn = formData.get("nameEn") as string;
  const type = formData.get("type") as string; // 'PHARMACY' or 'FMCG'
  const valuationMethod = formData.get("valuationMethod") as string;
  const tradePrice = parseFloat(formData.get("tradePrice") as string) || 0;
  const retailPrice = parseFloat(formData.get("retailPrice") as string) || 0;
  const cost = parseFloat(formData.get("cost") as string) || 0;

  // Build the JSON fields based on product type
  let pharmacyFields = null;
  let fmcgFields = null;

  if (type === "PHARMACY") {
    pharmacyFields = JSON.stringify({
      genericName: formData.get("genericName"),
      isColdChain: formData.get("isColdChain") === "on",
      isPrescription: formData.get("isPrescription") === "on",
    });
  } else if (type === "FMCG") {
    fmcgFields = JSON.stringify({
      shelfLifeDays: formData.get("shelfLifeDays"),
      caseSize: formData.get("caseSize"),
    });
  }

  await prisma.product.create({
    data: {
      tenantId: tenant.id,
      code,
      nameEn,
      type,
      valuationMethod,
      tradePrice,
      retailPrice,
      cost,
      baseUomId: uom.id,
      isActive: true,
      pharmacyFields,
      fmcgFields
    }
  });

  // Revalidate the products list page so the new item shows up
  revalidatePath("/products");
  redirect("/products");
}
