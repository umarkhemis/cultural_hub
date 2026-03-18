
"use client";

import { useState } from "react";

import { Button } from "@/src/components/ui/button";
import { FormField } from "@/src/components/ui/form-field";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import type { TourismPackage } from "@/src/types/package";
import { formatCurrency } from "@/src/utils/formatCurrency";
import { useDeletePackageMutation, useUpdatePackageMutation } from "./hooks";
import { useToastStore } from "@/src/store/toast-store";

type Props = {
  item: TourismPackage;
};

export function ProviderPackageCard({ item }: Props) {
  const [editing, setEditing] = useState(false);
  const [packageName, setPackageName] = useState(item.package_name);
  const [description, setDescription] = useState(item.description);
  const [price, setPrice] = useState(String(item.price));
  const [duration, setDuration] = useState(item.duration || "");
  const [includesText, setIncludesText] = useState(item.includes_text || "");

  const updateMutation = useUpdatePackageMutation();
  const deleteMutation = useDeletePackageMutation();
  const { addToast } = useToastStore();

  const firstMedia = item.media_items[0];

  const handleUpdate = async () => {
    try {
      await updateMutation.mutateAsync({
        packageId: item.id,
        payload: {
          package_name: packageName,
          description,
          price: Number(price),
          duration: duration || undefined,
          includes_text: includesText || undefined,
        },
      });

      addToast({
        type: "success",
        title: "Package updated",
        description: "Your package changes were saved.",
      });
      setEditing(false);
    } catch {
      addToast({
        type: "error",
        title: "Update failed",
        description: "We could not update this package.",
      });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(item.id);
      addToast({
        type: "success",
        title: "Package archived",
        description: "The package was removed from public listing.",
      });
    } catch {
      addToast({
        type: "error",
        title: "Delete failed",
        description: "We could not remove this package.",
      });
    }
  };

  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
      {firstMedia ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={firstMedia.media_url}
          alt={item.package_name}
          className="aspect-[16/9] w-full object-cover"
        />
      ) : (
        <div className="aspect-[16/9] w-full bg-slate-100" />
      )}

      <div className="space-y-4 p-5">
        {!editing ? (
          <>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">{item.package_name}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-slate-900">
                {formatCurrency(item.price)}
              </span>
              <span className="text-slate-500">{item.duration || "No duration"}</span>
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setEditing(true)}>
                Edit
              </Button>
              <Button
                variant="ghost"
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? "Removing..." : "Delete"}
              </Button>
            </div>
          </>
        ) : (
          <>
            <FormField label="Package Name" htmlFor={`package-name-${item.id}`}>
              <Input
                id={`package-name-${item.id}`}
                value={packageName}
                onChange={(e) => setPackageName(e.target.value)}
              />
            </FormField>

            <FormField label="Description" htmlFor={`package-desc-${item.id}`}>
              <Textarea
                id={`package-desc-${item.id}`}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </FormField>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Price" htmlFor={`package-price-${item.id}`}>
                <Input
                  id={`package-price-${item.id}`}
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </FormField>

              <FormField label="Duration" htmlFor={`package-duration-${item.id}`}>
                <Input
                  id={`package-duration-${item.id}`}
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
              </FormField>
            </div>

            <FormField label="Included Items" htmlFor={`package-includes-${item.id}`}>
              <Textarea
                id={`package-includes-${item.id}`}
                value={includesText}
                onChange={(e) => setIncludesText(e.target.value)}
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