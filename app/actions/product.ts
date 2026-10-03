"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export async function createProduct(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const userTenant = await prisma.tenantUser.findFirst({
    where: { userId: session.user.id }
  });
  if (!userTenant) throw new Error("No tenant assigned to user");

  const tenantId = userTenant.tenantId;

  const uomIdForm = formData.get("baseUomId") as string;
  let uomId = uomIdForm;

  if (!uomId) {
    const uom = await prisma.unitOfMeasure.findFirst({ where: { tenantId } });
    if (!uom) throw new Error("No Unit of Measure found for this tenant. Please create one first.");
    uomId = uom.id;
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
      tenantId: tenantId,
      code,
      nameEn,
      type,
      valuationMethod,
      tradePrice,
      retailPrice,
      cost,
      baseUomId: uomId,
      isActive: true,
      pharmacyFields,
      fmcgFields
    }
  });

  // Revalidate the products list page so the new item shows up
  revalidatePath("/products");
  redirect("/products");
}
