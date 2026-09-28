import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    // For demo purposes, if the dummy customer doesn't exist, create it
    let customer = await prisma.customer.findFirst({
      where: { tenantId: "default-tenant" }
    });
    
    if (!customer) {
       customer = await prisma.customer.create({
          data: {
             name: "Demo Customer",
             category: "RETAILER",
             creditLimit: 50000,
             creditDays: 30,
             status: "ACTIVE",
             code: "DEMO-1",
             tenantId: "default-tenant"
          }
       });
    }

    const receipt = await prisma.customerReceipt.create({
      data: {
        customerId: customer.id,
        amount: data.amount,
        paymentMethod: data.paymentMethod,
        reference: data.reference || null,
        status: data.status,
        receiptNumber: `REC-${Math.floor(10000 + Math.random() * 90000)}`,
        date: new Date(),
        tenantId: "default-tenant"
      }
    });
    return NextResponse.json(receipt);
  } catch (error: any) {
    console.error('Receipt Creation Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
