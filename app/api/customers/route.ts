import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const customer = await prisma.customer.create({
      data: {
        name: data.name,
        shopName: data.shopName || null,
        phone: data.phone || null,
        category: data.category,
        creditLimit: data.creditLimit,
        creditDays: data.creditDays,
        status: data.status,
        code: `CUST-${Math.floor(1000 + Math.random() * 9000)}`,
        tenantId: "default-tenant" // Assuming single tenant for demo
      }
    });
    return NextResponse.json(customer);
  } catch (error: any) {
    console.error('Customer Creation Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
