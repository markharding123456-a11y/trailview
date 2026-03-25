"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function Nav() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const close = () => setOpen(false);

  const navLinks = [
    { href: "/#how-it-works", label: "How It Works" },
    { href: "/activities", label: "Activities" },
    { href: "/regions", label: "Regions" },
    { href: "/contribute", label: "Contribute" },
    { href: "/upload", label: "Upload" },
    { href: "/explore", label: "Explore" },
  ];

  return (
    <nav role="navigation" aria-label="Main navigation" className="bg-brand-dark/95 backdrop-blur-sm text-white sticky top-0 z-50 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight">TRAILVIEW</span>
        </Link>

        {/* Desktop nav - unchanged */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/#how-it-works" className="text-sm text-white/80 hover:text-white transition-colors focus-visible:text-white focus-visible:outline-none">How It Works</Link>
          <Link href="/activities" className="text-sm text-white/80 hover:text-white transition-colors focus-visible:text-white focus-visible:outline-none">Activities</Link>
          <Link href="/regions" className="text-sm text-white/80 hover:text-white transition-colors focus-visible:text-white focus-visible:outline-none">Regions</Link>
          <Link href="/contribute" className="text-sm text-white/80 hover:text-white transition-colors focus-visible:text-white focus-visible:outline-none">Contribute</Link>
          <Link href="/upload" className="text-sm text-white/80 hover:text-white transition-colors focus-visible:text-white focus-visible:outline-none">Upload</Link>
          <Link
            href="/signup"
            className="bg-green-500 hover:bg-green-400 text-white px-5 py-2 rounded-xl text-sm font-semibold transition-colors shadow-lg hover:shadow-green-500/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2"
          >
            Sign Up
          </Link>
          <Link
            href="/explore"
            className="bg-white/10 hover:bg-white/20 text-white px-5 py-2 rounded-xl text-sm font-semibold transition-colors border border-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2"
          >
            Explore
          </Link>
        </div>

        {/* Mobile hamburger button */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {/* Hamburger / X icon with animated lines */}
          <div className="w-5 h-4 relative flex flex-col justify-between">
            <span
              className={`block h-0.5 w-5 bg-white rounded transition-all duration-300 origin-center ${
                open ? "translate-y-[7px] rotate-45" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-5 bg-white rounded transition-all duration-300 ${
                open ? "opacity-0 scale-x-0" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-5 bg-white rounded transition-all duration-300 origin-center ${
                open ? "-translate-y-[7px] -rotate-45" : ""
              }`}
            />
          </div>
        </button>
      </div>

      {/* Mobile menu overlay */}
      <div
        className={`md:hidden fixed inset-0 top-[57px] z-40 transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/50" onClick={close} />

        {/* Menu panel */}
        <div
          ref={menuRef}
          role="dialog"
          aria-label="Mobile menu"
          className={`relative bg-brand-dark border-b border-white/10 shadow-2xl transition-all duration-300 ease-out ${
            open ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={close}
                className="text-white/80 hover:text-white hover:bg-white/5 px-4 py-3 rounded-lg text-base font-medium transition-colors focus-visible:text-white focus-visible:outline-none"
              >
                {link.label}
              </Link>
            ))}

            {/* CTA buttons */}
            <div className="flex flex-col gap-3 mt-3 pt-4 border-t border-white/10 px-4">
              <Link
                href="/signup"
                onClick={close}
                className="bg-green-500 hover:bg-green-400 text-white text-center px-5 py-3 rounded-xl text-sm font-semibold transition-colors shadow-lg hover:shadow-green-500/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2"
              >
                Sign Up
              </Link>
              <Link
                href="/explore"
                onClick={close}
                className="bg-white/10 hover:bg-white/20 text-white text-center px-5 py-3 rounded-xl text-sm font-semibold transition-colors border border-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2"
              >
                Explore
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
