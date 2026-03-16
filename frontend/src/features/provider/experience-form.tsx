
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/src/components/ui/button";
import { FormField } from "@/src/components/ui/form-field";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { ROUTES } from "@/src/constants/routes";
import { useCreateExperienceMutation } from "./hooks";
import { useToastStore } from "@/src/store/toast-store";

export function ProviderExperienceForm() {
  const router = useRouter();
  const mutation = useCreateExperienceMutation();

  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const [error, setError] = useState("");

  const { addToast } = useToastStore();

  const handleSubmit = async () => {
    setError("");

    if (!caption.trim()) {
      setError("Caption is required.");
      return;
    }

    if (!mediaUrl.trim()) {
      setError("At least one media URL is required.");
      return;
    }

    try {
      await mutation.mutateAsync({
        caption: caption.trim(),
        location: location.trim() || undefined,
        media_items: [
          {
            media_url: mediaUrl.trim(),
            media_type: mediaType,
            thumbnail_url: thumbnailUrl.trim() || undefined,
            media_order: 0,
          },
        ],
      });

      router.push(ROUTES.providerExperiences);
    } catch {
      setError("We could not create the experience. Please try again.");
    }
  };

  return (
    <div className="space-y-5 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <FormField label="Caption" htmlFor="caption">
        <Textarea
          id="caption"
          placeholder="Describe the experience you want to share..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
      </FormField>

      <FormField label="Location" htmlFor="location">
        <Input
          id="location"
          placeholder="Kabale, Uganda"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </FormField>

      <FormField label="Media Type" htmlFor="media_type">
        <select
          id="media_type"
          value={mediaType}
          onChange={(e) => setMediaType(e.target.value as "image" | "video")}
          className="flex h-12 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
        >
          <option value="image">Image</option>
          <option value="video">Video</option>
        </select>
      </FormField>

      <FormField label="Media URL" htmlFor="media_url">
        <Input
          id="media_url"
          placeholder="https://example.com/experience.jpg"
          value={mediaUrl}
          onChange={(e) => setMediaUrl(e.target.value)}
        />
      </FormField>

      <FormField label="Thumbnail URL" htmlFor="thumbnail_url" hint="Optional">
        <Input
          id="thumbnail_url"
          placeholder="https://example.com/thumb.jpg"
          value={thumbnailUrl}
          onChange={(e) => setThumbnailUrl(e.target.value)}
        />
      </FormField>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="flex justify-end">
        <Button onClick={handleSubmit} disabled={mutation.isPending}>
          {mutation.isPending ? "Publishing..." : "Publish Experience"}
        </Button>
      </div>
    </div>
  );
}