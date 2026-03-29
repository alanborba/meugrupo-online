export const PLANS = [
  {
    id: "basic" as const,
    name: "Básico",
    emoji: "🥉",
    price: 10,
    days: 7,
    color: "from-cyan-500 to-emerald-500",
    colorHex: "#06b6d4",
    features: [
      "7 dias no topo da listagem",
      "Selo 'Promovido' no card",
      "Maior visibilidade",
    ],
  },
  {
    id: "plus" as const,
    name: "Plus",
    emoji: "🥈",
    price: 25,
    days: 15,
    color: "from-violet-500 to-cyan-500",
    colorHex: "#7c3aed",
    popular: true,
    features: [
      "15 dias no topo da listagem",
      "Selo '🔥 Destaque' no card",
      "Borda animada exclusiva",
      "Prioridade na busca",
    ],
  },
  {
    id: "premium" as const,
    name: "Premium",
    emoji: "🥇",
    price: 50,
    days: 30,
    color: "from-amber-500 to-red-500",
    colorHex: "#f59e0b",
    features: [
      "30 dias no topo da listagem",
      "Selo '⭐ Premium' exclusivo",
      "Posição fixa na página inicial",
      "Borda animada dourada",
      "Destaque máximo na busca",
    ],
  },
] as const;

export type PlanId = (typeof PLANS)[number]["id"];
