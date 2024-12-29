import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "./supabase";

type UserRole = "admin" | "user";

type AuthContextType = {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
};

type UserProfile = {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: true,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const useRole = () => {
  const { userProfile } = useAuth();
  return userProfile?.role;
};

export const useIsAdmin = () => {
  const role = useRole();
  return role === "admin";
};

export const useIsUser = () => {
  const role = useRole();
  return role === "user";
};
