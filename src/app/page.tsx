"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import GroupCard, { GroupCardProps } from "@/components/GroupCard";
import { CATEGORIES } from "@/lib/categories";

export default function Home() {
  const [groups, setGroups] = useState<GroupCardProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/groups?limit=6")
      .then((r) => r.json())
      .then((data) => {
        setGroups(data.groups);
        setLoading(false);
      });
  }, []);

  return (
    <div className="hero-bg">
      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-[var(--color-accent-primary)]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-[var(--color-accent-secondary)]/8 rounded-full blur-3xl pointer-events-none" />

        <div className="relative text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-8 text-sm text-[var(--color-text-secondary)]">
            <span className="w-2 h-2 rounded-full bg-[var(--color-accent-green)] animate-pulse" />
            Plataforma #1 de divulgação de grupos
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Divulgue seu grupo e{" "}
            <span className="gradient-text">alcance milhares</span>{" "}
            de pessoas
          </h1>

          <p className="text-lg text-[var(--color-text-secondary)] mb-10 max-w-2xl mx-auto leading-relaxed">
            Cadastre seu grupo de WhatsApp, Telegram, Discord ou Facebook gratuitamente.
            Promova para aparecer no topo e ganhar mais membros!
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/adicionar"
              className="w-full sm:w-auto px-8 py-4 rounded-xl gradient-bg text-white font-semibold text-lg hover:opacity-90 transition-all shadow-lg shadow-[var(--color-accent-primary)]/30 hover:shadow-xl hover:shadow-[var(--color-accent-primary)]/40 hover:-translate-y-0.5"
            >
              + Adicionar Grupo
            </Link>
            <Link
              href="/explorar"
              className="w-full sm:w-auto px-8 py-4 rounded-xl glass text-white font-semibold text-lg hover:bg-white/10 transition-all"
            >
              Explorar Grupos →
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Grupos cadastrados", value: "500+", icon: "📋" },
            { label: "Categorias", value: "5", icon: "📂" },
            { label: "Cliques hoje", value: "2.3K", icon: "👆" },
            { label: "Novos grupos/dia", value: "30+", icon: "🚀" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="glass rounded-2xl p-6 text-center hover:scale-105 transition-transform"
            >
              <span className="text-3xl mb-2 block">{stat.icon}</span>
              <div className="text-2xl font-bold gradient-text mb-1">
                {stat.value}
              </div>
              <div className="text-xs text-[var(--color-text-muted)]">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Groups */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold">
              Grupos em <span className="gradient-text">Destaque</span>
            </h2>
            <p className="text-[var(--color-text-muted)] text-sm mt-1">
              Os grupos mais populares da plataforma
            </p>
          </div>
          <Link
            href="/explorar"
            className="text-sm text-[var(--color-accent-secondary)] hover:text-white transition-colors font-medium"
          >
            Ver todos →
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="glass rounded-2xl h-72 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((group) => (
              <GroupCard key={group.id} {...group} />
            ))}
          </div>
        )}
      </section>

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">
            Como <span className="gradient-text-pink">funciona?</span>
          </h2>
          <p className="text-[var(--color-text-muted)] text-sm">
            3 passos simples para divulgar seu grupo
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: "01",
              icon: "📝",
              title: "Cadastre seu grupo",
              description:
                "Preencha o formulário com nome, descrição, link e categoria do seu grupo.",
            },
            {
              step: "02",
              icon: "🚀",
              title: "Promova (opcional)",
              description:
                "Impulsione seu grupo para o topo da listagem a partir de R$10. Mais visibilidade, mais membros!",
            },
            {
              step: "03",
              icon: "📈",
              title: "Cresça",
              description:
                "Milhares de pessoas irão ver e entrar no seu grupo. Acompanhe os cliques em tempo real.",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="glass rounded-2xl p-8 text-center hover:scale-105 transition-transform group"
            >
              <div className="text-xs font-bold text-[var(--color-accent-primary)] mb-4 uppercase tracking-widest">
                Passo {item.step}
              </div>
              <span className="text-5xl block mb-4 group-hover:animate-float">
                {item.icon}
              </span>
              <h3 className="font-semibold text-white text-lg mb-2">
                {item.title}
              </h3>
              <p className="text-[var(--color-text-muted)] text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">
            Explore por <span className="gradient-text">categoria</span>
          </h2>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.value}
              href={`/explorar?categoria=${cat.value}`}
              className="glass rounded-2xl px-8 py-6 text-center hover:scale-105 transition-all hover:border-[var(--color-border-hover)] group min-w-[140px]"
            >
              <span className="text-4xl block mb-3 group-hover:scale-110 transition-transform">
                {cat.icon}
              </span>
              <span className="text-sm font-medium text-white">{cat.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="glass rounded-3xl p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-accent-primary)]/10 to-[var(--color-accent-secondary)]/10 pointer-events-none" />
          <div className="relative">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              Pronto para <span className="gradient-text">divulgar</span> seu grupo?
            </h2>
            <p className="text-[var(--color-text-muted)] mb-8 max-w-md mx-auto">
              Cadastre agora e comece a receber novos membros em minutos!
            </p>
            <Link
              href="/adicionar"
              className="inline-block px-10 py-4 rounded-xl gradient-bg text-white font-semibold text-lg hover:opacity-90 transition-all shadow-lg shadow-[var(--color-accent-primary)]/30 animate-pulse-glow"
            >
              Adicionar Meu Grupo →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
