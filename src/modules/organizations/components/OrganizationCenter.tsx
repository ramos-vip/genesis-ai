"use client";

import { useState } from "react";
import { Badge, Button, Spinner, Tabs } from "@/components/ui";
import { useOrganization } from "../context/OrganizationProvider";
import { OrganizationSettingsForm } from "./OrganizationSettingsForm";
import { MembersPanel } from "./MembersPanel";
import { PermissionMatrix } from "./PermissionMatrix";
import { ActivityFeed } from "./ActivityFeed";
import { CreateOrganizationModal } from "./CreateOrganizationModal";

export function OrganizationCenter() {
  const { activeOrg, isLoading } = useOrganization();
  const [createOpen, setCreateOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Spinner size="lg" label="Loading organization…" />
      </div>
    );
  }

  if (!activeOrg) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-14 h-14 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mb-4">
          <svg viewBox="0 0 24 24