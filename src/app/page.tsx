"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import GroupCard, { GroupCardProps } from "@/components/GroupCard";
import { CATEGORIES, CATEGORY_TYPES } from "@/lib/categories";

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
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-28 mesh-bg min-h-[85vh] flex items-center">
        {/* Floating orbs */}
        <div className="absolute top-20 left-[10%] w-80 h-80 bg-[var(--color-accent-primary)]/15 rounded-full blur-[100px] pointer-events-none animate-float" />
        <div className="absolute bottom-20 right-[10%] w-96 h-96 bg-[var(--color-accent-secondary)]/10 rounded-full blur-[120px] pointer-events-none animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute top-[40%] left-[60%] w-64 h-64 bg-[var(--color-accent-pink)]/8 rounded-full blur-[80px] pointer-events-none animate-float" style={{ animationDelay: "4s" }} />

        {/* Particles */}
        <div className="particles">
          <div className="particle" style={{ left: "10%", animationDelay: "0s" }} />
          <div className="particle" style={{ left: "30%", animationDelay: "3s" }} />
          <div className="particle" style={{ left: "50%", animationDelay: "1s" }} />
          <div className="particle" style={{ left: "70%", animationDelay: "5s" }} />
          <div className="particle" style={{ left: "90%", animationDelay: "2s" }} />
        </div>

        <div className="relative text-center max-w-4xl mx-auto z-10">
          <div className="inline-flex items-center gap-2 glass px-5 py-2.5 rounded-full mb-8 text-sm text-[var(--color-text-secondary)] animate-fade-in-scale">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-accent-green)] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--color-accent-green)]" />
            </span>
            Plataforma #1 de divulgação de grupos
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight mb-8 animate-count-up">
            Divulgue seu{" "}
            <span className="gradient-text">grupo, canal</span>
            <br className="hidden sm:block" />
            {" "}e alcance{" "}
            <span className="gradient-text">milhares</span>
          </h1>

          <p className="text-lg sm:text-xl text-[var(--color-text-secondary)] mb-12 max-w-2xl mx-auto leading-relaxed animate-count-up" style={{ animationDelay: "0.2s" }}>
            Cadastre seu grupo de WhatsApp, canal do YouTube, perfil do Instagram
            ou site. Promova e alcance novos seguidores!
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-count-up" style={{ animationDelay: "0.4s" }}>
            <Link
              href="/adicionar"
              className="w-full sm:w-auto px-10 py-4 rounded-2xl gradient-bg text-white font-semibold text-lg btn-hover shadow-xl shadow-[var(--color-accent-primary)]/30"
            >
              ✨ Divulgar Agora
            </Link>
            <Link
              href="/explorar"
              className="w-full sm:w-auto px-10 py-4 rounded-2xl glass text-white font-semibold text-lg hover:bg-white/10 transition-all group"
            >
              Explorar <span className="inline-block group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Glow divider */}
      <div className="glow-line max-w-4xl mx-auto" />

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 stagger-children">
          {[
            { label: "Grupos cadastrados", value: "500+", icon: "📋" },
            { label: "Categorias", value: "14", icon: "📂" },
            { label: "Cliques hoje", value: "2.3K", icon: "👆" },
            { label: "Novos grupos/dia", value: "30+", icon: "🚀" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="glass rounded-2xl p-6 text-center card-hover"
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

      {/* What can you promote */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">
            O que você pode <span className="gradient-text">divulgar?</span>
          </h2>
          <p className="text-[var(--color-text-muted)] text-sm">
            Não é só grupo! Divulgue qualquer coisa
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 stagger-children">
          {CATEGORY_TYPES.map((type) => (
            <Link
              key={type.value}
              href="/adicionar"
              className="glass rounded-2xl p-8 text-center card-hover group"
            >
              <span className="text-5xl block mb-4 group-hover:scale-125 transition-transform duration-300">
                {type.icon}
              </span>
              <h3 className="text-lg font-semibold text-white mb-1">{type.label}</h3>
              <p className="text-xs text-[var(--color-text-muted)]">{type.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Groups */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold">
              Em <span className="gradient-text">Destaque</span>
            </h2>
            <p className="text-[var(--color-text-muted)] text-sm mt-1">
              Os mais populares da plataforma
            </p>
          </div>
          <Link
            href="/explorar"
            className="text-sm text-[var(--color-accent-secondary)] hover:text-white transition-colors font-medium group"
          >
            Ver todos <span className="inline-block group-hover:translate-x-1 transition-transform">→</span>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
            {groups.map((group) => (
              <GroupCard key={group.id} {...group} />
            ))}
          </div>
        )}
      </section>

      {/* Glow divider */}
      <div className="glow-line max-w-4xl mx-auto" />

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-14">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">
            Como <span className="gradient-text-pink">funciona?</span>
          </h2>
          <p className="text-[var(--color-text-muted)] text-sm">
            3 passos simples para divulgar
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 stagger-children">
          {[
            {
              step: "01",
              icon: "📝",
              title: "Cadastre",
              description:
                "Crie sua conta grátis e adicione seu grupo, canal, site ou rede social em menos de 1 minuto.",
            },
            {
              step: "02",
              icon: "🚀",
              title: "Promova",
              description:
                "Impulsione para o topo da listagem a partir de R$10. Mais visibilidade, mais seguidores!",
            },
            {
              step: "03",
              icon: "📈",
              title: "Cresça",
              description:
                "Milhares de pessoas irão ver e acessar. Acompanhe os cliques em tempo real no dashboard.",
            },
          ].map((item, index) => (
            <div
              key={item.step}
              className="glass rounded-2xl p-8 text-center card-hover group relative overflow-hidden"
            >
              {/* Step number bg */}
              <div className="absolute -top-4 -right-4 text-[120px] font-black text-white/[0.02] select-none leading-none">
                {item.step}
              </div>
              <div className="relative">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full glass text-xs font-bold text-[var(--color-accent-primary)] mb-5 uppercase tracking-widest">
                  {item.step}
                </div>
                <span className="text-5xl block mb-5 group-hover:scale-110 transition-transform duration-300" style={{ animationDelay: `${index * 0.2}s` }}>
                  {item.icon}
                </span>
                <h3 className="font-semibold text-white text-lg mb-2">
                  {item.title}
                </h3>
                <p className="text-[var(--color-text-muted)] text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">
            Explore por <span className="gradient-text">plataforma</span>
          </h2>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-3 stagger-children">
          {CATEGORIES.filter(c => c.value !== 'outros').map((cat) => (
            <Link
              key={cat.value}
              href={`/explorar?categoria=${cat.value}`}
              className="glass rounded-2xl p-4 text-center card-hover group"
            >
              <span className="text-3xl block mb-2 group-hover:scale-125 transition-transform duration-300">
                {cat.icon}
              </span>
              <span className="text-xs font-medium text-[var(--color-text-secondary)] group-hover:text-white transition-colors">
                {cat.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="animated-border glass rounded-3xl p-12 sm:p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent-primary)]/10 via-transparent to-[var(--color-accent-secondary)]/10 pointer-events-none" />
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-bold mb-5">
              Pronto para <span className="gradient-text">divulgar?</span>
            </h2>
            <p className="text-[var(--color-text-muted)] mb-10 max-w-md mx-auto text-lg">
              Cadastre agora e comece a receber novos seguidores em minutos!
            </p>
            <Link
              href="/adicionar"
              className="inline-block px-12 py-5 rounded-2xl gradient-bg text-white font-semibold text-lg btn-hover shadow-xl shadow-[var(--color-accent-primary)]/30 animate-pulse-glow"
            >
              ✨ Começar Agora — É Grátis
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
