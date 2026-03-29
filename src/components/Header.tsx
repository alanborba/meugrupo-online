"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 glass border-b border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg gradient-bg flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform">
              G
            </div>
            <span className="text-xl font-bold gradient-text">
              MeuGrupo
            </span>
            <span className="text-xs text-[var(--color-text-muted)] hidden sm:inline">.online</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className="px-4 py-2 rounded-lg text-[var(--color-text-secondary)] hover:text-white hover:bg-white/5 transition-all text-sm font-medium"
            >
              Início
            </Link>
            <Link
              href="/explorar"
              className="px-4 py-2 rounded-lg text-[var(--color-text-secondary)] hover:text-white hover:bg-white/5 transition-all text-sm font-medium"
            >
              Explorar
            </Link>
            <Link
              href="/adicionar"
              className="ml-2 px-5 py-2 rounded-lg gradient-bg text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-[var(--color-accent-primary)]/25"
            >
              + Adicionar Grupo
            </Link>
          </nav>

          {/* Mobile burger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
            aria-label="Menu"
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <span
                className={`h-0.5 bg-white rounded transition-all ${
                  isOpen ? "rotate-45 translate-y-2" : ""
                }`}
              />
              <span
                className={`h-0.5 bg-white rounded transition-all ${
                  isOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`h-0.5 bg-white rounded transition-all ${
                  isOpen ? "-rotate-45 -translate-y-2" : ""
                }`}
              />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            isOpen ? "max-h-60 pb-4" : "max-h-0"
          }`}
        >
          <nav className="flex flex-col gap-1">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="px-4 py-3 rounded-lg text-[var(--color-text-secondary)] hover:text-white hover:bg-white/5 transition-all text-sm font-medium"
            >
              Início
            </Link>
            <Link
              href="/explorar"
              onClick={() => setIsOpen(false)}
              className="px-4 py-3 rounded-lg text-[var(--color-text-secondary)] hover:text-white hover:bg-white/5 transition-all text-sm font-medium"
            >
              Explorar
            </Link>
            <Link
              href="/adicionar"
              onClick={() => setIsOpen(false)}
              className="px-4 py-3 rounded-lg gradient-bg text-white text-sm font-semibold text-center hover:opacity-90 transition-opacity"
            >
              + Adicionar Grupo
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
