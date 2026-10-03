// ----------------------------------------------------
// Centralized Mock Data & Default Hardcoded Values
// ----------------------------------------------------

// 1. Default Setup Values (Used in actions/pages for testing/prototype)
export const DefaultEntities = {
  TENANT_NAME: "Default Company",
  BRANCH_MAIN: "Main Branch",
  BRANCH_POS: "Main POS Branch",
  WAREHOUSE_MAIN: "Main Warehouse",
  WAREHOUSE_CENTRAL: "Central Warehouse",
  CUSTOMER_DEMO: "Demo Customer",
  CUSTOMER_PHARMACY: "City Pharmacy",
  SUPPLIER_PHARMA: "GSK Pharmaceuticals",
  UOM_BOX_CODE: "BOX",
  UOM_BOX_NAME: "Box",
} as const;

// 2. Mock Application Data (Previously in MockDataContext.tsx)
export const FMCG_PRODUCTS = [
  { id: 'SKU-01', sku: 'SKU-01', name: 'Nestle Pure Life Water 1.5L', uom: 'Case', price: 18.00, cost: 14.00, tax: 18 },
  { id: 'SKU-02', sku: 'SKU-02', name: 'Unilever Dove Soap Bar 100g', uom: 'Outer', price: 48.00, cost: 32.00, tax: 18 },
  { id: 'SKU-03', sku: 'SKU-03', name: 'Lays Potato Chips Classic 50g', uom: 'Case', price: 24.00, cost: 18.00, tax: 5 },
  { id: 'SKU-04', sku: 'SKU-04', name: 'Coca Cola Can 330ml', uom: 'Case', price: 21.60, cost: 16.00, tax: 18 }
];

export const MOCK_CUSTOMERS = [
  { id: 'CUST-001', name: 'Metro Supermarket Outlet #4', limit: 2500, balance: 1200, route: 'Downtown Expressway Beat A' },
  { id: 'CUST-002', name: 'Corner Grocery Store', limit: 500, balance: 450, route: 'Wholesale Market Route B' },
  { id: 'CUST-003', name: 'Highway Mart & Fuel', limit: 1500, balance: 200, route: 'Highway Suburban Beat C' }
];

export const MOCK_LOGISTICS = {
  routes: ['Downtown Expressway Beat A', 'Wholesale Market Route B', 'Highway Suburban Beat C'],
  vehicles: ['Van FMCG-01 (Toyota HiAce)', 'Heavy Delivery Truck TRK-04', 'Motorbike Cargo Bike MB-09'],
  riders: ['John Doe (Rider Lead)', 'Michael Chang (Driver)', 'Sanjay Kumar (Express Rider)']
};
