"use client";
import { useAuth } from "../hooks/useAuth";

export const AuthInitializer = () => {
  useAuth();
  return null;
};
