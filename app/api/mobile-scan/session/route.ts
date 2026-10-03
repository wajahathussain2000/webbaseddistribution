import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await prisma.mobileScanSession.create({
      data: {
        status: "PENDING"
      }
    });
    return NextResponse.json({ sessionId: session.id });
  } catch (err) {
    return NextResponse.json({ error: "Failed to create session" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    
    const session = await prisma.mobileScanSession.findUnique({
      where: { id }
    });
    
    if (!session) return NextResponse.json({ error: "Not found" }, { status: 404 });
    
    return NextResponse.json(session);
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch session" }, { status: 500 });
  }
}
