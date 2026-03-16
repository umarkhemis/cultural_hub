
export function formatDate(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);

  return new Intl.DateTimeFormat("en-UG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}