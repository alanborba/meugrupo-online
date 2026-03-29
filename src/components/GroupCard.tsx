import Link from "next/link";
import { getCategoryIcon, getCategoryColor } from "@/lib/categories";

export interface GroupCardProps {
  id: string;
  name: string;
  description: string;
  category: string;
  image_url?: string;
  clicks: number;
  is_promoted: boolean;
  promotion_plan?: string | null;
}

export default function GroupCard({
  id,
  name,
  description,
  category,
  image_url,
  clicks,
  is_promoted,
  promotion_plan,
}: GroupCardProps) {
  const catColor = getCategoryColor(category);
  const catIcon = getCategoryIcon(category);

  const getBadge = () => {
    if (!is_promoted) return null;
    if (promotion_plan === "premium") return <span className="badge-premium">⭐ Premium</span>;
    if (promotion_plan === "plus") return <span className="badge-destaque">🔥 Destaque</span>;
    return <span className="badge-basico">✨ Promovido</span>;
  };

  return (
    <Link href={`/grupo/${id}`} className="block group">
      <div
        className={`glass rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl ${
          is_promoted ? "animated-border" : ""
        }`}
      >
        {/* Image */}
        <div className="relative h-40 bg-gradient-to-br from-[var(--color-accent-primary)]/20 to-[var(--color-accent-secondary)]/20 flex items-center justify-center overflow-hidden">
          {image_url ? (
            <img
              src={image_url}
              alt={name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <span className="text-5xl">{catIcon}</span>
          )}
          {/* Badge */}
          {getBadge() && (
            <div className="absolute top-3 right-3">{getBadge()}</div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Category */}
          <div className="flex items-center gap-2 mb-2">
            <span
              className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: `${catColor}20`,
                color: catColor,
              }}
            >
              {catIcon} {category}
            </span>
            <span className="text-[var(--color-text-muted)] text-xs ml-auto">
              👁 {clicks}
            </span>
          </div>

          {/* Name */}
          <h3 className="font-semibold text-white text-sm mb-1 line-clamp-1 group-hover:text-[var(--color-accent-secondary)] transition-colors">
            {name}
          </h3>

          {/* Description */}
          <p className="text-[var(--color-text-muted)] text-xs line-clamp-2 leading-relaxed">
            {description}
          </p>

          {/* CTA */}
          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs font-medium text-[var(--color-accent-secondary)] group-hover:text-white transition-colors">
              Ver grupo →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
