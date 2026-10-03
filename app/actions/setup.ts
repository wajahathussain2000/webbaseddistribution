"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

export async function updateCompanyProfile(data: {
  name: string;
  address?: string;
  phone?: string;
  taxNumber?: string;
  licenseNumbers?: string;
  bankDetails?: string;
  logoUrl?: string;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const userTenant = await prisma.tenantUser.findFirst({
    where: { userId: session.user.id }
  });
  if (!userTenant) throw new Error("No tenant");

  const tenant = await prisma.tenant.update({
    where: { id: userTenant.tenantId },
    data: {
      name: data.name,
      address: data.address,
      phone: data.phone,
      taxNumber: data.taxNumber,
      licenseNumbers: data.licenseNumbers,
      bankDetails: data.bankDetails,
      logoUrl: data.logoUrl,
    }
  });

  revalidatePath("/setup");
  revalidatePath("/"); // Update layout/nav if company name is shown there
  return tenant;
}

export async function saveSystemSettings(settings: { key: string; value: string }[]) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const userTenant = await prisma.tenantUser.findFirst({
    where: { userId: session.user.id }
  });
  if (!userTenant) throw new Error("No tenant");

  // Upsert settings
  for (const setting of settings) {
    const existing = await prisma.systemSetting.findFirst({
      where: { tenantId: userTenant.tenantId, key: setting.key }
    });
    if (existing) {
      await prisma.systemSetting.update({
        where: { id: existing.id },
        data: { value: setting.value }
      });
    } else {
      await prisma.systemSetting.create({
        data: {
          tenantId: userTenant.tenantId,
          key: setting.key,
          value: setting.value
        }
      });
    }
  }

  revalidatePath("/setup");
  revalidatePath("/pos");
  revalidatePath("/sales/invoices/new");
  return { success: true };
}
