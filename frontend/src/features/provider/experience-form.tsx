
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

    try {
      await mutation.mutateAsync({
        caption: caption.trim(),
        location: location.trim() || undefined,
        media_items: [
          {
            media_url: mediaUrl.trim(),
            media_type: mediaType,
            // thumbnail_url: thumbnailUrl.trim() || undefined,
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

      

        <div className="space-y-3">
          <p className="text-sm font-medium text-slate-800">Media</p>
          <MediaUploadField
            label="Image or Video"
            accept="image/*,video/*"
            previewUrl={mediaUrl || null}
            onUploaded={({ mediaUrl, resourceType }) => {
              setMediaUrl(mediaUrl);
              setMediaType(resourceType);
            }}
          />

          {mediaUrl ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
              Uploaded successfully.
            </div>
          ) : null}
        </div>

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