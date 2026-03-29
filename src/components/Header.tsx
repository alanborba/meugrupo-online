"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";

export default function Header() {
  const { user, loading, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const userName = user?.user_metadata?.name || user?.email?.split("@")[0] || "Usuário";
  const userInitial = userName.charAt(0).toUpperCase();

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

            {loading ? (
              <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse ml-2" />
            ) : user ? (
              <div className="relative ml-2" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl glass hover:bg-white/10 transition-all"
                >
                  <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-white text-sm font-bold">
                    {userInitial}
                  </div>
                  <span className="text-sm text-white font-medium hidden lg:inline">{userName}</span>
                  <svg className={`w-4 h-4 text-[var(--color-text-muted)] transition-transform ${showDropdown ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showDropdown && (
                  <div className="absolute right-0 top-full mt-2 w-56 glass rounded-xl border border-[var(--color-border)] shadow-2xl overflow-hidden animate-count-up">
                    <div className="p-3 border-b border-[var(--color-border)]">
                      <p className="text-sm font-medium text-white">{userName}</p>
                      <p className="text-xs text-[var(--color-text-muted)] truncate">{user.email}</p>
                    </div>
                    <div className="p-1">
                      <Link
                        href="/dashboard"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-[var(--color-text-secondary)] hover:text-white hover:bg-white/5 transition-all"
                      >
                        📊 Dashboard
                      </Link>
                      <Link
                        href="/adicionar"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-[var(--color-text-secondary)] hover:text-white hover:bg-white/5 transition-all"
                      >
                        ➕ Adicionar Grupo
                      </Link>
                    </div>
                    <div className="p-1 border-t border-[var(--color-border)]">
                      <button
                        onClick={() => { signOut(); setShowDropdown(false); }}
                        className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-all"
                      >
                        🚪 Sair
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="ml-2 px-4 py-2 rounded-lg text-[var(--color-text-secondary)] hover:text-white hover:bg-white/5 transition-all text-sm font-medium"
                >
                  Entrar
                </Link>
                <Link
                  href="/cadastro"
                  className="px-5 py-2 rounded-lg gradient-bg text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-[var(--color-accent-primary)]/25"
                >
                  Criar Conta
                </Link>
              </>
            )}
          </nav>

          {/* Mobile burger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
            aria-label="Menu"
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <span className={`h-0.5 bg-white rounded transition-all ${isOpen ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`h-0.5 bg-white rounded transition-all ${isOpen ? "opacity-0" : ""}`} />
              <span className={`h-0.5 bg-white rounded transition-all ${isOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ${isOpen ? "max-h-80 pb-4" : "max-h-0"}`}>
          <nav className="flex flex-col gap-1">
            <Link href="/" onClick={() => setIsOpen(false)} className="px-4 py-3 rounded-lg text-[var(--color-text-secondary)] hover:text-white hover:bg-white/5 transition-all text-sm font-medium">
              Início
            </Link>
            <Link href="/explorar" onClick={() => setIsOpen(false)} className="px-4 py-3 rounded-lg text-[var(--color-text-secondary)] hover:text-white hover:bg-white/5 transition-all text-sm font-medium">
              Explorar
            </Link>
            {user ? (
              <>
                <Link href="/dashboard" onClick={() => setIsOpen(false)} className="px-4 py-3 rounded-lg text-[var(--color-text-secondary)] hover:text-white hover:bg-white/5 transition-all text-sm font-medium">
                  📊 Dashboard
                </Link>
                <Link href="/adicionar" onClick={() => setIsOpen(false)} className="px-4 py-3 rounded-lg gradient-bg text-white text-sm font-semibold text-center hover:opacity-90 transition-opacity">
                  + Adicionar Grupo
                </Link>
                <button onClick={() => { signOut(); setIsOpen(false); }} className="px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-all text-sm font-medium text-left">
                  🚪 Sair
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setIsOpen(false)} className="px-4 py-3 rounded-lg text-[var(--color-text-secondary)] hover:text-white hover:bg-white/5 transition-all text-sm font-medium">
                  Entrar
                </Link>
                <Link href="/cadastro" onClick={() => setIsOpen(false)} className="px-4 py-3 rounded-lg gradient-bg text-white text-sm font-semibold text-center hover:opacity-90 transition-opacity">
                  Criar Conta
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
