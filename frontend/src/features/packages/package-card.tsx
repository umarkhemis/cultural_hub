
import Link from "next/link";
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
      className="block overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="overflow-hidden bg-slate-100">
        {firstMedia ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={firstMedia.media_url}
            alt={item.package_name}
            className="aspect-[4/3] w-full object-cover"
          />
        ) : (
          <div className="aspect-[4/3] w-full bg-slate-100" />
        )}
      </div>

      <div className="space-y-3 p-5">
        <div>
          <p className="text-sm text-slate-500">{item.provider.site_name}</p>
          <h3 className="mt-1 text-lg font-semibold text-slate-900">
            {item.package_name}
          </h3>
        </div>

        <p className="line-clamp-2 text-sm leading-6 text-slate-600">
          {item.description}
        </p>

        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold text-slate-900">
            {formatCurrency(item.price)}
          </span>
          {item.event_date ? (
            <span className="text-slate-500">{formatDate(item.event_date)}</span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}