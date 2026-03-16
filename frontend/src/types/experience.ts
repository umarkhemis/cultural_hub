
export type ExperienceMedia = {
  id: string;
  media_url: string;
  media_type: "image" | "video";
  thumbnail_url?: string | null;
  media_order: number;
};

export type ExperienceProvider = {
  id: string;
  site_name: string;
  logo_url?: string | null;
  location?: string | null;
};

export type Experience = {
  id: string;
  caption: string;
  location?: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  provider: ExperienceProvider;
  media_items: ExperienceMedia[];
  likes_count: number;
  comments_count: number;
  liked_by_current_user: boolean;
};