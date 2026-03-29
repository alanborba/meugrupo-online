export const CATEGORY_TYPES = [
  { value: "grupo", label: "Grupo", icon: "👥", description: "WhatsApp, Telegram, Discord..." },
  { value: "canal", label: "Canal", icon: "📺", description: "YouTube, Twitch, Telegram..." },
  { value: "site", label: "Site / Blog", icon: "🌐", description: "Sites, blogs, portais..." },
  { value: "rede-social", label: "Rede Social", icon: "📱", description: "Instagram, TikTok, X..." },
] as const;

export type CategoryType = (typeof CATEGORY_TYPES)[number]["value"];

export const CATEGORIES = [
  // Grupos
  { value: "whatsapp", label: "WhatsApp", icon: "💬", color: "#25D366", type: "grupo", placeholder: "https://chat.whatsapp.com/..." },
  { value: "telegram", label: "Telegram", icon: "✈️", color: "#229ED9", type: "grupo", placeholder: "https://t.me/..." },
  { value: "discord", label: "Discord", icon: "🎮", color: "#5865F2", type: "grupo", placeholder: "https://discord.gg/..." },
  { value: "facebook", label: "Facebook", icon: "👥", color: "#1877F2", type: "grupo", placeholder: "https://facebook.com/groups/..." },
  // Canais
  { value: "youtube", label: "YouTube", icon: "▶️", color: "#FF0000", type: "canal", placeholder: "https://youtube.com/@..." },
  { value: "twitch", label: "Twitch", icon: "🎮", color: "#9146FF", type: "canal", placeholder: "https://twitch.tv/..." },
  { value: "telegram-canal", label: "Telegram Canal", icon: "📢", color: "#229ED9", type: "canal", placeholder: "https://t.me/..." },
  // Redes Sociais
  { value: "instagram", label: "Instagram", icon: "📷", color: "#E4405F", type: "rede-social", placeholder: "https://instagram.com/..." },
  { value: "tiktok", label: "TikTok", icon: "🎵", color: "#000000", type: "rede-social", placeholder: "https://tiktok.com/@..." },
  { value: "twitter", label: "X (Twitter)", icon: "🐦", color: "#1DA1F2", type: "rede-social", placeholder: "https://x.com/..." },
  { value: "kwai", label: "Kwai", icon: "🎬", color: "#FF6B00", type: "rede-social", placeholder: "https://kwai.com/..." },
  // Sites
  { value: "site", label: "Site / Blog", icon: "🌐", color: "#6366f1", type: "site", placeholder: "https://meusite.com" },
  { value: "loja", label: "Loja Online", icon: "🛒", color: "#10b981", type: "site", placeholder: "https://minhaloja.com" },
  // Outros
  { value: "outros", label: "Outros", icon: "📌", color: "#ec4899", type: "grupo", placeholder: "https://..." },
] as const;

export type CategoryValue = (typeof CATEGORIES)[number]["value"];

export function getCategoryIcon(category: string): string {
  const cat = CATEGORIES.find(
    (c) => c.value === category.toLowerCase() || c.label.toLowerCase() === category.toLowerCase()
  );
  return cat?.icon || "🌐";
}

export function getCategoryColor(category: string): string {
  const cat = CATEGORIES.find(
    (c) => c.value === category.toLowerCase() || c.label.toLowerCase() === category.toLowerCase()
  );
  return cat?.color || "#ec4899";
}

export function getCategoryLabel(category: string): string {
  const cat = CATEGORIES.find(
    (c) => c.value === category.toLowerCase() || c.label.toLowerCase() === category.toLowerCase()
  );
  return cat?.label || category;
}

export function getCategoryPlaceholder(category: string): string {
  const cat = CATEGORIES.find(
    (c) => c.value === category.toLowerCase()
  );
  return cat?.placeholder || "https://...";
}
