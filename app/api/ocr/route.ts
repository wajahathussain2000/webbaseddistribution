import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const maxDuration = 60;

// Uses process.env.OPENAI_API_KEY automatically if set
const openai = new OpenAI();

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    const mimeType = file.type || 'image/jpeg';
    const dataUrl = `data:${mimeType};base64,${base64}`;

    const prompt = `You are an expert OCR and data entry assistant for an ERP system. 
Analyze the provided invoice/bill image and extract the information into a strict JSON object.
Return ONLY valid JSON. The JSON structure MUST exactly match this:
{
  "poNumber": "string (extract invoice or order number, if none make one up based on date)",
  "expectedDate": "string (YYYY-MM-DD format, extract the date)",
  "notes": "string (any extra vendor info, addresses, or terms)",
  "items": [
    {
      "name": "string (the name or description of the product)",
      "qty": number (the quantity, must be a number),
      "rate": number (the unit price, must be a number)
    }
  ]
}
If any fields cannot be found, provide reasonable defaults (e.g., empty string for notes, 1 for qty).`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            { type: "image_url", image_url: { url: dataUrl } },
          ],
        },
      ],
      response_format: { type: "json_object" },
      max_tokens: 1500
    });

    const jsonStr = response.choices[0].message.content || "{}";
    const parsed = JSON.parse(jsonStr);

    const sessionId = formData.get("sessionId") as string;
    if (sessionId) {
      try {
        const { prisma } = await import("@/lib/prisma");
        await prisma.mobileScanSession.update({
          where: { id: sessionId },
          data: {
            status: "COMPLETED",
            extractedData: jsonStr
          }
        });
      } catch (e) {
        console.error("Failed to update session:", e);
      }
    }

    return NextResponse.json(parsed);
  } catch (error: any) {
    console.error("OCR API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
