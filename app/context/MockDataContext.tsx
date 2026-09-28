"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// Mock Data
export const FMCG_PRODUCTS = [
  { id: 'SKU-01', sku: 'SKU-01', name: 'Nestle Pure Life Water 1.5L', uom: 'Case', price: 18.00, cost: 14.00, tax: 18 },
  { id: 'SKU-02', sku: 'SKU-02', name: 'Unilever Dove Soap Bar 100g', uom: 'Outer', price: 48.00, cost: 32.00, tax: 18 },
  { id: 'SKU-03', sku: 'SKU-03', name: 'Lays Potato Chips Classic 50g', uom: 'Case', price: 24.00, cost: 18.00, tax: 5 },
  { id: 'SKU-04', sku: 'SKU-04', name: 'Coca Cola Can 330ml', uom: 'Case', price: 21.60, cost: 16.00, tax: 18 }
];

export const CUSTOMERS = [
  { id: 'CUST-001', name: 'Metro Supermarket Outlet #4', limit: 2500, balance: 1200, route: 'Downtown Expressway Beat A' },
  { id: 'CUST-002', name: 'Corner Grocery Store', limit: 500, balance: 450, route: 'Wholesale Market Route B' },
  { id: 'CUST-003', name: 'Highway Mart & Fuel', limit: 1500, balance: 200, route: 'Highway Suburban Beat C' }
];

export const LOGISTICS = {
  routes: ['Downtown Expressway Beat A', 'Wholesale Market Route B', 'Highway Suburban Beat C'],
  vehicles: ['Van FMCG-01 (Toyota HiAce)', 'Heavy Delivery Truck TRK-04', 'Motorbike Cargo Bike MB-09'],
  riders: ['John Doe (Rider Lead)', 'Michael Chang (Driver)', 'Sanjay Kumar (Express Rider)']
};

const MockDataContext = createContext<any>(null);

export function MockDataProvider({ children }: { children: React.ReactNode }) {
  const [poDatabase, setPoDatabase] = useState<any[]>([]);
  const [salesOrders, setSalesOrders] = useState<any[]>([]);
  
  useEffect(() => {
    const savedPO = localStorage.getItem('fmcg_po_db');
    if (savedPO) setPoDatabase(JSON.parse(savedPO));
    
    const savedSO = localStorage.getItem('fmcg_sales_db');
    if (savedSO) setSalesOrders(JSON.parse(savedSO));
  }, []);

  const savePOs = (data: any[]) => {
    setPoDatabase(data);
    localStorage.setItem('fmcg_po_db', JSON.stringify(data));
  };

  const saveSOs = (data: any[]) => {
    setSalesOrders(data);
    localStorage.setItem('fmcg_sales_db', JSON.stringify(data));
  };

  return (
    <MockDataContext.Provider value={{ poDatabase, savePOs, salesOrders, saveSOs }}>
      {children}
    </MockDataContext.Provider>
  );
}

export function useMockData() {
  return useContext(MockDataContext);
}
