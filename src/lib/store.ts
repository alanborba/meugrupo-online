import { GroupCardProps } from "@/components/GroupCard";

export interface Group extends GroupCardProps {
  link: string;
  tags: string[];
  created_at: string;
  promotion_expires_at?: string | null;
}

// In-memory store (will be replaced by Supabase)
let groups: Group[] = [];

export function getGroups(params?: {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}): { groups: Group[]; total: number } {
  let filtered = [...groups];

  // Check promotion expiry
  const now = new Date();
  filtered = filtered.map((g) => {
    if (g.is_promoted && g.promotion_expires_at) {
      if (new Date(g.promotion_expires_at) < now) {
        return { ...g, is_promoted: false, promotion_plan: null };
      }
    }
    return g;
  });

  // Filter by category
  if (params?.category && params.category !== "todos") {
    filtered = filtered.filter(
      (g) => g.category.toLowerCase() === params.category!.toLowerCase()
    );
  }

  // Filter by search
  if (params?.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter(
      (g) =>
        g.name.toLowerCase().includes(q) ||
        g.description.toLowerCase().includes(q) ||
        g.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  // Sort: promoted first, then by clicks
  filtered.sort((a, b) => {
    if (a.is_promoted && !b.is_promoted) return -1;
    if (!a.is_promoted && b.is_promoted) return 1;
    // Among promoted, order by plan tier
    if (a.is_promoted && b.is_promoted) {
      const tierOrder: Record<string, number> = { premium: 0, plus: 1, basic: 2 };
      const aTier = tierOrder[a.promotion_plan || "basic"] ?? 3;
      const bTier = tierOrder[b.promotion_plan || "basic"] ?? 3;
      if (aTier !== bTier) return aTier - bTier;
    }
    return b.clicks - a.clicks;
  });

  const total = filtered.length;
  const page = params?.page || 1;
  const limit = params?.limit || 12;
  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);

  return { groups: paginated, total };
}

export function getGroupById(id: string): Group | undefined {
  return groups.find((g) => g.id === id);
}

export function createGroup(data: {
  name: string;
  description: string;
  link: string;
  category: string;
  image_url?: string;
  tags?: string[];
}): Group {
  const newGroup: Group = {
    id: String(Date.now()),
    name: data.name,
    description: data.description,
    link: data.link,
    category: data.category.toLowerCase(),
    image_url: data.image_url || "",
    tags: data.tags || [],
    clicks: 0,
    is_promoted: false,
    promotion_plan: null,
    created_at: new Date().toISOString(),
  };
  groups = [newGroup, ...groups];
  return newGroup;
}

export function incrementClicks(id: string): void {
  groups = groups.map((g) => (g.id === id ? { ...g, clicks: g.clicks + 1 } : g));
}

export function promoteGroup(
  id: string,
  plan: "basic" | "plus" | "premium"
): Group | undefined {
  const daysMap = { basic: 7, plus: 15, premium: 30 };
  const expires = new Date();
  expires.setDate(expires.getDate() + daysMap[plan]);

  groups = groups.map((g) =>
    g.id === id
      ? {
          ...g,
          is_promoted: true,
          promotion_plan: plan,
          promotion_expires_at: expires.toISOString(),
        }
      : g
  );

  return groups.find((g) => g.id === id);
}
