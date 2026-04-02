
"use client";

import { useState } from "react";
import { MapPin, Heart, MessageCircle, Trash2, ImageIcon, VideoIcon } from "lucide-react";
import { Experience } from "@/src/types/experience";
import { useDeleteExperienceMutation } from "./hooks";
import { useToastStore } from "@/src/store/toast-store";

export function ProviderExperienceCard({ item }: { item: Experience }) {
  const deleteMutation = useDeleteExperienceMutation();
  const { addToast } = useToastStore();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const firstMedia = item.media_items?.[0];

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    try {
      await deleteMutation.mutateAsync(item.id);
      addToast({ type: "success", title: "Experience deleted." });
    } catch {
      addToast({ type: "error", title: "Could not delete experience. Please try again." });
    }
  };

  return (
    <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">

      {/* Media */}
      <div className="relative h-52 w-full bg-slate-100">
        {firstMedia ? (
          firstMedia.media_type === "video" ? (
            <video
              src={firstMedia.media_url}
              poster={firstMedia.thumbnail_url ?? undefined}
              className="h-full w-full object-cover"
              muted
            />
          ) : (
            <img
              src={firstMedia.media_url}
              alt={item.caption}
              className="h-full w-full object-cover"
            />
          )
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ImageIcon className="h-8 w-8 text-slate-300" />
          </div>
        )}

        {/* Media type badge */}
        {firstMedia && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-black/50 px-2.5 py-1 backdrop-blur-sm">
            {firstMedia.media_type === "video"
              ? <VideoIcon className="h-3 w-3 text-white" />
              : <ImageIcon className="h-3 w-3 text-white" />}
            <span className="text-[10px] font-semibold text-white capitalize">
              {firstMedia.media_type}
            </span>
          </div>
        )}

        {/* Status badge */}
        <div className="absolute top-3 right-3 rounded-full bg-emerald-500 px-2.5 py-1">
          <span className="text-[10px] font-semibold text-white capitalize">{item.status}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">

        {/* Caption */}
        <p className="text-sm text-slate-800 leading-relaxed line-clamp-3">{item.caption}</p>

        {/* Location */}
        {item.location && (
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span className="text-xs text-slate-500">{item.location}</span>
          </div>
        )}

        {/* Stats + Delete */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Heart className="h-4 w-4 text-slate-400" />
              <span className="text-xs font-medium text-slate-600">{item.likes_count}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MessageCircle className="h-4 w-4 text-slate-400" />
              <span className="text-xs font-medium text-slate-600">{item.comments_count}</span>
            </div>
          </div>

          <button
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all disabled:opacity-50 ${
              confirmDelete
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-red-50 text-red-600 hover:bg-red-100"
            }`}
          >
            <Trash2 className="h-3.5 w-3.5" />
            {deleteMutation.isPending ? "Deleting..." : confirmDelete ? "Confirm" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
