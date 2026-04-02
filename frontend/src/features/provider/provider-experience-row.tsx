
"use client";

import { useState } from "react";
import { MapPin, Heart, MessageCircle, Trash2, ImageIcon, VideoIcon } from "lucide-react";
import { Experience } from "@/src/types/experience";
import { useDeleteExperienceMutation } from "./hooks";
import { useToastStore } from "@/src/store/toast-store";

interface Props {
  item: Experience;
  selected: boolean;
  onToggleSelect: () => void;
  isLast: boolean;
}

export function ProviderExperienceRow({ item, selected, onToggleSelect, isLast }: Props) {
  const deleteMutation = useDeleteExperienceMutation();
  const { addToast } = useToastStore();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const firstMedia = item.media_items?.[0];

  const handleDelete = async () => {
    if (!confirmDelete) { setConfirmDelete(true); return; }
    try {
      await deleteMutation.mutateAsync(item.id);
      addToast({ type: "success", title: "Experience deleted." });
    } catch {
      addToast({ type: "error", title: "Could not delete. Please try again." });
    }
  };

  const statusColors: Record<string, string> = {
    published: "bg-emerald-100 text-emerald-700",
    draft: "bg-amber-100 text-amber-700",
    archived: "bg-slate-100 text-slate-500",
  };

  return (
    <div className={`flex items-center gap-4 px-4 py-3.5 transition-colors hover:bg-slate-50 ${!isLast ? "border-b border-slate-100" : ""} ${selected ? "bg-blue-50/50" : ""}`}>

      {/* Checkbox */}
      <input
        type="checkbox"
        checked={selected}
        onChange={onToggleSelect}
        className="h-4 w-4 rounded border-slate-300 accent-slate-900 shrink-0"
      />

      {/* Thumbnail */}
      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-slate-100">
        {firstMedia ? (
          firstMedia.media_type === "video" ? (
            <div className="flex h-full w-full items-center justify-center bg-slate-200">
              <VideoIcon className="h-4 w-4 text-slate-400" />
            </div>
          ) : (
            <img src={firstMedia.media_url} alt="" className="h-full w-full object-cover" />
          )
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ImageIcon className="h-4 w-4 text-slate-300" />
          </div>
        )}
      </div>

      {/* Caption + location */}
      <div className="flex-1 min-w-0">
        <p className="truncate text-sm font-medium text-slate-800">{item.caption}</p>
        {item.location && (
          <div className="mt-0.5 flex items-center gap-1">
            <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
            <span className="truncate text-xs text-slate-400">{item.location}</span>
          </div>
        )}
        <p className="mt-0.5 text-[11px] text-slate-400">
          {new Date(item.created_at).toLocaleDateString("en-UG", { day: "numeric", month: "short", year: "numeric" })}
        </p>
      </div>

      {/* Stats */}
      <div className="hidden sm:flex items-center gap-3 w-24 justify-center">
        <div className="flex items-center gap-1">
          <Heart className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-xs text-slate-600">{item.likes_count}</span>
        </div>
        <div className="flex items-center gap-1">
          <MessageCircle className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-xs text-slate-600">{item.comments_count}</span>
        </div>
      </div>

      {/* Status badge */}
      <div className="hidden sm:flex w-20 justify-center">
        <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold capitalize ${statusColors[item.status] ?? "bg-slate-100 text-slate-500"}`}>
          {item.status}
        </span>
      </div>

      {/* Delete */}
      <div className="w-20 flex justify-end">
        <button
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
          className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-semibold transition-all disabled:opacity-50 ${
            confirmDelete
              ? "bg-red-600 text-white hover:bg-red-700"
              : "bg-red-50 text-red-500 hover:bg-red-100"
          }`}
        >
          <Trash2 className="h-3.5 w-3.5" />
          {deleteMutation.isPending ? "..." : confirmDelete ? "Confirm" : "Delete"}
        </button>
      </div>
    </div>
  );
}