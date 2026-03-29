"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signUp } from "@/lib/auth";

export default function CadastroPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setLoading(true);

    const { error: authError } = await signUp(email, password, name);

    if (authError) {
      if (authError.message.includes("already registered")) {
        setError("Este email já está registrado. Tente fazer login.");
      } else {
        setError(authError.message);
      }
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  };

  return (
    <div className="hero-bg min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center text-white font-bold text-2xl shadow-lg">
              G
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-white mt-4">
            Criar sua conta
          </h1>
          <p className="text-[var(--color-text-muted)] text-sm mt-2">
            Comece a divulgar seus grupos gratuitamente
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 space-y-5">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Nome
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome"
              required
              className="w-full bg-white/5 border border-[var(--color-border)] rounded-xl px-4 py-3.5 text-white placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent-primary)] transition-colors text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              className="w-full bg-white/5 border border-[var(--color-border)] rounded-xl px-4 py-3.5 text-white placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent-primary)] transition-colors text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Senha
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                required
                minLength={6}
                className="w-full bg-white/5 border border-[var(--color-border)] rounded-xl px-4 py-3.5 pr-12 text-white placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent-primary)] transition-colors text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-white transition-colors text-sm"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Confirmar Senha
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repita a senha"
              required
              className="w-full bg-white/5 border border-[var(--color-border)] rounded-xl px-4 py-3.5 text-white placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent-primary)] transition-colors text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl gradient-bg text-white font-semibold text-base hover:opacity-90 transition-all shadow-lg shadow-[var(--color-accent-primary)]/30 disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Criando conta...
              </span>
            ) : (
              "Criar Conta Grátis"
            )}
          </button>

          <div className="text-center pt-2">
            <p className="text-[var(--color-text-muted)] text-sm">
              Já tem conta?{" "}
              <Link href="/login" className="text-[var(--color-accent-secondary)] hover:text-[var(--color-accent-primary)] font-medium transition-colors">
                Fazer login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
