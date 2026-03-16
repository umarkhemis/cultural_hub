
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8">
      <div className="w-full max-w-lg rounded-3xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
        {children}
      </div>
    </main>
  );
}