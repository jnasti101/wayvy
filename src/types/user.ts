export interface UserProfile {
  id: string;
  email?: string;
  full_name?: string;
  avatar_url?: string;
  phone?: string;
  bio?: string;
  location?: string;
  created_at?: string;
}

export interface AuthState {
  user: UserProfile | null;
  session: any | null;
  loading: boolean;
}
