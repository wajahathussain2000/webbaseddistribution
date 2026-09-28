import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding database with comprehensive test data...")
  
  const tenant = await prisma.tenant.create({
    data: {
      name: "Global Distribution Co.",
      address: "123 Main Warehouse, City",
      phone: "+1 234 567 890",
      taxNumber: "TAX-998877",
      subscriptionPlan: "ENTERPRISE",
    }
  })
  
  const branchHQ = await prisma.branch.create({
    data: {
      tenantId: tenant.id,
      name: "Head Office",
      code: "HQ",
      type: "HEAD_OFFICE"
    }
  })

  const branchWholesale = await prisma.branch.create({
    data: {
      tenantId: tenant.id,
      name: "Wholesale Depot",
      code: "WH-01",
      type: "WAREHOUSE"
    }
  })

  // Create Suppliers
  const supplier1 = await prisma.supplier.create({
    data: { tenantId: tenant.id, name: "Abbott Laboratories", contact: "John Vendor", phone: "555-1122" }
  })
  const supplier2 = await prisma.supplier.create({
    data: { tenantId: tenant.id, name: "GSK Pharmaceuticals", contact: "Sarah GSK", phone: "555-9988" }
  })
  const supplier3 = await prisma.supplier.create({
    data: { tenantId: tenant.id, name: "Nestle Corp", contact: "Mike Nestle", phone: "555-4433" }
  })

  // Create Customers
  await prisma.customer.createMany({
    data: [
      { tenantId: tenant.id, name: "City Pharmacy", phone: "555-0011", address: "Downtown", creditLimit: 500000, category: "PHARMACY" },
      { tenantId: tenant.id, name: "Care Medicals", phone: "555-0022", address: "Uptown", creditLimit: 200000, category: "CLINIC" },
      { tenantId: tenant.id, name: "SuperMart Plus", phone: "555-0033", address: "Suburbs", creditLimit: 1000000, category: "SUPERMARKET" }
    ]
  })

  // Categories & UOMs
  const catPharma = await prisma.category.create({ data: { tenantId: tenant.id, name: "Painkillers" } })
  const catFMCG = await prisma.category.create({ data: { tenantId: tenant.id, name: "Beverages" } })
  const uomBox = await prisma.unitOfMeasure.create({ data: { tenantId: tenant.id, code: "BOX", name: "Box" } })
  const uomCarton = await prisma.unitOfMeasure.create({ data: { tenantId: tenant.id, code: "CTN", name: "Carton" } })
  const uomPcs = await prisma.unitOfMeasure.create({ data: { tenantId: tenant.id, code: "PCS", name: "Pieces" } })

  // Create Products with the new fields
  // @ts-ignore (Temporary until prisma generate runs successfully)
  const product1 = await prisma.product.create({
    data: {
      tenantId: tenant.id,
      code: "PRD-001",
      barcode: "8901111222333", // Dummy Barcode
      nameEn: "Panadol 500mg",
      categoryId: catPharma.id,
      baseUomId: uomBox.id,
      supplierId: supplier2.id,
      cost: 12.0,
      tradePrice: 15.5,
      retailPrice: 20.0,
      rbp: 16.0,
      minSellingPrice: 18.0,
      type: "PHARMACY",
      brandName: "Panadol",
      companyName: "GSK",
      innerBoxQty: 10,
      packagingMaterial: "Blister Pack",
      taxCode: "TAX-Med",
      taxMethod: "EXCLUSIVE",
      gstVat: 5,
      minQty: 100,
      maxQty: 5000,
      shelfLifeDays: 730,
    }
  })

  // @ts-ignore
  const product2 = await prisma.product.create({
    data: {
      tenantId: tenant.id,
      code: "PRD-002",
      barcode: "8902222333444",
      nameEn: "Centrum Silver",
      categoryId: catPharma.id,
      baseUomId: uomBox.id,
      supplierId: supplier1.id,
      cost: 100.0,
      tradePrice: 120.0,
      retailPrice: 150.0,
      rbp: 125.0,
      minSellingPrice: 135.0,
      type: "PHARMACY",
      brandName: "Centrum",
      companyName: "Abbott",
      innerBoxQty: 1,
      packagingMaterial: "Bottle",
      taxCode: "TAX-Med",
      taxMethod: "EXCLUSIVE",
      gstVat: 5,
      minQty: 50,
      maxQty: 1000,
      shelfLifeDays: 1095,
    }
  })

  // @ts-ignore
  const product3 = await prisma.product.create({
    data: {
      tenantId: tenant.id,
      code: "FMCG-001",
      barcode: "8903333444555",
      nameEn: "Nescafe Classic 200g",
      categoryId: catFMCG.id,
      baseUomId: uomCarton.id,
      supplierId: supplier3.id,
      cost: 800.0,
      tradePrice: 850.0,
      retailPrice: 950.0,
      rbp: 870.0,
      minSellingPrice: 900.0,
      type: "FMCG",
      brandName: "Nescafe",
      companyName: "Nestle",
      innerBoxQty: 24,
      packagingMaterial: "Glass Jar",
      taxCode: "TAX-Food",
      taxMethod: "INCLUSIVE",
      gstVat: 18,
      minQty: 200,
      maxQty: 10000,
      shelfLifeDays: 365,
    }
  })

  await prisma.aiInsight.createMany({
    data: [
      {
        tenantId: tenant.id,
        type: "DEMAND_FORECAST",
        insightTitle: "Panadol Spike Expected",
        insightDetails: "Historical data suggests a 40% spike in Panadol sales next week. Suggest creating PO for 5000 units.",
        confidenceScore: 92,
        status: "PENDING",
        entityType: "Product",
        entityId: product1.id
      },
      {
        tenantId: tenant.id,
        type: "FRAUD_ALERT",
        insightTitle: "Unusual Discount by Salesman",
        insightDetails: "Salesman Ali applied 45% discount on Invoice #219 (Avg is 10%).",
        confidenceScore: 88,
        status: "PENDING",
        entityType: "Invoice",
        entityId: "INV-219"
      }
    ]
  })

  console.log("Database seeded successfully with Tenant, Branches, Products, Customers, Vendors, and AI Insights!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
