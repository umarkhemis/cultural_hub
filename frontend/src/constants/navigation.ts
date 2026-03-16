
import { ROUTES } from "./routes";

export const touristNavItems = [
  { label: "Home", href: ROUTES.feed },
  { label: "Bookings", href: ROUTES.touristBookings },
  { label: "Notifications", href: ROUTES.touristNotifications },
  { label: "Profile", href: ROUTES.touristProfile },
];

export const providerNavItems = [
  { label: "Dashboard", href: ROUTES.providerRoot },
  { label: "Experiences", href: ROUTES.providerExperiences },
  { label: "Packages", href: ROUTES.providerPackages },
  { label: "Bookings", href: ROUTES.providerBookings },
  { label: "Notifications", href: ROUTES.providerNotifications },
  { label: "Profile", href: ROUTES.providerProfile },
];