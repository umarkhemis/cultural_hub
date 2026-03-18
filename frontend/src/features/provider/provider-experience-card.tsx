
"use client";

import { useState } from "react";

import { Button } from "@/src/components/ui/button";
import { FormField } from "@/src/components/ui/form-field";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import type { Experience } from "@/src/types/experience";
import { useDeleteExperienceMutation, useUpdateExperienceMutation } from "./hooks";
import { useToastStore } from "@/src/store/toast-store";

type Props = {
  item: Experience;
};

export function ProviderExperienceCard({ item }: Props) {
  const [editing, setEditing] = useState(false);
  const [caption, setCaption] = useState(item.caption);
  const [location, setLocation] = useState(item.location || "");

  const updateMutation = useUpdateExperienceMutation();
  const deleteMutation = useDeleteExperienceMutation();
  const { addToast } = useToastStore();

  const firstMedia = item.media_items[0];

  const handleUpdate = async () => {
    try {
      await updateMutation.mutateAsync({
        experienceId: item.id,
        payload: {
          caption,
          location: location || undefined,
        },
      });

      addToast({
        type: "success",
        title: "Experience updated",
        description: "Your experience changes were saved.",
      });
      setEditing(false);
    } catch {
      addToast({
        type: "error",
        title: "Update failed",
        description: "We could not update this experience.",
      });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(item.id);
      addToast({
        type: "success",
        title: "Experience deleted",
        description: "The experience was removed successfully.",
      });
    } catch {
      addToast({
        type: "error",
        title: "Delete failed",
        description: "We could not delete this experience.",
      });
    }
  };

  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
      {firstMedia ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={firstMedia.media_url}
          alt={item.caption}
          className="aspect-[16/9] w-full object-cover"
        />
      ) : (
        <div className="aspect-[16/9] w-full bg-slate-100" />
      )}

      <div className="space-y-4 p-5">
        {!editing ? (
          <>
            <p className="text-sm leading-6 text-slate-700">{item.caption}</p>
            <p className="text-sm text-slate-500">{item.location || "No location"}</p>

            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setEditing(true)}>
                Edit
              </Button>
              <Button
                variant="ghost"
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </>
        ) : (
          <>
            <FormField label="Caption" htmlFor={`experience-caption-${item.id}`}>
              <Textarea
                id={`experience-caption-${item.id}`}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              />
            </FormField>

            <FormField label="Location" htmlFor={`experience-location-${item.id}`}>
              <Input
                id={`experience-location-${item.id}`}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </FormField>

            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdate} disabled={updateMutation.isPending}>
                {updateMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

