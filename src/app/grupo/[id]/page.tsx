"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getCategoryIcon, getCategoryColor } from "@/lib/categories";
import type { Group } from "@/lib/store";

export default function GrupoPage() {
  const params = useParams();
  const router = useRouter();
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params.id) return;
    fetch(`/api/groups/${params.id}`)
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((data) => {
        setGroup(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [params.id]);

  const handleEnter = async () => {
    if (!group) return;
    // Increment click
    await fetch(`/api/groups/${group.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "click" }),
    });
    window.open(group.link, "_blank");
  };

  if (loading) {
    return (
      <div className="hero-bg min-h-screen flex items-center justify-center">
        <div className="glass rounded-2xl w-20 h-20 animate-pulse" />
      </div>
    );
  }

  if (!group) {
    return (
      <div className="hero-bg min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <span className="text-6xl block mb-4">😕</span>
          <h2 className="text-2xl font-bold text-white mb-2">
            Grupo não encontrado
          </h2>
          <p className="text-[var(--color-text-muted)] text-sm mb-6">
            O grupo que você procura não existe ou foi removido.
          </p>
          <Link
            href="/explorar"
            className="px-6 py-3 rounded-xl gradient-bg text-white font-medium hover:opacity-90 transition-all"
          >
            Explorar outros grupos
          </Link>
        </div>
      </div>
    );
  }

  const catColor = getCategoryColor(group.category);
  const catIcon = getCategoryIcon(group.category);

  const getBadge = () => {
    if (!group.is_promoted) return null;
    if (group.promotion_plan === "premium")
      return <span className="badge-premium text-sm">⭐ Premium</span>;
    if (group.promotion_plan === "plus")
      return <span className="badge-destaque text-sm">🔥 Destaque</span>;
    return <span className="badge-basico text-sm">✨ Promovido</span>;
  };

  return (
    <div className="hero-bg min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back */}
        <button
          onClick={() => router.back()}
          className="text-[var(--color-text-muted)] hover:text-white text-sm mb-8 inline-flex items-center gap-1 transition-colors"
        >
          ← Voltar
        </button>

        <div
          className={`glass rounded-3xl overflow-hidden ${
            group.is_promoted ? "animated-border" : ""
          }`}
        >
          {/* Header Image */}
          <div className="relative h-48 sm:h-56 bg-gradient-to-br from-[var(--color-accent-primary)]/20 to-[var(--color-accent-secondary)]/20 flex items-center justify-center">
            {group.image_url ? (
              <img
                src={group.image_url}
                alt={group.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-8xl">{catIcon}</span>
            )}
            {getBadge() && (
              <div className="absolute top-4 right-4">{getBadge()}</div>
            )}
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Category + Clicks */}
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <span
                className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full"
                style={{
                  backgroundColor: `${catColor}20`,
                  color: catColor,
                }}
              >
                {catIcon} {group.category}
              </span>
              <span className="text-[var(--color-text-muted)] text-xs">
                👁 {group.clicks} cliques
              </span>
              <span className="text-[var(--color-text-muted)] text-xs">
                📅 {new Date(group.created_at).toLocaleDateString("pt-BR")}
              </span>
            </div>

            {/* Name */}
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              {group.name}
            </h1>

            {/* Description */}
            <p className="text-[var(--color-text-secondary)] leading-relaxed mb-6">
              {group.description}
            </p>

            {/* Tags */}
            {group.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {group.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-3 py-1 rounded-full bg-white/5 text-[var(--color-text-muted)] border border-[var(--color-border)]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleEnter}
                className="flex-1 py-4 rounded-xl gradient-bg text-white font-semibold text-lg hover:opacity-90 transition-all shadow-lg shadow-[var(--color-accent-primary)]/30 text-center"
              >
                Entrar no Grupo →
              </button>
              {!group.is_promoted && (
                <Link
                  href={`/promover/${group.id}`}
                  className="px-6 py-4 rounded-xl glass text-white font-medium hover:bg-white/10 transition-all text-center"
                >
                  🚀 Promover
                </Link>
              )}
            </div>

            {/* Promotion info */}
            {group.is_promoted && group.promotion_expires_at && (
              <div className="mt-4 p-4 rounded-xl bg-white/5 border border-[var(--color-border)]">
                <p className="text-xs text-[var(--color-text-muted)]">
                  ✨ Este grupo está promovido até{" "}
                  <span className="text-white font-medium">
                    {new Date(group.promotion_expires_at).toLocaleDateString(
                      "pt-BR"
                    )}
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
