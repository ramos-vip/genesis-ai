"use client";

import { useMemo, useState } from "react";
import Link   from "next/link";
import { useToast }         from "@/shared/providers";
import { useCreateEmployee, useUpdateEmployee } from "@/modules/employees/hooks/useEmployees";
import { ROUTES }           from "@/shared/constants";
import { TEMPLATES }        from "../data/templates";
import { CATEGORY_LABELS }  from "../types";
import type { MarketplaceTemplate, TemplateCategory } from "../types";
import TemplateCard         from "./TemplateCard";
import TemplateModal        from "./TemplateModal";

type CategoryFilter = TemplateCategory | "all";
type SortOption     = "featured" | "most_installed" | "new" | "a_z";

const CATEGORIES: { id: CategoryFilter; label: string }[] = [
  { id: "all",              label: "All" },
  { id: "customer_support", label: "Support" },
  { id: "sales",            label: "Sales" },
  { id: "marketing",        label: "Marketing" },
  { id: "hr",               label: "HR" },
  { id: "operations",       label: "Operations" },
  { id: "finance",          label: "Finance" },
  { id: "hospitality",      label: "Hospitality" },
  { id: "ecommerce",        label: "E-commerce" },
  { id: "healthcare",       label: "Healthcare" },
  { id: "education",        label: "Education" },
];

export default function MarketplaceContent() {
  const { toast } = useToast();
  const { mutateAsync: createEmployee }  = useCreateEmployee();
  const { mutateAsync: updateEmployee }  = useUpdateEmployee();

  const [search,           setSearch]           = useState("");
  const [category,         setCategory]         = useState<CategoryFilter>("all");
  const [sort,             setSort]             = useState<SortOption>("featured");
  const [selectedTemplate, setSelectedTemplate] = useState<MarketplaceTemplate | null>(null);
  const [installedIds,     setInstalledIds]     = useState<Set<string>>(new Set());
  const [installingIds,    setInstallingIds]    = useState<Set<string>>(new Set());

  /* ─── Filter + sort ──────────────────────────────────────────────────── */
  const displayed = useMemo(() => {
    let list = [...TEMPLATES];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.toLowerCase().includes(q)) ||
          CATEGORY_LABELS[t.category].toLowerCase().includes(q)
      );
    }

    if (category !== "all") {
      list = list.filter((t) => t.category === category);
    }

    switch (sort) {
      case "featured":
        list = [...list.filter((t) => t.featured), ...list.filter((t) => !t.featured)];
        break;
      case "most_installed":
        list = [...list].sort((a, b) => b.installCount - a.installCount);
        break;
      case "new":
        list = [...list.filter((t) => t.isNew), ...list.filter((t) => !t.isNew)];
        break;
      case "a_z":
        list = [...list].sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return list;
  }, [search, category, sort]);

  /* ─── Install ────────────────────────────────────────────────────────── */
  async function handleInstall(template: MarketplaceTemplate) {
    if (installedIds.has(template.id) || installingIds.has(template.id)) return;

    setInstallingIds((prev) => new Set(prev).add(template.id));
    try {
      const employee = await createEmployee({
        name:             template.name,
        role:             template.role,
        description:      template.description,
        knowledgeSources: [],
      });

      await updateEmployee({
        id: employee.id,
        dto: {
          config: {
            systemInstructions: template.defaultPrompt,
            temperature:        template.temperature,
            toneOfVoice:        "professional",
          },
        },
      });

      setInstalledIds((prev) => new Set(prev).add(template.id));
      toast.success(`${template.name} installed!`, "View your new AI employee in the dashboard.");
    } catch (err) {
      toast.error("Installation failed", err instanceof Error ? err.message : "Please try again.");
    } finally {
      setInstallingIds((prev) => {
        const next = new Set(prev);
        next.delete(template.id);
        return next;
      });
    }
  }

  return (
    <>
      {/* ── Filters ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 mb-8">
        {/* Search + Sort */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <svg
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none"
              aria-hidden
            >
              <circle cx="7" cy="7" r="4.5"/><path d="M10.5 10.5L13.5 13.5" strokeLinecap="round"/>
            </svg>
            <input
              type="search"
              placeholder="Search templates, roles, or tags…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-xl border border-border bg-surface-elevated text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-border-focus focus:ring-2 focus:ring-accent/20 transition-all"
              aria-label="Search templates"
            />
          </div>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="h-10 px-4 pr-9 rounded-xl border border-border bg-surface-elevated text-sm text-text-primary outline-none appearance-none cursor-pointer focus:border-border-focus focus:ring-2 focus:ring-accent/20 transition-all"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 12 12'%3E%3Cpath d='M2 4l4 4 4-4' stroke='%2371717a' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center", backgroundSize: "12px" }}
            aria-label="Sort by"
          >
            <option value="featured">⭐ Featured</option>
            <option value="most_installed">🔥 Most Installed</option>
            <option value="new">🆕 New</option>
            <option value="a_z">🔤 A–Z</option>
          </select>
        </div>

        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none" role="tablist" aria-label="Filter by category">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              role="tab"
              aria-selected={category === cat.id}
              onClick={() => setCategory(cat.id)}
              className={[
                "shrink-0 px-4 py-2 rounded-xl text-xs font-semibold transition-all border",
                category === cat.id
                  ? "bg-accent text-white border-accent shadow-[0_0_12px_rgba(124,58,237,0.25)]"
                  : "border-border bg-surface-elevated text-text-muted hover:text-text-primary hover:border-border-hover",
              ].join(" ")}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="text-xs text-text-muted" aria-live="polite">
          {displayed.length} template{displayed.length !== 1 ? "s" : ""} found
          {installedIds.size > 0 && (
            <> · <Link href={ROUTES.APP.EMPLOYEES.ROOT} className="text-accent hover:text-violet-400 transition-colors">{installedIds.size} installed →</Link></>
          )}
        </p>
      </div>

      {/* ── Grid ────────────────────────────────────────────────────────── */}
      {displayed.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl border border-dashed border-border">
          <p className="text-sm font-medium text-text-secondary mb-1">No templates found</p>
          <p className="text-xs text-text-muted">Try a different search or category.</p>
          <button onClick={() => { setSearch(""); setCategory("all"); }} className="mt-4 text-xs text-accent hover:text-violet-400 transition-colors">
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {displayed.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              isInstalled={installedIds.has(template.id)}
              isInstalling={installingIds.has(template.id)}
              onInstall={() => handleInstall(template)}
              onDetails={() => setSelectedTemplate(template)}
            />
          ))}
        </div>
      )}

      {/* ── Detail Modal ─────────────────────────────────────────────────── */}
      <TemplateModal
        template={selectedTemplate}
        isInstalled={selectedTemplate ? installedIds.has(selectedTemplate.id) : false}
        isInstalling={selectedTemplate ? installingIds.has(selectedTemplate.id) : false}
        onInstall={() => selectedTemplate && handleInstall(selectedTemplate)}
        onClose={() => setSelectedTemplate(null)}
      />
    </>
  );
}
