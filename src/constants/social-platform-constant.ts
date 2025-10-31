import {
  TokopediaIcon,
  WhatsappIcon,
  ShopeeIcon,
  TiktokIcon,
  FacebookIcon,
  InstagramIcon,
  GojekIcon,
} from "@/components/icons/social-icons";
import { CompleteProfileFormState } from "@/types/auth";

export type SocialPlatform = {
  id: string;
  label: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
};

export const SOCIAL_PLATFORMS: SocialPlatform[] = [
  { id: "facebook", label: "Facebook", icon: FacebookIcon },
  { id: "instagram", label: "Instagram", icon: InstagramIcon },
  { id: "whatsapp", label: "WhatsApp", icon: WhatsappIcon },
  { id: "tiktok", label: "TikTok", icon: TiktokIcon },
  { id: "gofood", label: "GoFood", icon: GojekIcon },
  { id: "shopee", label: "Shopee", icon: ShopeeIcon },
  { id: "tokopedia", label: "Tokopedia", icon: TokopediaIcon },
];

export const INITIAL_COMPLETE_PROFILE_FORM = {
  name: "",
  role: "",
  avatar_url: "",
  email: "",
  password: "",
};

export const INITIAL_STATE_COMPLETE_PROFILE_USER: CompleteProfileFormState = {
  status: "idle",
  errors: {
    name: [],
    description: [],
    address: [],
    phone: [],
    district_id: [],
    sub_district_id: [],
    village_id: [],
    avatar_url: [],
    logo_url: [],
    cover_url: [],
    social_links: [],
    _form: [],
  },
};
