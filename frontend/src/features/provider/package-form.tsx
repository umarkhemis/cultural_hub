
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Package,
  AlignLeft,
  DollarSign,
  Clock,
  CalendarDays,
  ListChecks,
  ImageIcon,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

import { ROUTES } from "@/src/constants/routes";
import { useCreatePackageMutation } from "./hooks";
import { MediaUploadField } from "@/src/components/ui/media-upload-field";

export function ProviderPackageForm() {
  const router = useRouter();
  const mutation = useCreatePackageMutation();

  const [packageName, setPackageName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [includesText, setIncludesText] = useState("");
  const [error, setError] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaType, setMediaType] = useState<"image" | "video">("image");

  const handleSubmit = async () => {
    setError("");

    if (!packageName.trim()) {
      setError("Package name is required.");
      return;
    }
    if (!description.trim()) {
      setError("Description is required.");
      return;
    }
    if (!price.trim() || Number(price) <= 0) {
      setError("Enter a valid price.");
      return;
    }

    try {
      await mutation.mutateAsync({
        package_name: packageName.trim(),
        description: description.trim(),
        price: Number(price),
        duration: duration.trim() || undefined,
        event_date: eventDate || undefined,
        includes_text: includesText.trim() || undefined,
        media_items: mediaUrl.trim()
          ? [{ media_url: mediaUrl.trim(), media_order: 0 }]
          : [],
      });

      router.push(ROUTES.providerPackages);
    } catch {
      setError("We could not create the package. Please try again.");
    }
  };

  const inputBase =
    "w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 px-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-200";

  const fieldLabel = (
    icon: React.ReactNode,
    label: string,
    hint?: string
  ) => (
    <div className="flex items-center gap-2 mb-2">
      <span className="text-slate-400">{icon}</span>
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      {hint && (
        <span className="ml-auto text-[11px] font-normal text-slate-400">{hint}</span>
      )}
    </div>
  );

  return (
    <div className="mt-8 overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">

      {/* ── Header ── */}
      <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-8 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900">
            <Package className="h-4 w-4 text-white" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">New Package</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Create a cultural tourism package for your guests
            </p>
          </div>
        </div>
      </div>

      <div className="px-8 py-8 space-y-7">

        {/* ── Package Name ── */}
        <div>
          {fieldLabel(<Package className="h-4 w-4" />, "Package Name", "Required")}
          <input
            id="package_name"
            placeholder="e.g. Saturday Cultural Dance Night"
            value={packageName}
            onChange={(e) => setPackageName(e.target.value)}
            className={inputBase}
          />
        </div>

        {/* ── Description ── */}
        <div>
          {fieldLabel(<AlignLeft className="h-4 w-4" />, "Description", "Required")}
          <textarea
            id="description"
            placeholder="Describe the cultural tourism package in detail..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className={`${inputBase} resize-none`}
          />
          <div className="flex justify-end mt-1">
            <span className={`text-[11px] ${description.length > 450 ? "text-red-500" : "text-slate-400"}`}>
              {description.length} / 500
            </span>
          </div>
        </div>

        {/* ── Price + Duration ── */}
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            {fieldLabel(<DollarSign className="h-4 w-4" />, "Price (UGX)", "Required")}
            <input
              id="price"
              type="number"
              placeholder="e.g. 25000"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className={inputBase}
            />
          </div>
          <div>
            {fieldLabel(<Clock className="h-4 w-4" />, "Duration", "Optional")}
            <input
              id="duration"
              placeholder="e.g. 3 hours"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className={inputBase}
            />
          </div>
        </div>

        {/* ── Event Date ── */}
        <div>
          {fieldLabel(<CalendarDays className="h-4 w-4" />, "Event Date & Time", "Optional")}
          <input
            id="event_date"
            type="datetime-local"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            className={inputBase}
          />
        </div>

        {/* ── What's Included ── */}
        <div>
          {fieldLabel(<ListChecks className="h-4 w-4" />, "What's Included", "Optional")}
          <textarea
            id="includes_text"
            placeholder="e.g. Entrance, guided storytelling, refreshments..."
            value={includesText}
            onChange={(e) => setIncludesText(e.target.value)}
            rows={3}
            className={`${inputBase} resize-none`}
          />
        </div>

        {/* ── Divider ── */}
        <div className="border-t border-dashed border-slate-200" />

        {/* ── Media ── */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-slate-400" />
              <p className="text-sm font-semibold text-slate-700">Media</p>
            </div>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-500">
              Optional
            </span>
          </div>

          <MediaUploadField
            label="Image or Video"
            accept="image/*,video/*"
            onUploaded={({ mediaUrl, resourceType }) => {
              setMediaUrl(mediaUrl);
              setMediaType(resourceType);
            }}
          />

          {mediaUrl && (
            <div className="flex items-center gap-2.5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2.5">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
              <p className="text-xs font-medium text-emerald-700">
                {mediaType === "video" ? "Video" : "Image"} uploaded and ready
              </p>
            </div>
          )}
        </div>

        {/* ── Error ── */}
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* ── Footer ── */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-5">
          <p className="text-xs text-slate-400 max-w-[200px] leading-relaxed">
            Packages are listed publicly for guests to discover and book.
          </p>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={mutation.isPending}
            className="group flex items-center gap-2.5 rounded-2xl bg-slate-900 px-6 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-slate-700 hover:shadow-lg active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {mutation.isPending ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Creating...
              </>
            ) : (
              <>
                Create Package
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}


