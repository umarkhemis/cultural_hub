
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AlignLeft, MapPin, ArrowRight, CheckCircle2, Image as ImageIcon, Sparkles } from "lucide-react";

import { FormField } from "@/src/components/ui/form-field";
import { ROUTES } from "@/src/constants/routes";
import { useCreateExperienceMutation } from "./hooks";
import { useToastStore } from "@/src/store/toast-store";
import { MediaUploadField } from "@/src/components/ui/media-upload-field";

export function ProviderExperienceForm() {
  const router = useRouter();
  const mutation = useCreateExperienceMutation();

  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const [error, setError] = useState("");

  const { addToast } = useToastStore();

  const handleSubmit = async () => {
    setError("");

    if (!caption.trim()) {
      setError("A caption is required to publish this experience.");
      return;
    }
    if (!mediaUrl.trim()) {
      setError("Please upload an image or video before publishing.");
      return;
    }

    try {
      await mutation.mutateAsync({
        caption: caption.trim(),
        location: location.trim() || undefined,
        media_items: [{
          media_url: mediaUrl.trim(),
          media_type: mediaType,
          media_order: 0,
        }],
      });

      addToast({ type: "success", title: "Experience published!", description: "It is now live on the feed." });
      router.push(ROUTES.providerExperiences);
    } catch {
      setError("We could not create the experience. Please try again.");
    }
  };

  const inputBase = "w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 px-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-200";

  return (
    <div className="mt-8 overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">

      {/* ── Card header ── */}
      <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-8 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">New Experience</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Share a cultural moment with your audience
            </p>
          </div>
        </div>
      </div>

      <div className="px-8 py-8 space-y-7">

        {/* ── Caption ── */}
        <div className="space-y-2">
          <label htmlFor="caption" className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <AlignLeft className="h-4 w-4 text-slate-400" />
            Caption
            <span className="ml-auto text-[11px] font-normal text-slate-400">Required</span>
          </label>
          <textarea
            id="caption"
            placeholder="Describe the experience you want to share with your audience..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            rows={4}
            className={`${inputBase} resize-none`}
          />
          <div className="flex justify-end">
            <span className={`text-[11px] ${caption.length > 450 ? "text-red-500" : "text-slate-400"}`}>
              {caption.length} / 500
            </span>
          </div>
        </div>

        {/* ── Location ── */}
        <div className="space-y-2">
          <label htmlFor="location" className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <MapPin className="h-4 w-4 text-slate-400" />
            Location
            <span className="ml-auto text-[11px] font-normal text-slate-400">Optional</span>
          </label>
          <input
            id="location"
            placeholder="e.g. Kabale, Uganda"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className={inputBase}
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
            <span className="rounded-full bg-rose-50 px-2.5 py-0.5 text-[11px] font-semibold text-rose-500">
              Required
            </span>
          </div>

          <MediaUploadField
            label="Image or Video"
            accept="image/*,video/*"
            previewUrl={mediaUrl || null}
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
            Published experiences appear on the public discovery feed.
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
                Publishing...
              </>
            ) : (
              <>
                Publish Experience
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}

