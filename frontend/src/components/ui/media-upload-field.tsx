
"use client";

import { useRef } from "react";
import { Button } from "@/src/components/ui/button";
import { useUploadMediaMutation } from "@/src/features/uploads/hooks";
import { useToastStore } from "@/src/store/toast-store";

type Props = {
  label: string;
  accept: string;
  previewUrl?: string | null;
  onUploaded: (result: {
    mediaUrl: string;
    resourceType: "image" | "video";
  }) => void;
};

export function MediaUploadField({
  label,
  accept,
  previewUrl,
  onUploaded,
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const uploadMutation = useUploadMediaMutation();
  const { addToast } = useToastStore();

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const response = await uploadMutation.mutateAsync(file);
      onUploaded({
        mediaUrl: response.data.secure_url,
        resourceType: response.data.resource_type,
      });

      addToast({
        type: "success",
        title: "Upload complete",
        description: "Your media was uploaded successfully.",
      });
    } catch {
      addToast({
        type: "error",
        title: "Upload failed",
        description: "We could not upload this file.",
      });
    } finally {
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleChange}
      />

      {previewUrl ? (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt="Uploaded preview"
            className="max-h-64 w-full object-cover"
          />
        </div>
      ) : null}

      {uploadMutation.isPending ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
          Uploading {label}...
        </div>
      ) : null}

      <Button
        type="button"
        variant="secondary"
        onClick={() => inputRef.current?.click()}
        disabled={uploadMutation.isPending}
      >
        {uploadMutation.isPending ? `Uploading ${label}...` : `Upload ${label}`}
      </Button>
    </div>
  );
}


