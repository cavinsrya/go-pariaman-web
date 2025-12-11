export type LocationData = {
  id: number;
  name: string;
};

export type SocialLink = {
  platform: string;
  url: string;
};

export type UserData = {
  id: string; 
  name: string;
  avatar_url?: string;
  role: string;
};

export type StoreData = {
  user: any;
  logo_url: string | null;
  avatar_url: string | null;
  cover_url: string | null;
  name: string | null;
  phone: string | null;
  description: string | null;
  address: string | null;
  district_id: number | string | null;
  sub_district_id: number | string | null;
  village_id: number | string | null;
};
