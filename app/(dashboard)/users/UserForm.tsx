"use client";

import { useState } from "react";
import { inviteUserToTenant } from "@/app/actions/roles";

export default function UserForm({ roles }: { roles: any[] }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [roleId, setRoleId] = useState(roles[0]?.id || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !roleId) return alert("All fields are required.");
    
    setIsSubmitting(true);
    try {
      await inviteUserToTenant({ name, email, roleId });
      setName("");
      setEmail("");
      alert("User successfully added to your tenant!");
    } catch (err: any) {
      alert(err.message || "Failed to add user");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-semibold text-slate-700 block mb-1">Full Name</label>
        <input value={name} onChange={e => setName(e.target.value)} type="text" placeholder="e.g. John Doe" className="w-full px-3 py-2 border rounded-md" required />
      </div>
      <div>
        <label className="text-sm font-semibold text-slate-700 block mb-1">Email Address</label>
        <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="john@example.com" className="w-full px-3 py-2 border rounded-md" required />
      </div>
      <div>
        <label className="text-sm font-semibold text-slate-700 block mb-1">Assign Role</label>
        <select value={roleId} onChange={e => setRoleId(e.target.value)} className="w-full px-3 py-2 border rounded-md" required>
          {roles.map(r => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
          {roles.length === 0 && <option value="">No roles available - create one first</option>}
        </select>
      </div>

      <button disabled={isSubmitting || roles.length === 0} type="submit" className="w-full bg-teal-600 text-white font-bold py-2 rounded-md hover:bg-teal-700 transition-colors">
        {isSubmitting ? "Inviting..." : "Add User"}
      </button>
    </form>
  );
}
