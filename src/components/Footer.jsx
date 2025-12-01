import React from "react";

export default function Footer() {
  return (
    <footer className="mt-10 bg-[#f2f2f2] backdrop-blur-md shadow-lg border-t border-white/40">
      <div className="max-w-6xl mx-auto px-4 py-4 text-center text-sm text-gray-700">
        <p className="opacity-80">
          &copy;{new Date().getFullYear()} Movie Matrix | Built by Rajveer
        </p>
        <p className="opacity-60 text-xs mt-1">
          Data provided by TMDb. This product uses the TMDb API but is not endorsed or certified by TMDb.
        </p>
      </div>
    </footer>
  );
}
