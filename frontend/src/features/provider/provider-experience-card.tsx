
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AlignLeft, MapPin, Upload, ArrowRight, CheckCircle2, Image as ImageIcon } from "lucide-react";

import { FormField } from "@/src/components/ui/form-field";
import { ROUTES } from "@/src/constants/routes";
import { useCreateExperienceMutation } from "./hooks";
import { useToastStore } from "@/src/store/toast-store";
import { MediaUploadField } from "@/src/components/ui/media-upload-field";

export function ProviderExperienceForm() {
  const router = useRouter();
  const mutation = useCreateExperienceMutation();
  const { addToast } = useToastStore();

  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const [error, setError] = useState("");

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
      setError("We could not publish the experience. Please try again.");
    }
  };

  const inputClass = "w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 px-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-400/20";

  return (
    <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">

      {/* Form header */}
      <div className="border-b border-slate-100 bg-slate-50 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-900">
            <Upload className="h-4 w-4 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Publish New Experience</h2>
            <p className="text-xs text-slate-500">Share a cultural moment with your audience</p>
          </div>
        </div>
      </div>

      <div className="space-y-5 p-6">

        {/* Caption */}
        <FormField label="Caption" htmlFor="caption">
          <div className="relative">
            <AlignLeft className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
            <textarea
              id="caption"
              placeholder="Describe the experience you want to share..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={4}
              className={`${inputClass} resize-none pl-10`}
            />
          </div>
          <div className="mt-1 flex justify-end">
            <span className={`text-xs ${caption.length > 400 ? "text-red-500" : "text-slate-400"}`}>
              {caption.length}/500
            </span>
          </div>
        </FormField>

        {/* Location */}
        <FormField label="Location" htmlFor="location">
          <div className="relative">
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            <input
              id="location"
              placeholder="e.g. Kabale, Uganda"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className={`${inputClass} pl-10`}
            />
          </div>
        </FormField>

        {/* Media upload */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4 text-slate-500" />
            <p className="text-sm font-semibold text-slate-800">Media</p>
            <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-600">
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
            <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <p className="text-xs font-medium text-emerald-700">
                {mediaType === "video" ? "Video" : "Image"} uploaded successfully
              </p>
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Submit */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-4">
          <p className="text-xs text-slate-400">
            Published experiences appear on the public feed.
          </p>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={mutation.isPending}
            className="group flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-slate-700 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {mutation.isPending ? (
              <>
                <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
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



