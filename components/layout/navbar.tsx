// components/navbar.tsx
"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

/**
 * Responsive Navbar with accessible mobile hamburger menu.
 * Does NOT use Sheet — pure React + Tailwind.
 */
export function Navbar() {
  return (
    <header className="w-full bg-white text-gray-800 sticky top-0 z-50 shadow-sm border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="text-xl font-bold tracking-tight hover:opacity-90 transition-opacity text-blue-600"
        >
          Learning SQL The Easy Way
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden sm:flex items-center gap-8">
          <NavLinks />
        </nav>

        {/* Mobile Navigation (hamburger) */}
        <div className="sm:hidden">
          <MobileNav />
        </div>
      </div>
    </header>
  );
}

function NavLinks({ onClick }: { onClick?: () => void }) {
  // extracted so we can reuse inside mobile menu (close on click)
  const links = [
    { href: "/", label: "Home" },
    { href: "/learning", label: "Learning" },
    { href: "/practice", label: "Practice" },
    { href: "/quiz", label: "Quiz" },
  ];

  return (
    <>
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className="text-sm font-medium hover:text-blue-600 transition-colors duration-200 px-3 py-2 rounded-md hover:bg-blue-50"
          onClick={onClick}
        >
          {l.label}
        </Link>
      ))}
    </>
  );
}

function MobileNav() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);

  // lock body scroll when menu open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // close on Escape and click outside
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    function onDocClick(e: MouseEvent) {
      const target = e.target as Node;
      if (open && panelRef.current && !panelRef.current.contains(target)) {
        setOpen(false);
      }
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onDocClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onDocClick);
    };
  }, [open]);

  return (
    <div className="relative">
      <button
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((s) => !s)}
        className="h-9 w-9 inline-flex items-center justify-center rounded-md hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 transition-colors"
        aria-label={open ? "Close menu" : "Open menu"}
        title={open ? "Close menu" : "Open menu"}
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Animated panel: slide-over from right on wider phones, full-screen dropdown on small */}
      <div
        id="mobile-menu"
        ref={panelRef}
        className={`fixed inset-0 top-16 z-40 transform transition-all duration-300 ease-in-out bg-white
          ${open ? "opacity-100 translate-x-0 pointer-events-auto" : "opacity-0 translate-x-full pointer-events-none"}
          sm:absolute sm:inset-auto sm:right-0 sm:top-full sm:mt-2 sm:w-[280px] sm:rounded-lg sm:shadow-xl sm:border sm:border-gray-200`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
      >
        <nav className="flex flex-col gap-1 p-4 sm:p-6">
          {/* Links close the menu on click */}
          <NavLinks onClick={() => setOpen(false)} />
        </nav>
        
        {/* Close button for mobile */}
        <div className="sm:hidden absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <Button 
            variant="outline" 
            onClick={() => setOpen(false)}
            className="w-32"
          >
            Close
          </Button>
        </div>
      </div>
      
      {/* Backdrop for mobile */}
      {open && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 sm:hidden"
          aria-hidden="true"
        />
      )}
    </div>
  );
}