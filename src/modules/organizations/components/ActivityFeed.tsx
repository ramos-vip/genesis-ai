"use client";

import { Spinner } from "@/components/ui";
import { formatDate } from "@/shared/utils/format";
import { useActivityFeed } from "../hooks/useOrganizations";

export function ActivityFeed({ orgId }: { orgId: string }) {
  const { data = [], isLoading } = useActivityFeed(orgId);

  if (isLoading) {
    return (
      <div className="py-12 flex justify-center">
        <Spinner label="Loading activity…" />
      </div>
    );
  }

  if (data.length === 0) {
    return <p className="py-8 text-sm text-text-muted">No activity yet.</p>;
  }

  return (
    <ol className="relative border-l border-border ml-2 space-y-4">
      {data.map((item) => (
        <li key={item.id} className="ml-4">
          <span
            className="absolute -left-1.5 mt-1.5 w-3 h-3 rounded-full bg-accent border-2 border-background"
            aria-hidden
          />
          <p className="text-sm text-text-primary">{item.summary}</p>
          <p className="text-xs text-text-muted mt-0.5">
            <span className="capitalize">{item.category}</span> · {formatDate(item.createdAt, "relative")}
          </p>
        </li>
      ))}
    </ol>
  );
}
