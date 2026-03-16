
type DashboardCardsProps = {
  totalPackages: number;
  totalBookings: number;
  totalNotifications: number;
};

export function ProviderDashboardCards({
  totalPackages,
  totalBookings,
  totalNotifications,
}: DashboardCardsProps) {
  const items = [
    { label: "Published Packages", value: totalPackages },
    { label: "Bookings Received", value: totalBookings },
    { label: "Notifications", value: totalNotifications },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm"
        >
          <p className="text-sm text-slate-500">{item.label}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}