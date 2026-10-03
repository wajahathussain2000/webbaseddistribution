"use client";

import { useState, useMemo } from "react";
import { createPosTransaction } from "@/app/actions/pos";

export default function PosInterface({ products, warehouses, accounts }: { products: any[], warehouses: any[], accounts: any[] }) {
  const [cart, setCart] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [warehouseId, setWarehouseId] = useState(warehouses[0]?.id || "");
  const [accountId, setAccountId] = useState(accounts[0]?.id || ""); // Usually Cash in hand
  
  const [amountTendered, setAmountTendered] = useState<string>("");

  const filteredProducts = useMemo(() => {
    return products.filter(p => 
      p.nameEn.toLowerCase().includes(search.toLowerCase()) || 
      p.code.toLowerCase().includes(search.toLowerCase())
    );
  }, [products, search]);

  const addToCart = (product: any) => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === product.id);
      if (existing) {
        return prev.map(item => 
          item.productId === product.id 
            ? { ...item, qty: item.qty + 1, total: (item.qty + 1) * item.rate } 
            : item
        );
      }
      return [...prev, {
        productId: product.id,
        name: product.nameEn,
        code: product.code,
        qty: 1,
        rate: product.retailPrice || 0,
        discount: 0,
        total: product.retailPrice || 0
      }];
    });
  };

  const updateCartQty = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.productId === productId) {
        const newQty = Math.max(1, item.qty + delta);
        return { ...item, qty: newQty, total: newQty * item.rate };
      }
      return item;
    }));
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.total, 0);
  const discount = 0; // simplified for MVP
  const tax = 0; // simplified for MVP
  const total = subtotal - discount + tax;

  const tendered = parseFloat(amountTendered) || 0;
  const changeGiven = Math.max(0, tendered - total);

  const handleCheckout = async () => {
    if (cart.length === 0) return alert("Cart is empty.");
    if (!warehouseId || !accountId) return alert("Select Store and Register Account.");
    if (tendered < total) return alert("Amount tendered is less than total.");

    setIsSubmitting(true);
    try {
      const receiptNumber = `RCPT-${Math.floor(Date.now() / 1000)}`;
      await createPosTransaction({
        receiptNumber,
        paymentMethod: "CASH",
        subtotal,
        discount,
        tax,
        total,
        amountTendered: tendered,
        changeGiven,
        warehouseId,
        accountId,
        items: cart.map(item => ({
          productId: item.productId,
          qty: item.qty,
          rate: item.rate,
          discount: item.discount,
          total: item.total
        }))
      });
      alert(`Sale Complete! Change due: Rs ${changeGiven.toFixed(2)}`);
      setCart([]);
      setAmountTendered("");
    } catch (err: any) {
      alert(err.message || "Failed to process sale.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Left Area: Product Grid */}
      <div className="flex-1 flex flex-col bg-slate-50 border-r border-slate-200">
        <div className="p-4 bg-white border-b border-slate-200 shadow-sm flex items-center gap-4">
          <input 
            type="text" 
            placeholder="Search products or scan barcode..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 px-4 py-2.5 bg-slate-100 border-none rounded-lg text-slate-800 focus:ring-2 focus:ring-teal-500 shadow-inner"
            autoFocus
          />
          <select value={warehouseId} onChange={e => setWarehouseId(e.target.value)} className="px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700">
            {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
          </select>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredProducts.map(p => (
              <button 
                key={p.id} 
                onClick={() => addToCart(p)}
                className="bg-white p-3 rounded-xl shadow-sm border border-slate-200 hover:border-teal-500 hover:shadow-md transition-all text-left flex flex-col h-32 active:scale-95"
              >
                <div className="text-xs font-semibold text-teal-600 mb-1">{p.category?.name || "General"}</div>
                <div className="font-bold text-slate-800 text-sm leading-tight line-clamp-2 flex-1">{p.nameEn}</div>
                <div className="flex justify-between items-end mt-2 w-full">
                  <div className="text-xs text-slate-400 font-mono">{p.code}</div>
                  <div className="font-bold text-slate-900">Rs {p.retailPrice?.toFixed(2)}</div>
                </div>
              </button>
            ))}
            {filteredProducts.length === 0 && (
              <div className="col-span-full py-12 text-center text-slate-400">
                No products found.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Area: Current Cart / Checkout */}
      <div className="w-96 bg-white flex flex-col shadow-[-4px_0_15px_rgba(0,0,0,0.05)] z-10">
        <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
          <h2 className="font-bold">Current Sale</h2>
          <button onClick={() => setCart([])} className="text-xs font-semibold text-rose-300 hover:text-white px-2 py-1 rounded bg-white/10 hover:bg-rose-500 transition-colors">Clear</button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-sm">Cart is empty. Add products to begin.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map(item => (
                <div key={item.productId} className="flex flex-col p-3 border border-slate-100 bg-slate-50 rounded-lg group">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-semibold text-slate-800 text-sm">{item.name}</div>
                    <div className="font-bold text-slate-900 text-sm">Rs {item.total.toFixed(2)}</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-xs text-slate-500 font-mono">@ Rs {item.rate.toFixed(2)}/ea</div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center bg-white border border-slate-200 rounded shadow-sm">
                        <button onClick={() => updateCartQty(item.productId, -1)} className="px-2 py-0.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 font-bold">-</button>
                        <div className="px-2 text-sm font-semibold min-w-[2rem] text-center">{item.qty}</div>
                        <button onClick={() => updateCartQty(item.productId, 1)} className="px-2 py-0.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 font-bold">+</button>
                      </div>
                      <button onClick={() => removeFromCart(item.productId)} className="text-rose-500 hover:text-rose-700 p-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-slate-50 border-t border-slate-200 p-4 space-y-3">
          <div className="flex justify-between text-sm text-slate-600">
            <span>Subtotal</span>
            <span>Rs {subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold text-slate-900 border-b border-slate-200 pb-3">
            <span>Total</span>
            <span className="text-teal-600">Rs {total.toFixed(2)}</span>
          </div>

          <div className="pt-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Cash Tendered</label>
            <input 
              type="number" 
              value={amountTendered} 
              onChange={e => setAmountTendered(e.target.value)} 
              placeholder="0.00" 
              className="w-full text-right text-xl font-bold p-3 border-2 border-teal-100 rounded-lg focus:border-teal-500 focus:ring-0 transition-colors"
            />
          </div>

          {tendered >= total && total > 0 && (
            <div className="flex justify-between items-center text-rose-600 font-bold py-1">
              <span>Change</span>
              <span className="text-xl">Rs {changeGiven.toFixed(2)}</span>
            </div>
          )}

          <div className="pt-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Register Account</label>
            <select value={accountId} onChange={e => setAccountId(e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm mb-4">
              {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
            
            <button 
              onClick={handleCheckout}
              disabled={cart.length === 0 || isSubmitting || tendered < total}
              className="w-full bg-slate-900 hover:bg-teal-600 text-white font-bold py-4 rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? "Processing..." : (
                <>
                  Checkout <span className="font-mono bg-white/20 px-2 py-0.5 rounded text-sm">Rs {total.toFixed(2)}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
