// src/components/SkeletonCard.jsx
import React from "react";

export default function SkeletonCard() {
  return (
    <div className="animate-pulse bg-white rounded-xl shadow-sm p-3 flex flex-col gap-3 border border-slate-200">
      <div className="h-56 w-full bg-slate-200 rounded-lg" />

      <div className="space-y-2">
        <div className="h-4 w-3/4 bg-slate-200 rounded" />
        <div className="h-3 w-1/2 bg-slate-200 rounded" />
      </div>
    </div>
  );
}
