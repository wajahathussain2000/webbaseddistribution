"use client";

import { useState, useRef, use } from "react";

export default function MobileScanPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [status, setStatus] = useState<"IDLE" | "UPLOADING" | "SUCCESS" | "ERROR">("IDLE");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const compressImage = async (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 1000;
          let width = img.width;
          let height = img.height;
          
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);
          canvas.toBlob((blob) => {
            if (blob) resolve(blob);
            else reject(new Error("Compression failed"));
          }, "image/jpeg", 0.6); // 60% quality is usually enough for OCR and reduces size significantly
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleAiScan = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatus("UPLOADING");
    try {
      // Compress the image before uploading to bypass Vercel's 4.5MB Payload limit
      const compressedBlob = await compressImage(file);
      
      const formData = new FormData();
      formData.append("file", compressedBlob, "invoice.jpg");
      formData.append("sessionId", id);

      const res = await fetch("/api/ocr", {
        method: "POST",
        body: formData
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error("Server Error:", errText);
        throw new Error("Failed to scan document");
      }
      setStatus("SUCCESS");
    } catch (err) {
      console.error(err);
      setStatus("ERROR");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-white text-center">
      <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-2xl flex items-center justify-center text-white font-bold mb-8 shadow-xl">
        E
      </div>
      
      <h1 className="text-2xl font-bold mb-2">ERP SaaS Scanner</h1>
      <p className="text-slate-400 mb-12">Take a photo of the invoice to instantly send it to your desktop.</p>

      {status === "IDLE" || status === "ERROR" ? (
        <>
          <input 
            type="file" 
            accept="image/*" 
            capture="environment" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleAiScan}
          />
          <button 
            type="button" 
            onClick={() => fileInputRef.current?.click()}
            className="w-full max-w-sm bg-teal-600 hover:bg-teal-700 text-white px-6 py-4 rounded-2xl font-bold text-lg shadow-lg flex items-center justify-center gap-3 transition-transform active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Take Invoice Photo
          </button>
          
          {status === "ERROR" && (
            <p className="text-red-400 mt-6 bg-red-400/10 p-3 rounded-lg">Upload failed. Please try again.</p>
          )}
        </>
      ) : status === "UPLOADING" ? (
        <div className="flex flex-col items-center">
          <svg className="animate-spin h-12 w-12 text-teal-500 mb-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-xl font-bold">Scanning & Uploading...</p>
          <p className="text-slate-400 mt-2">Please wait, analyzing with AI.</p>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-2xl font-bold text-emerald-400">Scan Complete!</p>
          <p className="text-slate-400 mt-2">Check your desktop screen, the data is ready.</p>
          <button 
            onClick={() => setStatus("IDLE")} 
            className="mt-8 text-teal-400 font-medium hover:underline"
          >
            Scan another document
          </button>
        </div>
      )}
    </div>
  );
}
