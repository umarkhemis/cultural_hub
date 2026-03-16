
import type { ExperienceMedia } from "@/src/types/experience";

type ExperienceMediaProps = {
  media: ExperienceMedia[];
};

export function ExperienceMediaGallery({ media }: ExperienceMediaProps) {
  const firstMedia = media[0];

  if (!firstMedia) {
    return (
      <div className="aspect-[4/3] w-full rounded-3xl bg-slate-100" />
    );
  }

  if (firstMedia.media_type === "video") {
    return (
      <div className="overflow-hidden rounded-3xl bg-slate-100">
        <video
          src={firstMedia.media_url}
          controls
          className="aspect-[4/3] w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl bg-slate-100">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={firstMedia.media_url}
        alt="Cultural experience"
        className="aspect-[4/3] w-full object-cover"
      />
    </div>
  );
}