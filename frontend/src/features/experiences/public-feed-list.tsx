
import { ExperienceCard } from "./experience-card";
import type { Experience } from "@/src/types/experience";

type PublicFeedListProps = {
  items: Experience[];
};

export function PublicFeedList({ items }: PublicFeedListProps) {
  return (
    <div className="grid gap-6">
      {items.map((experience) => (
        <ExperienceCard key={experience.id} experience={experience} />
      ))}
    </div>
  );
}