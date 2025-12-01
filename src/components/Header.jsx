import React from "react";

export default function Header() {
  return (
    <header className="bg-white/60 backdrop-blur-md shadow-lg border-b border-white/40">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
        
        {/* Logo on left, large size, without affecting header height */}
      <img
        src="/assets/logo3.png"
        alt="Movie Matrix"
        className="h-24 w-auto object-contain select-none transform scale-150 origin-left"
        draggable="false"
      />
      </div>
    </header>
  );
}
