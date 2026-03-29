"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import GroupCard, { GroupCardProps } from "@/components/GroupCard";
import { CATEGORIES, CATEGORY_TYPES } from "@/lib/categories";

export default function Home() {
  const router = useRouter();
  const [groups, setGroups] = useState<GroupCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [totalGroups, setTotalGroups] = useState(0);

  useEffect(() => {
    fetch("/api/groups?limit=9")
      .then((r) => r.json())
      .then((data) => {
        setGroups(data.groups || []);
        setTotalGroups(data.total || data.groups?.length || 0);
        setLoading(false);
      });
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/explorar?busca=${encodeURIComponent(search.trim())}`);
    } else {
      router.push("/explorar");
    }
  };

  const mainCategories = CATEGORIES.filter(c =>
    ["whatsapp", "telegram", "discord", "youtube", "instagram", "tiktok"].includes(c.value)
  );

  return (
    <div className="hero-bg min-h-screen">

      {/* ============ HERO ============ */}
      <section className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-14 text-center">
        {/* Glowing orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[var(--color-accent-primary)]/15 rounded-full blur-[150px] pointer-events-none" />

        <div className="relative z-10">
          {/* Social proof badge */}
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-6 text-sm animate-fade-in-scale">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-accent-green)] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-accent-green)]" />
            </span>
            <span className="text-[var(--color-text-secondary)]">
              <strong className="text-white">{totalGroups > 0 ? `${totalGroups}+` : "500+"}</strong> grupos cadastrados
            </span>
          </div>

          {/* Headline - short and benefit-focused */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-5 animate-count-up tracking-tight">
            Encontre os melhores
            <br />
            <span className="gradient-text">grupos e canais</span> do Brasil
          </h1>

          {/* Sub-headline - addresses pain */}
          <p className="text-base sm:text-lg text-[var(--color-text-secondary)] mb-8 max-w-xl mx-auto leading-relaxed animate-count-up" style={{ animationDelay: "0.15s" }}>
            WhatsApp, Telegram, Discord, YouTube e muito mais.
            Encontre ou divulgue gratuitamente.
          </p>

          {/* Search bar — THE main CTA */}
          <form
            onSubmit={handleSearch}
            className="max-w-xl mx-auto flex items-center gap-0 animate-count-up"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="relative flex-1">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar grupos, canais, sites..."
                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-[var(--color-border)] border-r-0 rounded-l-2xl text-white placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent-primary)] transition-colors text-sm sm:text-base"
              />
            </div>
            <button
              type="submit"
              className="px-4 sm:px-8 py-4 gradient-bg text-white font-semibold rounded-r-2xl hover:opacity-90 transition-all text-sm sm:text-base whitespace-nowrap"
            >
              Buscar
            </button>
          </form>

          {/* Quick category links */}
          <div className="flex flex-wrap justify-center gap-2 mt-6 animate-count-up" style={{ animationDelay: "0.4s" }}>
            {mainCategories.map((cat) => (
              <Link
                key={cat.value}
                href={`/explorar?categoria=${cat.value}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium glass hover:bg-white/10 transition-all text-[var(--color-text-secondary)] hover:text-white"
              >
                <span>{cat.icon}</span>
                {cat.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============ PROMOTED / FEATURED ============ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            🔥 Em <span className="gradient-text">Destaque</span>
          </h2>
          <Link
            href="/explorar"
            className="text-sm text-[var(--color-accent-secondary)] hover:text-white transition-colors font-medium group flex items-center gap-1"
          >
            Ver todos
            <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="glass rounded-2xl h-64 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
            {groups.slice(0, 6).map((group) => (
              <GroupCard key={group.id} {...group} />
            ))}
          </div>
        )}

        <div className="text-center mt-8">
          <Link
            href="/explorar"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl glass text-white font-semibold hover:bg-white/10 transition-all group"
          >
            Explorar todos os grupos
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Divider */}
      <div className="glow-line max-w-3xl mx-auto" />

      {/* ============ CATEGORIES SECTION ============ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-xl sm:text-2xl font-bold text-center mb-8">
          Explore por <span className="gradient-text">plataforma</span>
        </h2>
        <div className="grid grid-cols-2 min-[400px]:grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3 stagger-children">
          {CATEGORIES.filter(c => c.value !== 'outros').map((cat) => (
            <Link
              key={cat.value}
              href={`/explorar?categoria=${cat.value}`}
              className="glass rounded-xl p-3 sm:p-4 text-center card-hover group"
            >
              <span className="text-2xl sm:text-3xl block mb-1.5 group-hover:scale-110 transition-transform duration-200">
                {cat.icon}
              </span>
              <span className="text-[10px] sm:text-xs font-medium text-[var(--color-text-secondary)] group-hover:text-white transition-colors leading-tight block">
                {cat.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <h2 className="text-xl sm:text-2xl font-bold text-center mb-10">
          Como <span className="gradient-text-pink">funciona?</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger-children">
          {[
            {
              num: "1",
              icon: "📝",
              title: "Cadastre grátis",
              desc: "Crie sua conta e adicione seu grupo, canal ou site em menos de 1 minuto.",
            },
            {
              num: "2",
              icon: "🚀",
              title: "Promova",
              desc: "Impulsione para o topo a partir de R$10. Mais visibilidade = mais membros.",
            },
            {
              num: "3",
              icon: "📈",
              title: "Cresça",
              desc: "Acompanhe os cliques em tempo real e veja seu grupo crescer.",
            },
          ].map((item) => (
            <div key={item.num} className="glass rounded-2xl p-6 text-center card-hover group">
              <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-white font-bold text-sm mx-auto mb-4">
                {item.num}
              </div>
              <span className="text-4xl block mb-3 group-hover:scale-110 transition-transform duration-200">
                {item.icon}
              </span>
              <h3 className="font-semibold text-white mb-1">{item.title}</h3>
              <p className="text-[var(--color-text-muted)] text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============ WHAT YOU CAN PROMOTE ============ */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <h2 className="text-xl sm:text-2xl font-bold text-center mb-8">
          Divulgue <span className="gradient-text">qualquer plataforma</span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 stagger-children">
          {CATEGORY_TYPES.map((type) => (
            <Link
              key={type.value}
              href="/adicionar"
              className="glass rounded-2xl p-6 text-center card-hover group"
            >
              <span className="text-4xl block mb-3 group-hover:scale-110 transition-transform duration-200">
                {type.icon}
              </span>
              <h3 className="font-semibold text-white text-sm mb-0.5">{type.label}</h3>
              <p className="text-[10px] text-[var(--color-text-muted)]">{type.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="animated-border glass rounded-3xl p-10 sm:p-14 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent-primary)]/10 via-transparent to-[var(--color-accent-secondary)]/10 pointer-events-none" />
          <div className="relative">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              Pronto para <span className="gradient-text">divulgar?</span>
            </h2>
            <p className="text-[var(--color-text-muted)] mb-8 max-w-md mx-auto">
              Cadastre agora e comece a receber novos membros em minutos. É grátis!
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/adicionar"
                className="w-full sm:w-auto px-6 sm:px-10 py-4 rounded-2xl gradient-bg text-white font-semibold text-base sm:text-lg btn-hover shadow-xl shadow-[var(--color-accent-primary)]/30 text-center"
              >
                ✨ Divulgar Meu Grupo
              </Link>
              <Link
                href="/explorar"
                className="w-full sm:w-auto px-6 sm:px-8 py-4 rounded-2xl glass text-white font-medium hover:bg-white/10 transition-all text-center"
              >
                Explorar →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
