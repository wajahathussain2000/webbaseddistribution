"use client";

import { useState, useRef, useEffect } from "react";

interface AiScannerButtonProps {
  onScanComplete: (data: any) => void;
  buttonText?: string;
}

export default function AiScannerButton({ onScanComplete, buttonText = "Scan AI Document" }: AiScannerButtonProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [qrSessionId, setQrSessionId] = useState<string | null>(null);
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
          }, "image/jpeg", 0.6);
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

    setShowOptions(false);
    setIsScanning(true);
    try {
      const compressedBlob = await compressImage(file);

      const formData = new FormData();
      formData.append("file", compressedBlob, "invoice.jpg");

      const res = await fetch("/api/ocr", {
        method: "POST",
        body: formData
      });

      if (!res.ok) throw new Error("Failed to scan document");
      const data = await res.json();
      
      onScanComplete(data);
    } catch (err) {
      alert("AI Scanning failed. Please try again or check your API key.");
    } finally {
      setIsScanning(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const startMobileScan = async () => {
    setShowOptions(false);
    try {
      const res = await fetch("/api/mobile-scan/session", { method: "POST" });
      const data = await res.json();
      if (data.sessionId) {
        setQrSessionId(data.sessionId);
      }
    } catch (err) {
      alert("Failed to generate QR Code. Please try again.");
    }
  };

  // Poll the session
  useEffect(() => {
    let interval: any;
    if (qrSessionId) {
      interval = setInterval(async () => {
        try {
          const res = await fetch(`/api/mobile-scan/session?id=${qrSessionId}`);
          if (res.ok) {
            const session = await res.json();
            if (session.status === "COMPLETED" && session.extractedData) {
              setQrSessionId(null); // Close modal
              clearInterval(interval);
              try {
                const parsed = JSON.parse(session.extractedData);
                onScanComplete(parsed);
              } catch (e) {
                console.error("Failed to parse extracted data");
              }
            }
          }
        } catch (e) {
          // ignore network errors on polling
        }
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [qrSessionId, onScanComplete]);

  // Use window.location.origin for absolute QR URL
  const qrUrl = typeof window !== "undefined" && qrSessionId 
    ? `${window.location.origin}/mobile-scan/${qrSessionId}`
    : "";

  return (
    <div className="relative">
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
        onClick={() => setShowOptions(!showOptions)}
        disabled={isScanning}
        className="bg-teal-50 hover:bg-teal-100 text-teal-700 px-4 py-2 rounded-lg font-bold text-sm transition-colors flex items-center gap-2 shadow-sm border border-teal-200 disabled:opacity-50"
      >
        {isScanning ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4 text-teal-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Scanning...
          </span>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {buttonText}
          </>
        )}
      </button>

      {/* Options Dropdown */}
      {showOptions && (
        <div className="absolute right-0 top-12 mt-1 w-56 bg-white border border-slate-200 shadow-xl rounded-xl overflow-hidden z-50">
          <button
            onClick={() => { setShowOptions(false); fileInputRef.current?.click(); }}
            className="w-full text-left px-4 py-3 hover:bg-slate-50 text-slate-700 text-sm font-medium flex items-center gap-3 border-b border-slate-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Upload from PC / Device
          </button>
          <button
            onClick={startMobileScan}
            className="w-full text-left px-4 py-3 hover:bg-teal-50 text-teal-700 text-sm font-medium flex items-center gap-3"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            Scan with Mobile (QR)
          </button>
        </div>
      )}

      {/* QR Modal */}
      {qrSessionId && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setQrSessionId(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full p-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <h3 className="text-xl font-bold text-slate-800 mb-2">Scan with Mobile</h3>
            <p className="text-slate-500 text-sm mb-6">Open your phone's camera and scan this QR code to capture the invoice.</p>
            
            <div className="bg-white p-4 rounded-xl border-2 border-teal-100 mx-auto inline-block">
              {qrUrl && (
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrUrl)}&color=0F766E`} 
                  alt="QR Code" 
                  className="w-48 h-48"
                />
              )}
            </div>

            <div className="mt-6 flex items-center justify-center gap-3 text-teal-600 font-medium">
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Waiting for scan...
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
