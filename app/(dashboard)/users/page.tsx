import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import Link from "next/link";
import RoleForm from "./RoleForm";
import UserForm from "./UserForm";

export default async function UsersRolesPage() {
  const session = await auth();
  if (!session?.user?.id) return <div>Unauthorized</div>;

  const userTenant = await prisma.tenantUser.findFirst({
    where: { userId: session.user.id }
  });
  if (!userTenant) return <div>No tenant assigned</div>;

  const roles = await prisma.role.findMany({
    where: { tenantId: userTenant.tenantId },
    include: { permissions: true, _count: { select: { users: true } } }
  });

  const tenantUsers = await prisma.tenantUser.findMany({
    where: { tenantId: userTenant.tenantId },
    include: { user: true, role: true }
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A]">Users & Roles</h1>
        <p className="text-sm text-[#64748B] mt-1">Manage who has access to your system and what they can do.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Side: Users */}
        <div className="space-y-6">
          <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-[#0F172A] mb-4">Team Members</h2>
            <div className="space-y-3">
              {tenantUsers.map(tu => (
                <div key={tu.id} className="flex justify-between items-center p-3 hover:bg-slate-50 border border-slate-100 rounded-lg">
                  <div>
                    <p className="font-semibold text-slate-800">{tu.user.name}</p>
                    <p className="text-xs text-slate-500">{tu.user.email}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                    {tu.role?.name || "No Role"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-[#0F172A] mb-4">Invite New User</h2>
            <UserForm roles={roles} />
          </div>
        </div>

        {/* Right Side: Roles */}
        <div className="space-y-6">
          <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-[#0F172A] mb-4">Security Roles</h2>
            <div className="grid grid-cols-1 gap-4">
              {roles.map(r => (
                <div key={r.id} className="p-4 border border-slate-200 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-slate-800">{r.name}</h3>
                      <p className="text-xs text-slate-500">{r.description || "No description"}</p>
                    </div>
                    <span className="text-xs font-semibold text-slate-400">{r._count.users} users</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {r.permissions.map(p => (
                      <span key={p.id} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-mono">
                        {p.action}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-[#0F172A] mb-4">Create Custom Role</h2>
            <RoleForm />
          </div>
        </div>

      </div>
    </div>
  );
}
