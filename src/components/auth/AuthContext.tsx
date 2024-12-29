import { createContext, useContext } from "react";
import { User } from "firebase/auth";

export type UserProfile = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
};

export type AuthContextType = {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: true,
});

export const useAuth = () => useContext(AuthContext);