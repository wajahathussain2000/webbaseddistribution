"use client";

import React from "react";

export default function DemoAlertButton({ 
  message, 
  className, 
  children 
}: { 
  message: string; 
  className?: string; 
  children: React.ReactNode 
}) {
  return (
    <button onClick={() => alert(message)} className={className}>
      {children}
    </button>
  );
}
