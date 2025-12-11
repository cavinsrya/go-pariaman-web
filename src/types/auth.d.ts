export type AuthFormState = {
  status?: string;
  errors?: {
    email?: string[];
    password?: string[];
    name?: string[];
    role?: string[];
    _form?: string[];
    currentPassword?: string[];
    newPassword?: string[];
    confirmPassword?: string[];
  };
};

export type CompleteProfileFormState = {
  status?: string;
  errors?: {
    name?: string[];
    description?: string[];
    address?: string[];
    phone?: string[];
    district_id?: string[];
    sub_district_id?: string[];
    village_id?: string[];
    avatar_url?: string[];
    logo_url?: string[];
    cover_url?: string[];
    social_links?: string[];
    _form?: string[];
  };
};

export type Profile = {
  id?: string;
  name?: string;
  avatar_url?: string;
  role?: string;
  is_profile_completed?: boolean;
};

export type StoreProfile = {
  id: number;
  name: string;
  description: string | null;
  phone: string | null;
  address: string | null;
  logo_url: string | null;
  cover_url: string | null;
  owner_user_id: string; 
  sub_district_id: number | null;
  village_id: number | null;
  users: {
    name: string;
    avatar_url: string | null;
  } | null;

  sub_districts: {
    name: string;
  } | null;

  villages: {
    name: string;
  } | null;

  store_social_links: Array<{
    platform: string;
    url: string;
  }> | null;
};
