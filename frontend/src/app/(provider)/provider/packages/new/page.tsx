
import { ProviderPackageForm } from "@/src/features/provider/package-form";

export default function NewPackagePage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Create Package
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Create a structured tourism package that tourists can view and book.
        </p>
      </div>

      <ProviderPackageForm />
    </div>
  );
}