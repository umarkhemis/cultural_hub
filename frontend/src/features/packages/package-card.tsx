// frontend\src\features\packages\package-card.tsx
import Link from "next/link";
import { Calendar, MapPin, ArrowRight, Tag } from "lucide-react";
import type { TourismPackage } from "@/src/types/package";
import { formatCurrency } from "@/src/utils/formatCurrency";
import { formatDate } from "@/src/utils/formatDate";

type PackageCardProps = {
  item: TourismPackage;
};

export function PackageCard({ item }: PackageCardProps) {
  const firstMedia = item.media_items[0];

  return (
    <Link
      href={`/packages/${item.id}`}
      className="group block overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/60"
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-slate-100">
        {firstMedia ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={firstMedia.media_url}
            alt={item.package_name}
            className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="aspect-[4/3] w-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
            <Tag className="h-8 w-8 text-slate-300" />
          </div>
        )}

        {/* Price badge — overlaid on image */}
        <div className="absolute bottom-3 left-3">
          <span className="inline-flex items-center rounded-xl bg-slate-900/80 px-3 py-1.5 text-sm font-bold text-white backdrop-blur-sm">
            {formatCurrency(item.price)}
          </span>
        </div>

        {/* Event date badge */}
        {item.event_date && (
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center gap-1 rounded-xl bg-amber-400 px-2.5 py-1 text-xs font-semibold text-slate-900">
              <Calendar className="h-3 w-3" />
              {formatDate(item.event_date)}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Provider */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-100 text-[10px] font-bold text-slate-600 shrink-0">
            {item.provider.site_name.slice(0, 2).toUpperCase()}
          </div>
          <span className="text-xs font-medium text-slate-500 truncate">
            {item.provider.site_name}
          </span>
        </div>

        {/* Package name */}
        <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-amber-600 transition-colors">
          {item.package_name}
        </h3>

        {/* Description */}
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
          {item.description}
        </p>

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
          {item.provider.location ? (
            <span className="flex items-center gap-1 text-xs text-slate-400">
              <MapPin className="h-3 w-3" />
              {item.provider.location}
            </span>
          ) : (
            <span />
          )}
          <span className="flex items-center gap-1 text-xs font-semibold text-amber-600 group-hover:gap-2 transition-all">
            View details
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

