
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/src/components/ui/button";
import { FormField } from "@/src/components/ui/form-field";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { ROUTES } from "@/src/constants/routes";
import { useCreatePackageMutation } from "./hooks";

export function ProviderPackageForm() {
  const router = useRouter();
  const mutation = useCreatePackageMutation();

  const [packageName, setPackageName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [includesText, setIncludesText] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [error, setError] = useState("");

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
          ? [
              {
                media_url: mediaUrl.trim(),
                thumbnail_url: thumbnailUrl.trim() || undefined,
                media_order: 0,
              },
            ]
          : [],
      });

      router.push(ROUTES.providerPackages);
    } catch {
      setError("We could not create the package. Please try again.");
    }
  };

  return (
    <div className="space-y-5 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <FormField label="Package Name" htmlFor="package_name">
        <Input
          id="package_name"
          placeholder="Saturday Cultural Dance Night"
          value={packageName}
          onChange={(e) => setPackageName(e.target.value)}
        />
      </FormField>

      <FormField label="Description" htmlFor="description">
        <Textarea
          id="description"
          placeholder="Describe the cultural tourism package..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </FormField>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Price" htmlFor="price">
          <Input
            id="price"
            type="number"
            placeholder="25000"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </FormField>

        <FormField label="Duration" htmlFor="duration">
          <Input
            id="duration"
            placeholder="3 hours"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
        </FormField>
      </div>

      <FormField label="Event Date" htmlFor="event_date">
        <Input
          id="event_date"
          type="datetime-local"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
        />
      </FormField>

      <FormField label="What is included" htmlFor="includes_text">
        <Textarea
          id="includes_text"
          placeholder="Entrance, guided storytelling, refreshments..."
          value={includesText}
          onChange={(e) => setIncludesText(e.target.value)}
        />
      </FormField>

      <FormField label="Cover Media URL" htmlFor="media_url">
        <Input
          id="media_url"
          placeholder="https://example.com/package.jpg"
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
          {mutation.isPending ? "Creating..." : "Create Package"}
        </Button>
      </div>
    </div>
  );
}