
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { ROUTES } from "@/src/constants/routes";

export default function ProviderExperiencesPage() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Experiences
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Manage the experiences you publish to the public discovery feed.
          </p>
        </div>

        <Link href={ROUTES.providerNewExperience}>
          <Button>Create Experience</Button>
        </Link>
      </div>

      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm leading-6 text-slate-600">
          Provider experience management list is ready to connect next. The current
          backend already supports experience creation, and we should add a
          dedicated “my experiences” endpoint to complete this screen properly.
        </p>
      </div>
    </div>
  );
}