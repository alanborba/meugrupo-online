import Link from "next/link";
import { getCategoryIcon, getCategoryColor, getCategoryLabel } from "@/lib/categories";

export interface GroupCardProps {
  id: string;
  name: string;
  description: string;
  category: string;
  image_url?: string;
  clicks: number;
  is_promoted: boolean;
  promotion_plan?: string | null;
  user_id?: string | null;
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
  const catLabel = getCategoryLabel(category);

  const getBadge = () => {
    if (!is_promoted) return null;
    if (promotion_plan === "premium") return <span className="badge-premium">⭐ Premium</span>;
    if (promotion_plan === "plus") return <span className="badge-destaque">🔥 Destaque</span>;
    return <span className="badge-basico">✨ Promovido</span>;
  };

  return (
    <Link href={`/grupo/${id}`} className="block group">
      <div
        className={`glass rounded-2xl overflow-hidden card-hover ${
          is_promoted ? "animated-border" : ""
        }`}
      >
        {/* Image */}
        <div className="relative h-44 bg-gradient-to-br from-[var(--color-accent-primary)]/20 to-[var(--color-accent-secondary)]/20 flex items-center justify-center overflow-hidden">
          {image_url ? (
            <img
              src={image_url}
              alt={name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            />
          ) : (
            <div className="flex flex-col items-center gap-2">
              <span className="text-5xl group-hover:scale-110 transition-transform duration-300">{catIcon}</span>
              <span className="text-xs text-[var(--color-text-muted)] font-medium">{catLabel}</span>
            </div>
          )}
          {/* Badge */}
          {getBadge() && (
            <div className="absolute top-3 right-3 animate-fade-in-scale">{getBadge()}</div>
          )}
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg-primary)]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Category */}
          <div className="flex items-center gap-2 mb-3">
            <span
              className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full transition-all duration-300"
              style={{
                backgroundColor: `${catColor}15`,
                color: catColor,
                borderWidth: 1,
                borderColor: `${catColor}30`,
              }}
            >
              {catIcon} {catLabel}
            </span>
            <span className="text-[var(--color-text-muted)] text-xs ml-auto flex items-center gap-1">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              {clicks}
            </span>
          </div>

          {/* Name */}
          <h3 className="font-semibold text-white text-sm mb-1.5 line-clamp-1 group-hover:text-[var(--color-accent-secondary)] transition-colors duration-300">
            {name}
          </h3>

          {/* Description */}
          <p className="text-[var(--color-text-muted)] text-xs line-clamp-2 leading-relaxed">
            {description}
          </p>

          {/* CTA */}
          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs font-medium text-[var(--color-accent-secondary)] group-hover:text-white transition-colors duration-300 flex items-center gap-1">
              Acessar
              <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
