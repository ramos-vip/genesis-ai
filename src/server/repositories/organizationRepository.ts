/**
 * Organization Repository (EPIC-009)
 *
 * Security contract:
 * - User-facing reads join through organization_members and scope by clerkUserId,
 *   so a user can only ever see organizations they belong to.
 * - Writes are called only after the Server Action authorised the actor via the
 *   RBAC guard; they are additionally scoped by org id.
 */

import { and, desc, eq } from "drizzle-orm";
import { getDb, organizations, organizationMembers } from "../db";
import type { OrganizationRow } from "../db";
import { createId } from "../db/ids";
import { parseJson } from "../db/json";
import { toId } from "@/shared/types";
import type { ISODate } from "@/shared/types";
import { slugify } from "@/shared/utils/format";
import type {
  Organization,
  OrganizationPlan,
  OrganizationSettings,
  OrganizationStatus,
} from "@/modules/organizations/types";
import type {
  CreateOrganizationInput,
  UpdateOrganizationInput,
} from "../validation/organization";

function rowToOrganization(row: OrganizationRow): Organization {
  return {
    id:        toId(row.id),
    name:      row.name,
    slug:      row.slug,
    ownerId:   toId(row.ownerClerkUserId),
    plan:      row.plan as OrganizationPlan,
    status:    row.status as OrganizationStatus,
    settings:  parseJson<OrganizationSettings>(row.settings, {}),
    createdAt: row.createdAt.toISOString() as ISODate,
    updatedAt: row.updatedAt.toISOString() as ISODate,
  };
}

async function generateUniqueSlug(base: string): Promise<string> {
  const db = getDb();
  const root = slugify(base) || "workspace";
  let candidate = root;
  for (let attempt = 0; attempt < 5; attempt++) {
    const existing = await db
      .select({ id: organizations.id })
      .from(organizations)
      .where(eq(organizations.slug, candidate))
      .limit(1);
    if (existing.length === 0) return candidate;
    candidate = `${root}-${crypto.randomUUID().slice(0, 4)}`;
  }
  return `${root}-${Date.now().toString(36)}`;
}

export const organizationRepository = {
  /** Organizations the user is an active member of, newest first. */
  async findAllForUser(clerkUserId: string): Promise<Organization[]> {
    const db = getDb();
    const rows = await db
      .select({ org: organizations })
      .from(organizationMembers)
      .innerJoin(organizations, eq(organizationMembers.orgId, organizations.id))
      .where(
        and(
          eq(organizationMembers.clerkUserId, clerkUserId),
          eq(organizationMembers.status, "active")
        )
      )
      .orderBy(desc(organizations.createdAt));
    return rows.map((r) => rowToOrganization(r.org));
  },

  /** Membership-scoped read — returns null if the user is not a member. */
  async findById(clerkUserId: string, orgId: string): Promise<Organization | null> {
    const db = getDb();
    const rows = await db
      .select({ org: organizations })
      .from(organizationMembers)
      .innerJoin(organizations, eq(organizationMembers.orgId, organizations.id))
      .where(
        and(
          eq(organizationMembers.orgId, orgId),
          eq(organizationMembers.clerkUserId, clerkUserId)
        )
      )
      .limit(1);
    return rows.length > 0 ? rowToOrganization(rows[0].org) : null;
  },

  /** Unscoped read — only for callers that already authorised via the RBAC guard. */
  async findByIdUnsafe(orgId: string): Promise<Organization | null> {
    const db = getDb();
    const rows = await db.select().from(organizations).where(eq(organizations.id, orgId)).limit(1);
    return rows.length > 0 ? rowToOrganization(rows[0]) : null;
  },

  /** Create an organization and seat the creator as its owner. */
  async create(clerkUserId: string, dto: CreateOrganizationInput): Promise<Organization> {
    const db = getDb();
    const now = new Date();
    const id = createId("org");
    const slug = await generateUniqueSlug(dto.slug ?? dto.name);

    const orgRows = await db
      .insert(organizations)
      .values({
        id,
        name:             dto.name,
        slug,
        ownerClerkUserId: clerkUserId,
        plan:             "free",
        status:           "active",
        settings:         "{}",
        createdAt:        now,
        updatedAt:        now,
      })
      .returning();

    if (orgRows.length === 0) throw new Error("Failed to create organization");

    await db.insert(organizationMembers).values({
      id:          createId("mem"),
      orgId:       id,
      clerkUserId,
      role:        "owner",
      status:      "active",
      joinedAt:    now,
      createdAt:   now,
      updatedAt:   now,
    });

    return rowToOrganization(orgRows[0]);
  },

  /** Partial update; only provided fields are written. */
  async update(orgId: string, dto: UpdateOrganizationInput): Promise<Organization> {
    const db = getDb();
    const payload: Partial<typeof organizations.$inferInsert> = {};

    if (dto.name !== undefined) payload.name = dto.name;
    if (dto.plan !== undefined) payload.plan = dto.plan;
    if (dto.status !== undefined) payload.status = dto.status;
    if (dto.settings !== undefined) payload.settings = JSON.stringify(dto.settings);

    if (Object.keys(payload).length === 0) {
      const existing = await organizationRepository.findByIdUnsafe(orgId);
      if (!existing) throw new Error("Organization not found");
      return existing;
    }

    const rows = await db
      .update(organizations)
      .set(payload)
      .where(eq(organizations.id, orgId))
      .returning();

    if (rows.length === 0) throw new Error("Organization not found");
    return rowToOrganization(rows[0]);
  },
};
