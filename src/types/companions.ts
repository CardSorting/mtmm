export type CompanionTheme = "professional" | "casual" | "fantasy";

export interface TagCategory {
  id: string;
  name: string;
  created_at: string;
}

export interface Tag {
  id: string;
  name: string;
  category_id: string;
  created_at: string;
  category?: TagCategory;
}

export interface Companion {
  id: string;
  name: string;
  avatar: string;
  description: string;
  theme: CompanionTheme;
  rating: number;
  companion_link: string;
  conversations: number;
  likes_count: number;
  dislikes_count: number;
  stars_count: number;
  featured: boolean;
  created_at: string;
  updated_at: string;
  tags?: Tag[];
  user_interaction?: {
    liked: boolean;
    disliked: boolean;
    starred: boolean;
  };
}

export interface CompanionFormData {
  name: string;
  avatar: string;
  description: string;
  companion_link: string;
  theme: CompanionTheme;
  featured: boolean;
  tags?: string[];
}
