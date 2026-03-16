
export type UserRole = "tourist" | "provider" | "admin";

export type CurrentUser = {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  phone?: string | null;
  profile_image_url?: string | null;
  is_active: boolean;
  is_verified: boolean;
};

export type AuthTokens = {
  access_token: string;
  refresh_token: string;
  token_type: string;
};

export type AuthPayload = {
  user: CurrentUser;
  tokens: AuthTokens;
};

export type TouristRegisterPayload = {
  full_name: string;
  email: string;
  phone?: string;
  password: string;
  role: "tourist";
};

export type ProviderRegisterPayload = {
  full_name: string;
  email: string;
  phone?: string;
  password: string;
  role: "provider";
  site_name: string;
  description: string;
  location: string;
  contact_email?: string;
  contact_phone?: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};