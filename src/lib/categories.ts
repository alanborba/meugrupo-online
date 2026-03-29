export const CATEGORIES = [
  { value: "whatsapp", label: "WhatsApp", icon: "💬", color: "#25D366" },
  { value: "telegram", label: "Telegram", icon: "✈️", color: "#229ED9" },
  { value: "discord", label: "Discord", icon: "🎮", color: "#5865F2" },
  { value: "facebook", label: "Facebook", icon: "👥", color: "#1877F2" },
  { value: "outros", label: "Outros", icon: "🌐", color: "#ec4899" },
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
