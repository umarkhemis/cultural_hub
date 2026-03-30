
export default function FeedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // No navbar, no footer, no padding — pure full-screen
  return (
    <div className="fixed inset-0 z-50 bg-black">
      {children}
    </div>
  );
}