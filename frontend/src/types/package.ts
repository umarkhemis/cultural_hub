
export type PackageMedia = {
  id: string;
  media_url: string;
  thumbnail_url?: string | null;
  media_order: number;
};

export type TourismPackage = {
  id: string;
  package_name: string;
  description: string;
  price: number;
  duration?: string | null;
  event_date?: string | null;
  includes_text?: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  provider: {
    id: string;
    site_name: string;
    logo_url?: string | null;
    location?: string | null;
  };
  media_items: PackageMedia[];
};
