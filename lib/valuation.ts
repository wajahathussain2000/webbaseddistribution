import { prisma } from "@/lib/prisma";

/**
 * Calculates the Cost of Goods Sold (COGS) for a specific product and quantity
 * based on the product's defined valuation method (FIFO, LIFO, FEFO).
 */
export async function calculateCogsForSale(productId: string, qtyToSell: number, warehouseId: string) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { valuationMethod: true, cost: true }
  });

  if (!product) throw new Error("Product not found");

  const method = product.valuationMethod || "FIFO";

  if (method === "AVERAGE") {
    // For average, we just use the fixed product.cost which is updated on every GRN
    return {
      totalCost: qtyToSell * (product.cost || 0),
      layersUsed: [],
      method: "AVERAGE"
    };
  }

  // Fetch active cost layers that have stock remaining
  let layers = await prisma.costLayer.findMany({
    where: { 
      productId, 
      warehouseId,
      qtyRemaining: { gt: 0 }
    },
    include: { batch: true },
  });

  // Sort layers based on Valuation Method
  if (method === "FIFO") {
    layers.sort((a, b) => a.date.getTime() - b.date.getTime()); // Oldest first
  } else if (method === "LIFO") {
    layers.sort((a, b) => b.date.getTime() - a.date.getTime()); // Newest first
  } else if (method === "FEFO") {
    layers.sort((a, b) => {
      // If no expiry, push to back
      if (!a.batch?.expiryDate) return 1;
      if (!b.batch?.expiryDate) return -1;
      return a.batch.expiryDate.getTime() - b.batch.expiryDate.getTime(); // Earliest expiry first
    });
  }

  let remainingQty = qtyToSell;
  let totalCost = 0;
  const layersUsed = [];

  // Consume layers
  for (const layer of layers) {
    if (remainingQty <= 0) break;

    const qtyFromThisLayer = Math.min(layer.qtyRemaining, remainingQty);
    totalCost += qtyFromThisLayer * layer.unitCost;
    remainingQty -= qtyFromThisLayer;

    layersUsed.push({
      layerId: layer.id,
      documentId: layer.documentId,
      qtyTaken: qtyFromThisLayer,
      unitCost: layer.unitCost,
      batchNumber: layer.batch?.batchNumber || 'N/A'
    });
  }

  if (remainingQty > 0) {
    // We didn't have enough layers to cover the sale.
    // The rest is valued at the default product cost as a fallback.
    totalCost += remainingQty * (product.cost || 0);
  }

  return {
    totalCost,
    layersUsed,
    method
  };
}
