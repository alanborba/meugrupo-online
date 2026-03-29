"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { GroupCardProps } from "@/components/GroupCard";

export default function DashboardPage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const router = useRouter();
  const [groups, setGroups] = useState<GroupCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchMyGroups = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const res = await fetch(`/api/groups?user_id=${user.id}&limit=100`);
    const data = await res.json();
    setGroups(data.groups || []);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }
    if (user) fetchMyGroups();
  }, [user, authLoading, router, fetchMyGroups]);

  const handleDelete = async (groupId: string) => {
    if (!confirm("Tem certeza que deseja excluir este grupo?")) return;
    setDeleting(groupId);
    await fetch(`/api/groups/${groupId}`, { method: "DELETE" });
    setGroups((prev) => prev.filter((g) => g.id !== groupId));
    setDeleting(null);
  };

  if (authLoading || (!user && !authLoading)) {
    return (
      <div className="hero-bg min-h-screen flex items-center justify-center">
        <div className="text-white text-lg">Carregando...</div>
      </div>
    );
  }

  const totalClicks = groups.reduce((sum, g) => sum + (g.clicks || 0), 0);
  const promotedCount = groups.filter((g) => g.is_promoted).length;
  const userName = user?.user_metadata?.name || user?.email?.split("@")[0] || "Usuário";

  return (
    <div className="hero-bg min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Olá, <span className="gradient-text">{userName}</span> 👋
            </h1>
            <p className="text-[var(--color-text-muted)] text-sm mt-1">
              Gerencie seus grupos e promoções
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/adicionar"
              className="px-5 py-2.5 rounded-xl gradient-bg text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-[var(--color-accent-primary)]/25"
            >
              + Novo Grupo
            </Link>
            <button
              onClick={signOut}
              className="px-5 py-2.5 rounded-xl glass text-[var(--color-text-secondary)] text-sm font-medium hover:text-white hover:bg-white/10 transition-all"
            >
              Sair
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <div className="glass rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold gradient-text">{groups.length}</div>
            <div className="text-[var(--color-text-muted)] text-sm mt-1">Grupos cadastrados</div>
          </div>
          <div className="glass rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold text-[var(--color-accent-secondary)]">{totalClicks}</div>
            <div className="text-[var(--color-text-muted)] text-sm mt-1">Cliques totais</div>
          </div>
          <div className="glass rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold text-yellow-400">{promotedCount}</div>
            <div className="text-[var(--color-text-muted)] text-sm mt-1">Promoções ativas</div>
          </div>
        </div>

        {/* Groups List */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white mb-4">Meus Grupos</h2>
        </div>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="glass rounded-2xl h-24 animate-pulse" />
            ))}
          </div>
        ) : groups.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center">
            <span className="text-6xl block mb-4">📭</span>
            <h3 className="text-xl font-semibold text-white mb-2">
              Nenhum grupo ainda
            </h3>
            <p className="text-[var(--color-text-muted)] text-sm mb-6">
              Comece adicionando seu primeiro grupo para divulgá-lo
            </p>
            <Link
              href="/adicionar"
              className="inline-block px-8 py-3 rounded-xl gradient-bg text-white font-semibold hover:opacity-90 transition-all shadow-lg shadow-[var(--color-accent-primary)]/30"
            >
              + Adicionar Grupo
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {groups.map((group) => (
              <div
                key={group.id}
                className="glass rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:bg-white/[0.04] transition-colors"
              >
                {/* Image */}
                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-white/5">
                  {group.image_url ? (
                    <img
                      src={group.image_url}
                      alt={group.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">
                      📱
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-white font-semibold truncate">{group.name}</h3>
                    {group.is_promoted && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                        ⭐ Promovido
                      </span>
                    )}
                  </div>
                  <p className="text-[var(--color-text-muted)] text-sm truncate mt-0.5">
                    {group.description}
                  </p>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-xs text-[var(--color-text-muted)]">
                      👁️ {group.clicks || 0} cliques
                    </span>
                    <span className="text-xs text-[var(--color-text-muted)]">
                      📂 {group.category}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 flex-shrink-0">
                  <Link
                    href={`/grupo/${group.id}`}
                    className="px-3 py-2 rounded-lg glass text-xs font-medium text-[var(--color-text-secondary)] hover:text-white hover:bg-white/10 transition-all"
                    title="Ver"
                  >
                    👁️ Ver
                  </Link>
                  <Link
                    href={`/dashboard/editar/${group.id}`}
                    className="px-3 py-2 rounded-lg glass text-xs font-medium text-[var(--color-accent-secondary)] hover:bg-[var(--color-accent-secondary)]/10 transition-all"
                    title="Editar"
                  >
                    ✏️ Editar
                  </Link>
                  <Link
                    href={`/promover/${group.id}`}
                    className="px-3 py-2 rounded-lg glass text-xs font-medium text-yellow-400 hover:bg-yellow-500/10 transition-all"
                    title="Promover"
                  >
                    🚀 Promover
                  </Link>
                  <button
                    onClick={() => handleDelete(group.id)}
                    disabled={deleting === group.id}
                    className="px-3 py-2 rounded-lg glass text-xs font-medium text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-50"
                    title="Excluir"
                  >
                    {deleting === group.id ? "..." : "🗑️ Excluir"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
