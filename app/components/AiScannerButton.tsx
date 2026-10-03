"use client";

import { useState, useRef } from "react";

interface AiScannerButtonProps {
  onScanComplete: (data: any) => void;
  buttonText?: string;
}

export default function AiScannerButton({ onScanComplete, buttonText = "Scan AI Document" }: AiScannerButtonProps) {
  const [isScanning, setIsScanning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAiScan = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

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

  return (
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
        disabled={isScanning}
        className="bg-purple-100 hover:bg-purple-200 text-purple-700 px-4 py-2 rounded-lg font-bold text-sm transition-colors flex items-center gap-2 shadow-sm border border-purple-200 disabled:opacity-50"
      >
        {isScanning ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4 text-purple-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
    </>
  );
}
