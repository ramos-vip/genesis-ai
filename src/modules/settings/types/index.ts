import type { ID, Timestamps } from "@/shared/types";
import type { UserRole } from "@/modules/auth";

export interface TeamMember extends Timestamps {
  id:             ID;
  userId:         ID;
  organizationId: ID;
  role:           UserRole;
  name:           string;
  email:          string;
  avatar?:        string;
  inviteStatus:   "accepted" | "pending" | "expired";
}

export interface Integration extends Timestamps {
  id:             ID;
  organizationId: ID;
  provider:       string;
  name:           string;
  status:         "connected" | "error" | "disconnected";
  scopes:         string[];
  accountName?:   string;
  accountEmail?:  string;
}

export interface ApiKey extends Timestamps {
  id:             ID;
  organizationId: ID;
  name:           string;
  prefix:         string;  // visible prefix, e.g. "sk_live_"
  lastUsedAt?:    string;
  expiresAt?:     string;
  permissions:    ("read" | "write" | "admin")[];
}

export interface ProfileUpdateDto {
  name?:   string;
  avatar?: File;
}

export interface OrganizationUpdateDto {
  name?: string;
  logo?: File;
}

export interface InviteTeamMemberDto {
  email: string;
  role:  UserRole;
}
