
export async function shareUrl({
  title,
  text,
  url,
}: {
  title: string;
  text?: string;
  url: string;
}) {
  if (navigator.share) {
    await navigator.share({ title, text, url });
    return "shared";
  }

  await navigator.clipboard.writeText(url);
  return "copied";
}