"use client";

import React from "react";

interface BarcodeImageProps {
  barcode: string;
  width?: number;
  height?: number;
  className?: string;
}

export default function BarcodeImage({ barcode, width = 120, height = 40, className = "" }: BarcodeImageProps) {
  if (!barcode) return null;
  
  // Using bwip-js API to auto-generate standard barcode (code128) image for scanning
  const barcodeUrl = `https://bwipjs-api.metafloor.com/?bcid=code128&text=${encodeURIComponent(barcode)}&scale=3&height=${height}&includetext`;

  return (
    <div className={`inline-block bg-white p-1 rounded-sm border border-gray-200 ${className}`}>
      <img 
        src={barcodeUrl} 
        alt={`Barcode ${barcode}`}
        className="w-full h-auto object-contain"
        style={{ width: `${width}px`, minHeight: `${height}px` }}
      />
    </div>
  );
}
