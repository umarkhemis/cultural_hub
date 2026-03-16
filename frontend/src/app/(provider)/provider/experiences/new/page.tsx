
import { ProviderExperienceForm } from "@/src/features/provider/experience-form";

export default function NewExperiencePage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Upload Experience
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Publish an image or video experience that will appear in the public feed.
        </p>
      </div>

      <ProviderExperienceForm />
    </div>
  );
}