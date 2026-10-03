"use client";

import { useState } from "react";
import { createRole } from "@/app/actions/roles";

const AVAILABLE_PERMISSIONS = [
  "pos:access",
  "sales:manage",
  "purchase:manage",
  "inventory:manage",
  "finance:manage",
  "reports:view",
  "users:manage"
];

export default function RoleForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedPerms, setSelectedPerms] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const togglePerm = (perm: string) => {
    setSelectedPerms(prev => 
      prev.includes(perm) ? prev.filter(p => p !== perm) : [...prev, perm]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || selectedPerms.length === 0) return alert("Name and at least 1 permission required.");
    
    setIsSubmitting(true);
    try {
      await createRole({ name, description, permissions: selectedPerms });
      setName("");
      setDescription("");
      setSelectedPerms([]);
      alert("Role created successfully!");
    } catch (err: any) {
      alert(err.message || "Failed to create role");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-semibold text-slate-700 block mb-1">Role Name</label>
        <input value={name} onChange={e => setName(e.target.value)} type="text" placeholder="e.g. Cashier" className="w-full px-3 py-2 border rounded-md" required />
      </div>
      <div>
        <label className="text-sm font-semibold text-slate-700 block mb-1">Description</label>
        <input value={description} onChange={e => setDescription(e.target.value)} type="text" placeholder="e.g. Can only access POS" className="w-full px-3 py-2 border rounded-md" />
      </div>
      
      <div>
        <label className="text-sm font-semibold text-slate-700 block mb-2">Permissions</label>
        <div className="grid grid-cols-2 gap-2">
          {AVAILABLE_PERMISSIONS.map(perm => (
            <label key={perm} className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 p-2 rounded border border-slate-100 cursor-pointer hover:bg-slate-100">
              <input 
                type="checkbox" 
                checked={selectedPerms.includes(perm)} 
                onChange={() => togglePerm(perm)}
                className="w-4 h-4 text-teal-600"
              />
              <span className="font-mono text-xs">{perm}</span>
            </label>
          ))}
        </div>
      </div>

      <button disabled={isSubmitting} type="submit" className="w-full bg-slate-900 text-white font-bold py-2 rounded-md hover:bg-teal-600 transition-colors">
        {isSubmitting ? "Saving..." : "Save Role"}
      </button>
    </form>
  );
}
