
type ErrorStateProps = {
  title?: string;
  description?: string;
};

export function ErrorState({
  title = "Something went wrong",
  description = "We could not load this content. Please try again.",
}: ErrorStateProps) {
  return (
    <div className="rounded-3xl border border-red-200 bg-red-50 px-6 py-12 text-center">
      <h3 className="text-lg font-semibold text-red-900">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-red-700">{description}</p>
    </div>
  );
}