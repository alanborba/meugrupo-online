"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import GroupCard, { GroupCardProps } from "@/components/GroupCard";
import { CATEGORIES } from "@/lib/categories";

export default function ExplorarPage() {
  return (
    <Suspense fallback={<div className="hero-bg min-h-screen flex items-center justify-center"><div className="text-white text-lg">Carregando...</div></div>}>
      <ExplorarContent />
    </Suspense>
  );
}

function ExplorarContent() {
  const searchParams = useSearchParams();
  const initialCat = searchParams.get("categoria") || "todos";

  const [groups, setGroups] = useState<GroupCardProps[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(initialCat);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 12;

  const fetchGroups = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category !== "todos") params.set("category", category);
    if (search) params.set("search", search);
    params.set("page", String(page));
    params.set("limit", String(limit));

    const res = await fetch(`/api/groups?${params}`);
    const data = await res.json();
    setGroups(data.groups);
    setTotal(data.total);
    setLoading(false);
  }, [category, search, page]);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  useEffect(() => {
    setPage(1);
  }, [category, search]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="hero-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">
            Explorar <span className="gradient-text">Grupos</span>
          </h1>
          <p className="text-[var(--color-text-muted)] text-sm">
            Encontre o grupo perfeito para você
          </p>
        </div>

        {/* Search */}
        <div className="max-w-xl mx-auto mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar grupos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full glass rounded-xl px-5 py-4 pl-12 text-white placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent-primary)] transition-colors text-sm"
            />
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          <button
            onClick={() => setCategory("todos")}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
              category === "todos"
                ? "gradient-bg text-white shadow-lg shadow-[var(--color-accent-primary)]/25"
                : "glass text-[var(--color-text-secondary)] hover:text-white"
            }`}
          >
            🌟 Todos
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                category === cat.value
                  ? "text-white shadow-lg"
                  : "glass text-[var(--color-text-secondary)] hover:text-white"
              }`}
              style={
                category === cat.value
                  ? { background: cat.color, boxShadow: `0 8px 25px ${cat.color}40` }
                  : undefined
              }
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-[var(--color-text-muted)]">
            {total} grupo{total !== 1 ? "s" : ""} encontrado{total !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="glass rounded-2xl h-72 animate-pulse" />
            ))}
          </div>
        ) : groups.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-6xl block mb-4">🔍</span>
            <h3 className="text-xl font-semibold text-white mb-2">
              Nenhum grupo encontrado
            </h3>
            <p className="text-[var(--color-text-muted)] text-sm">
              Tente buscar com outros termos ou categorias
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {groups.map((group) => (
              <GroupCard key={group.id} {...group} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-lg glass text-sm disabled:opacity-30 hover:bg-white/10 transition-colors"
            >
              ← Anterior
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                  page === i + 1
                    ? "gradient-bg text-white"
                    : "glass text-[var(--color-text-secondary)] hover:text-white"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 rounded-lg glass text-sm disabled:opacity-30 hover:bg-white/10 transition-colors"
            >
              Próximo →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
