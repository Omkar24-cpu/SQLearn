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
    <header className="w-full bg-gradient-to-r bg-white text-black sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="text-xl font-bold tracking-tight hover:opacity-90 transition-opacity"
        >
          Learning SQL The Easy Way
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden sm:flex items-center gap-6">
          <NavLinks />
          <Button
            variant="secondary"
            size="sm"
            className="ml-2 bg-white text-blue-600 hover:bg-white/90"
          >
            Sign in
          </Button>
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
          className="text-sm font-medium hover:text-white/90 transition-colors"
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
        className="h-9 w-9 inline-flex items-center justify-center rounded-md hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
        aria-label={open ? "Close menu" : "Open menu"}
        title={open ? "Close menu" : "Open menu"}
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Animated panel: slide-over from right on wider phones, full-screen dropdown on small */}
      <div
        id="mobile-menu"
        ref={panelRef}
        className={`absolute right-0 top-full mt-2 z-40 transform transition-all duration-200 ease-in-out origin-top-right
          ${open ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"}
          w-[240px] sm:w-[300px] bg-white text-gray-900 rounded-lg shadow-lg p-4`}
        role="dialog"
        aria-modal="true"
      >
        <nav className="flex flex-col gap-4">
          {/* Links close the menu on click */}
          <NavLinks onClick={() => setOpen(false)} />
          <Button variant="default" className="w-full mt-2" onClick={() => setOpen(false)}>
            Sign in
          </Button>
        </nav>
      </div>
    </div>
  );
}
