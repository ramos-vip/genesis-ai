"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import Badge   from "@/components/ui/Badge";
import Button  from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import { useToast } from "@/shared/providers";
import { formatDate } from "@/shared/utils";
import { ROUTES } from "@/shared/constants";

export default function ProfileSection() {
  const { user, isLoaded } = useUser();
  const { toast }          = useToast();

  const [editing,    setEditing]    = useState(false);
  const [firstName,  setFirstName]  = useState(user?.firstName ?? "");
  const [lastName,   setLastName]   = useState(user?.lastName  ?? "");
  const [isSaving,   setIsSaving]   = useState(false);

  if (!isLoaded) return null;

  const email      = user?.primaryEmailAddress?.emailAddress ?? "";
  const avatarUrl  = user?.imageUrl;
  const initials   = [user?.firstName?.[0], user?.lastName?.[0]].filter(Boolean).join("").toUpperCase() || "U";
  const createdAt  = user?.createdAt ? formatDate(new Date(user.createdAt).toISOString(), "long") : "—";

  async function handleSave() {
    setIsSaving(true);
    try {
      await user?.update({ firstName: firstName.trim(), lastName: lastName.trim() });
      toast.success("Profile updated.");
      setEditing(false);
    } catch {
      toast.error("Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  }

  function handleCancel() {
    setFirstName(user?.firstName ?? "");
    setLastName(user?.lastName  ?? "");
    setEditing(false);
  }

  return (
    <div className="rounded-2xl border border-border bg-surface overflow-hidden" id="profile">
      <div className="px-6 py-4 border-b border-border flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">Profile</h3>
          <p className="text-xs text-text-muted mt-0.5">Your personal account information.</p>
        </div>
        {!editing && (
          <Button variant="secondary" size="sm" onClick={() => setEditing(true)}>
            Edit profile
          </Button>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-start gap-5 mb-6">
          {/* Avatar */}
          <div className="relative shrink-0">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarUrl} alt={user?.fullName ?? "Avatar"} className="w-16 h-16 rounded-xl object-cover border border-border" draggable={false} />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-violet-700 flex items-center justify-center text-xl font-bold text-white border border-border">
                {initials}
              </div>
            )}
          </div>

          {/* Name / Email */}
          <div className="flex-1 min-w-0">
            {editing ? (
              <div className="flex flex-col sm:flex-row gap-3 mb-3">
                <div className="flex-1">
                  <label className="text-xs font-medium text-text-secondary mb-1.5 block">First name</label>
                  <input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full h-10 rounded-lg border border-border bg-surface-elevated px-3 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-border-focus focus:ring-2 focus:ring-accent/20 transition-all"
                    placeholder="First name"
                    autoFocus
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs font-medium text-text-secondary mb-1.5 block">Last name</label>
                  <input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full h-10 rounded-lg border border-border bg-surface-elevated px-3 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-border-focus focus:ring-2 focus:ring-accent/20 transition-all"
                    placeholder="Last name"
                  />
                </div>
              </div>
            ) : (
              <p className="text-base font-semibold text-white mb-0.5 truncate">
                {user?.fullName || "No name set"}
              </p>
            )}
            <p className="text-sm text-text-muted truncate">{email}</p>
          </div>
        </div>

        {/* Edit actions */}
        {editing && (
          <div className="flex items-center gap-3 mb-6">
            <Button variant="primary" size="sm" onClick={handleSave} disabled={isSaving}>
              {isSaving ? <Spinner size="xs" color="white" /> : null}
              Save changes
            </Button>
            <Button variant="ghost" size="sm" onClick={handleCancel} disabled={isSaving}>
              Cancel
            </Button>
          </div>
        )}

        {/* Info grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-border">
          <div>
            <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-1">Email</p>
            <p className="text-sm text-text-primary truncate">{email || "—"}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-1">Member since</p>
            <p className="text-sm text-text-primary">{createdAt}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-1">Current plan</p>
            <div className="flex items-center gap-2">
              <Badge variant="primary" size="sm">Free</Badge>
              <a href={ROUTES.APP.BILLING.ROOT} className="text-xs text-accent hover:text-violet-400 transition-colors">
                Upgrade →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
