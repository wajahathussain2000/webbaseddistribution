"use server";

import { prisma } from "@/lib/prisma";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function askAiAssistant(query: string) {
  if (!process.env.OPENAI_API_KEY) {
    return { error: "OpenAI API Key is missing from environment variables." };
  }

  try {
    // 1. Fetch real DB context from Prisma
    let productsCount = await prisma.product.count().catch(() => 0);
    let customersCount = await prisma.customer.count().catch(() => 0);
    let branchesCount = await prisma.branch.count().catch(() => 0);
    
    // Fetch live products for context
    const products = await prisma.product.findMany({
      take: 5,
      select: { nameEn: true, retailPrice: true, code: true }
    }).catch(() => []);

    // Fetch live suppliers for context
    const suppliers = await prisma.supplier.findMany({
      take: 5,
      select: { name: true, contact: true }
    }).catch(() => []);

    // Fetch AI Insights for context
    const insights = await prisma.aiInsight.findMany({
      take: 5,
      select: { insightTitle: true, insightDetails: true, type: true }
    }).catch(() => []);

    const erpStateContext = {
      systemStats: {
        totalProducts: productsCount,
        totalCustomers: customersCount,
        totalBranches: branchesCount
      },
      inventory: products,
      vendors: suppliers,
      systemAlerts: insights
    };

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an expert ERP and Distribution AI Assistant built into a B2B Distribution SaaS. 
          You help warehouse managers, sales managers, and owners query data and ask questions about their business operations.
          
          You have direct access to the live Multi-Tenant ERP system. Here is the CURRENT LIVE STATE of the database in JSON format:
          ${JSON.stringify(erpStateContext)}

          CRITICAL RULES:
          1. Answer the user's question directly and comprehensively using the JSON data provided above.
          2. If the user asks MULTIPLE questions in one message (e.g., "which vendor payment is due and which product expiring tomorrow?"), you MUST answer ALL of them in a single, well-formatted response. Do not get stuck.
          3. Use markdown bullet points and bold text to make your response easy to read.
          4. Act as if you are a highly advanced AI deeply integrated into their SQL database. Do not say "Based on the JSON provided" - say "Based on current system records".`
        },
        {
          role: "user",
          content: query
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return { response: response.choices[0].message.content };
  } catch (error: any) {
    console.error("OpenAI Error:", error);
    return { error: error.message || "Failed to generate AI response." };
  }
}
