"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

// Gets the current user's role and permissions
export async function getMyPermissions() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const userTenant = await prisma.tenantUser.findFirst({
    where: { userId: session.user.id },
    include: { role: { include: { permissions: true } } }
  });

  return userTenant?.role?.permissions.map(p => p.action) || [];
}

export async function createRole(data: { name: string; description?: string; permissions: string[] }) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const userTenant = await prisma.tenantUser.findFirst({
    where: { userId: session.user.id }
  });
  if (!userTenant) throw new Error("No tenant");

  const role = await prisma.role.create({
    data: {
      tenantId: userTenant.tenantId,
      name: data.name,
      description: data.description,
      permissions: {
        create: data.permissions.map(action => ({ action }))
      }
    }
  });

  revalidatePath("/roles");
  revalidatePath("/users");
  return role;
}

export async function inviteUserToTenant(data: { email: string; name: string; roleId: string; branchIds?: string[] }) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const userTenant = await prisma.tenantUser.findFirst({
    where: { userId: session.user.id }
  });
  if (!userTenant) throw new Error("No tenant");

  // Simplified MVP: Find user by email or create a placeholder user account
  let user = await prisma.user.findUnique({ where: { email: data.email } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        username: data.email,
        // Using a dummy password for now since this is an MVP without an email invitation flow
        passwordHash: "$2b$10$dummyHashPlaceholderForMvpDontUseInProd",
      }
    });
  }

  // Assign user to tenant with specific role
  await prisma.tenantUser.create({
    data: {
      userId: user.id,
      tenantId: userTenant.tenantId,
      roleId: data.roleId
    }
  });

  revalidatePath("/users");
  return { success: true };
}
