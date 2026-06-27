import type { ID, ISODate, Timestamps } from "@/shared/types";

export type UserRole = "owner" | "admin" | "member" | "viewer";

export interface User extends Timestamps {
  id:             ID;
  email:          string;
  name:           string;
  avatar?:        string;
  role:           UserRole;
  organizationId: ID;
  emailVerified:  boolean;
  lastActiveAt?:  ISODate;
}

export interface Organization extends Timestamps {
  id:       ID;
  name:     string;
  slug:     string;
  logo?:    string;
  plan:     "starter" | "pro" | "scale" | "enterprise";
  ownerId:  ID;
}

export interface Session {
  user:         User;
  organization: Organization;
  accessToken:  string;
  expiresAt:    ISODate;
}

export interface LoginCredentials {
  email:       string;
  password:    string;
  rememberMe?: boolean;
}

export interface SignupCredentials {
  name:             string;
  email:            string;
  password:         string;
  organizationName: string;
}

export interface ResetPasswordRequest {
  email: string;
}

export interface UpdatePasswordRequest {
  token:       string;
  newPassword: string;
}
