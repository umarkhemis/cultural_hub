
"use client";

import { useState } from "react";
import {
  Pencil, Trash2, X, Check, Tag, Clock,
  DollarSign, AlignLeft, CheckSquare, Image as ImageIcon,
} from "lucide-react";
import { FormField } from "@/src/components/ui/form-field";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import type { TourismPackage } from "@/src/types/package";
import { formatCurrency } from "@/src/utils/formatCurrency";
import { useDeletePackageMutation, useUpdatePackageMutation } from "./hooks";
import { useToastStore } from "@/src/store/toast-store";
import { cn } from "@/src/utils/cn";

type Props = { item: TourismPackage };

export function ProviderPackageCard({ item }: Props) {
  const [editing, setEditing] = useState(false);
  const [packageName, setPackageName] = useState(item.package_name);
  const [description, setDescription] = useState(item.description);
  const [price, setPrice] = useState(String(item.price));
  const [duration, setDuration] = useState(item.duration || "");
  const [includesText, setIncludesText] = useState(item.includes_text || "");
  const [confirmDelete, setConfirmDelete] = useState(false);

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
      addToast({ type: "success", title: "Package updated", description: "Your changes were saved." });
      setEditing(false);
    } catch {
      addToast({ type: "error", title: "Update failed", description: "We could not update this package." });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(item.id);
      addToast({ type: "success", title: "Package archived", description: "Removed from public listing." });
    } catch {
      addToast({ type: "error", title: "Delete failed", description: "We could not remove this package." });
    }
  };

  const inputClass = "w-full rounded-2xl border border-slate-200 bg-slate-50 py-2.5 px-3.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-400/20";

  return (
    <div className={cn(
      "overflow-hidden rounded-[28px] border bg-white shadow-sm transition-all duration-200",
      editing ? "border-amber-300 shadow-amber-100" : "border-slate-200 hover:shadow-md"
    )}>

      {/* Media */}
      <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
        {firstMedia ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={firstMedia.media_url}
            alt={item.package_name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
            <ImageIcon className="h-8 w-8 text-slate-300" />
          </div>
        )}

        {/* Price overlay */}
        <div className="absolute bottom-3 left-3">
          <span className="inline-flex items-center rounded-xl bg-slate-900/80 px-3 py-1.5 text-sm font-bold text-white backdrop-blur-sm">
            {formatCurrency(item.price)}
          </span>
        </div>

        {/* Edit mode indicator */}
        {editing && (
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center gap-1.5 rounded-xl bg-amber-400 px-3 py-1.5 text-xs font-bold text-slate-900">
              <Pencil className="h-3 w-3" />
              Editing
            </span>
          </div>
        )}
      </div>

      <div className="p-5">
        {!editing ? (
          /* ── View mode ── */
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-snug">{item.package_name}</h3>
              <p className="mt-1.5 text-sm leading-6 text-slate-500 line-clamp-2">{item.description}</p>
            </div>

            {/* Meta pills */}
            <div className="flex flex-wrap gap-2">
              {item.duration && (
                <span className="flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                  <Clock className="h-3 w-3" />
                  {item.duration}
                </span>
              )}
              {item.includes_text && (
                <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                  <CheckSquare className="h-3 w-3" />
                  Includes listed
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-100"
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </button>

              {!confirmDelete ? (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="flex items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition-all hover:bg-red-100"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <p className="text-xs text-slate-500">Sure?</p>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={deleteMutation.isPending}
                    className="flex items-center gap-1.5 rounded-2xl bg-red-600 px-3 py-2 text-xs font-bold text-white hover:bg-red-700 disabled:opacity-60"
                  >
                    <Check className="h-3 w-3" />
                    {deleteMutation.isPending ? "..." : "Yes"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(false)}
                    className="flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
                  >
                    <X className="h-3 w-3" />
                    No
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* ── Edit mode ── */
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-bold text-slate-900">Edit Package</p>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            <FormField label="Package Name" htmlFor={`name-${item.id}`}>
              <div className="relative">
                <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  id={`name-${item.id}`}
                  value={packageName}
                  onChange={(e) => setPackageName(e.target.value)}
                  className={cn(inputClass, "pl-10")}
                />
              </div>
            </FormField>

            <FormField label="Description" htmlFor={`desc-${item.id}`}>
              <div className="relative">
                <AlignLeft className="absolute left-3.5 top-3 h-4 w-4 text-slate-400 pointer-events-none" />
                <Textarea
                  id={`desc-${item.id}`}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="pl-10"
                />
              </div>
            </FormField>

            <div className="grid gap-3 sm:grid-cols-2">
              <FormField label="Price" htmlFor={`price-${item.id}`}>
                <div className="relative">
                  <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  <input
                    id={`price-${item.id}`}
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className={cn(inputClass, "pl-10")}
                  />
                </div>
              </FormField>

              <FormField label="Duration" htmlFor={`duration-${item.id}`}>
                <div className="relative">
                  <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  <input
                    id={`duration-${item.id}`}
                    value={duration}
                    placeholder="e.g. 3 days"
                    onChange={(e) => setDuration(e.target.value)}
                    className={cn(inputClass, "pl-10")}
                  />
                </div>
              </FormField>
            </div>

            <FormField label="Included Items" htmlFor={`includes-${item.id}`}>
              <div className="relative">
                <CheckSquare className="absolute left-3.5 top-3 h-4 w-4 text-slate-400 pointer-events-none" />
                <Textarea
                  id={`includes-${item.id}`}
                  value={includesText}
                  placeholder="e.g. Transport, meals, guide..."
                  onChange={(e) => setIncludesText(e.target.value)}
                  className="pl-10"
                />
              </div>
            </FormField>

            <div className="flex items-center gap-3 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUpdate}
                disabled={updateMutation.isPending}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-slate-900 py-2.5 text-sm font-bold text-white hover:bg-slate-700 disabled:opacity-60 transition-all"
              >
                {updateMutation.isPending ? (
                  <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
                {updateMutation.isPending ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


