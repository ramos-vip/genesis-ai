import {
  index,
  integer,
  pgTable,
  primaryKey,
  real,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

/* ─── Employees ───────────────────────────────────────────────────────────── */

export const employees = pgTable(
  "employees",
  {
    id:          text("id").primaryKey(),
    clerkUserId: text("clerk_user_id").notNull(),
    name:        text("name").notNull(),
    role:        text("role").notNull(),
    description: text("description").notNull().default(""),
    status:      text("status").notNull().default("active"),
    systemInstructions: text("system_instructions").notNull().default(""),
    toneOfVoice:        text("tone_of_voice").notNull().default("professional"),
    temperature:        real("temperature").notNull().default(0.5),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdateFn(() => new Date()),
  },
  (table) => [
    index("employees_clerk_user_id_idx").on(table.clerkUserId),
    index("employees_status_idx").on(table.clerkUserId, table.status),
  ]
);

/* ─── Knowledge Sources ───────────────────────────────────────────────────── */

export const knowledgeSources = pgTable(
  "knowledge_sources",
  {
    id:          text("id").primaryKey(),
    clerkUserId: text("clerk_user_id").notNull(),
    name:        text("name").notNull(),
    type:        text("type").notNull(),
    status:      text("status").notNull().default("ready"),
    meta:        text("meta").notNull().default("{}"),
    chunkCount:  integer("chunk_count"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdateFn(() => new Date()),
  },
  (table) => [
    index("knowledge_sources_clerk_user_id_idx").on(table.clerkUserId),
    index("knowledge_sources_type_idx").on(table.clerkUserId, table.type),
  ]
);

/* ─── Knowledge Chunks ────────────────────────────────────────────────────── */

export const knowledgeChunks = pgTable(
  "knowledge_chunks",
  {
    id:                text("id").primaryKey(),
    knowledgeSourceId: text("knowledge_source_id").notNull(),
    chunkIndex:        integer("chunk_index").notNull(),
    content:           text("content").notNull(),
    tokenCount:        integer("token_count").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("chunks_source_idx").on(table.knowledgeSourceId),
    index("chunks_source_order_idx").on(table.knowledgeSourceId, table.chunkIndex),
  ]
);

/* ─── Knowledge Embeddings ────────────────────────────────────────────────── */

export const knowledgeEmbeddings = pgTable(
  "knowledge_embeddings",
  {
    chunkId:    text("chunk_id").primaryKey(),
    embedding:  text("embedding").notNull(),
    model:      text("model").notNull(),
    dimensions: integer("dimensions").notNull(),
    createdAt:  timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("embeddings_chunk_idx").on(table.chunkId),
  ]
);

/* ─── Employee ↔ Knowledge Sources (many-to-many) ─────────────────────────── */

export const employeeKnowledgeSources = pgTable(
  "employee_knowledge_sources",
  {
    employeeId:        text("employee_id").notNull(),
    knowledgeSourceId: text("knowledge_source_id").notNull(),
    clerkUserId:       text("clerk_user_id").notNull(),
    linkedAt: timestamp("linked_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.employeeId, table.knowledgeSourceId] }),
    index("eks_employee_idx").on(table.employeeId),
    index("eks_source_idx").on(table.knowledgeSourceId),
  ]
);

/* ─── Conversations ───────────────────────────────────────────────────────── */

export const conversations = pgTable(
  "conversations",
  {
    id:          text("id").primaryKey(),
    clerkUserId: text("clerk_user_id").notNull(),
    employeeId:  text("employee_id").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdateFn(() => new Date()),
  },
  (table) => [
    uniqueIndex("conversations_user_employee_unique").on(table.clerkUserId, table.employeeId),
    index("conversations_employee_idx").on(table.employeeId),
  ]
);

export const conversationMessages = pgTable(
  "conversation_messages",
  {
    id:             text("id").primaryKey(),
    conversationId: text("conversation_id").notNull(),
    role:           text("role").notNull(),
    content:        text("content").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("messages_conversation_idx").on(table.conversationId),
  ]
);

/* ─── Type inference ──────────────────────────────────────────────────────── */

export type EmployeeRow              = typeof employees.$inferSelect;
export type NewEmployeeRow           = typeof employees.$inferInsert;
export type KnowledgeSourceRow       = typeof knowledgeSources.$inferSelect;
export type NewKnowledgeSourceRow    = typeof knowledgeSources.$inferInsert;
export type KnowledgeChunkRow        = typeof knowledgeChunks.$inferSelect;
export type KnowledgeEmbeddingRow    = typeof knowledgeEmbeddings.$inferSelect;
export type EmployeeKnowledgeRow     = typeof employeeKnowledgeSources.$inferSelect;
export type ConversationRow          = typeof conversations.$inferSelect;
export type ConversationMessageRow   = typeof conversationMessages.$inferSelect;

/* ═══════════════════════════════════════════════════════════════════════════
   EPIC 009 — Enterprise Platform (Organizations / Teams / RBAC / Audit)
   Additive only. No existing table above is modified. Backwards compatible.
   ═══════════════════════════════════════════════════════════════════════════ */

/* ─── Organizations ───────────────────────────────────────────────────────── */

export const organizations = pgTable(
  "organizations",
  {
    id:               text("id").primaryKey(),
    name:             text("name").notNull(),
    slug:             text("slug").notNull(),
    ownerClerkUserId: text("owner_clerk_user_id").notNull(),
    plan:             text("plan").notNull().default("free"),
    status:           text("status").notNull().default("active"),
    settings:         text("settings").notNull().default("{}"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdateFn(() => new Date()),
  },
  (table) => [
    uniqueIndex("organizations_slug_unique").on(table.slug),
    index("organizations_owner_idx").on(table.ownerClerkUserId),
  ]
);

/* ─── Departments ─────────────────────────────────────────────────────────── */

export const departments = pgTable(
  "departments",
  {
    id:     text("id").primaryKey(),
    orgId:  text("org_id").notNull(),
    name:   text("name").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdateFn(() => new Date()),
  },
  (table) => [
    index("departments_org_idx").on(table.orgId),
    uniqueIndex("departments_org_name_unique").on(table.orgId, table.name),
  ]
);

/* ─── Custom Roles ────────────────────────────────────────────────────────── */

export const customRoles = pgTable(
  "custom_roles",
  {
    id:          text("id").primaryKey(),
    orgId:       text("org_id").notNull(),
    name:        text("name").notNull(),
    description: text("description").notNull().default(""),
    permissions: text("permissions").notNull().default("[]"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdateFn(() => new Date()),
  },
  (table) => [
    index("custom_roles_org_idx").on(table.orgId),
    uniqueIndex("custom_roles_org_name_unique").on(table.orgId, table.name),
  ]
);

/* ─── Organization Members ────────────────────────────────────────────────── */

export const organizationMembers = pgTable(
  "organization_members",
  {
    id:           text("id").primaryKey(),
    orgId:        text("org_id").notNull(),
    clerkUserId:  text("clerk_user_id").notNull(),
    role:         text("role").notNull().default("member"),
    customRoleId: text("custom_role_id"),
    departmentId: text("department_id"),
    status:       text("status").notNull().default("active"),
    title:        text("title"),
    joinedAt: timestamp("joined_at", { withTimezone: true }).notNull().defaultNow(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdateFn(() => new Date()),
  },
  (table) => [
    uniqueIndex("org_members_org_user_unique").on(table.orgId, table.clerkUserId),
    index("org_members_org_idx").on(table.orgId),
    index("org_members_status_idx").on(table.orgId, table.status),
    index("org_members_department_idx").on(table.departmentId),
  ]
);

/* ─── Teams ───────────────────────────────────────────────────────────────── */

export const teams = pgTable(
  "teams",
  {
    id:          text("id").primaryKey(),
    orgId:       text("org_id").notNull(),
    name:        text("name").notNull(),
    description: text("description").notNull().default(""),
    status:      text("status").notNull().default("active"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdateFn(() => new Date()),
  },
  (table) => [
    index("teams_org_idx").on(table.orgId),
    index("teams_status_idx").on(table.orgId, table.status),
  ]
);

export const teamMembers = pgTable(
  "team_members",
  {
    teamId:   text("team_id").notNull(),
    memberId: text("member_id").notNull(),
    assignedAt: timestamp("assigned_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.teamId, table.memberId] }),
    index("team_members_team_idx").on(table.teamId),
    index("team_members_member_idx").on(table.memberId),
  ]
);

export const teamEmployees = pgTable(
  "team_employees",
  {
    teamId:     text("team_id").notNull(),
    employeeId: text("employee_id").notNull(),
    assignedAt: timestamp("assigned_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.teamId, table.employeeId] }),
    index("team_employees_team_idx").on(table.teamId),
    index("team_employees_employee_idx").on(table.employeeId),
  ]
);

export const teamKnowledgeSources = pgTable(
  "team_knowledge_sources",
  {
    teamId:            text("team_id").notNull(),
    knowledgeSourceId: text("knowledge_source_id").notNull(),
    assignedAt: timestamp("assigned_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.teamId, table.knowledgeSourceId] }),
    index("team_knowledge_team_idx").on(table.teamId),
    index("team_knowledge_source_idx").on(table.knowledgeSourceId),
  ]
);

export const teamWorkflows = pgTable(
  "team_workflows",
  {
    teamId:     text("team_id").notNull(),
    workflowId: text("workflow_id").notNull(),
    assignedAt: timestamp("assigned_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.teamId, table.workflowId] }),
    index("team_workflows_team_idx").on(table.teamId),
    index("team_workflows_workflow_idx").on(table.workflowId),
  ]
);

/* ─── Invitations ─────────────────────────────────────────────────────────── */

export const invitations = pgTable(
  "invitations",
  {
    id:                   text("id").primaryKey(),
    orgId:                text("org_id").notNull(),
    email:                text("email").notNull(),
    role:                 text("role").notNull().default("member"),
    customRoleId:         text("custom_role_id"),
    token:                text("token").notNull(),
    status:               text("status").notNull().default("pending"),
    invitedByClerkUserId: text("invited_by_clerk_user_id").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdateFn(() => new Date()),
  },
  (table) => [
    uniqueIndex("invitations_token_unique").on(table.token),
    index("invitations_org_idx").on(table.orgId),
    index("invitations_org_email_idx").on(table.orgId, table.email),
    index("invitations_status_idx").on(table.orgId, table.status),
  ]
);

/* ─── Audit Logs (who / what / when / before / after) ─────────────────────── */

export const auditLogs = pgTable(
  "audit_logs",
  {
    id:               text("id").primaryKey(),
    orgId:            text("org_id").notNull(),
    actorClerkUserId: text("actor_clerk_user_id").notNull(),
    action:           text("action").notNull(),
    resource:         text("resource").notNull(),
    resourceId:       text("resource_id"),
    before:           text("before"),
    after:            text("after"),
    ip:               text("ip"),
    userAgent:        text("user_agent"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("audit_logs_org_idx").on(table.orgId),
    index("audit_logs_org_resource_idx").on(table.orgId, table.resource),
    index("audit_logs_org_actor_idx").on(table.orgId, table.actorClerkUserId),
    index("audit_logs_created_idx").on(table.orgId, table.createdAt),
  ]
);

/* ─── Activity Logs (human-readable feed) ─────────────────────────────────── */

export const activityLogs = pgTable(
  "activity_logs",
  {
    id:               text("id").primaryKey(),
    orgId:            text("org_id").notNull(),
    actorClerkUserId: text("actor_clerk_user_id").notNull(),
    category:         text("category").notNull(),
    verb:             text("verb").notNull(),
    targetType:       text("target_type"),
    targetId:         text("target_id"),
    summary:          text("summary").notNull(),
    metadata:         text("metadata").notNull().default("{}"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("activity_logs_org_idx").on(table.orgId),
    index("activity_logs_org_category_idx").on(table.orgId, table.category),
    index("activity_logs_created_idx").on(table.orgId, table.createdAt),
  ]
);

/* ─── Type inference (EPIC 009) ───────────────────────────────────────────── */

export type OrganizationRow          = typeof organizations.$inferSelect;
export type NewOrganizationRow       = typeof organizations.$inferInsert;
export type DepartmentRow            = typeof departments.$inferSelect;
export type NewDepartmentRow         = typeof departments.$inferInsert;
export type CustomRoleRow            = typeof customRoles.$inferSelect;
export type NewCustomRoleRow         = typeof customRoles.$inferInsert;
export type OrganizationMemberRow    = typeof organizationMembers.$inferSelect;
export type NewOrganizationMemberRow = typeof organizationMembers.$inferInsert;
export type TeamRow                  = typeof teams.$inferSelect;
export type NewTeamRow               = typeof teams.$inferInsert;
export type TeamMemberRow            = typeof teamMembers.$inferSelect;
export type TeamEmployeeRow          = typeof teamEmployees.$inferSelect;
export type TeamKnowledgeRow         = typeof teamKnowledgeSources.$inferSelect;
export type TeamWorkflowRow          = typeof teamWorkflows.$inferSelect;
export type InvitationRow            = typeof invitations.$inferSelect;
export type NewInvitationRow         = typeof invitations.$inferInsert;
export type AuditLogRow              = typeof auditLogs.$inferSelect;
export type NewAuditLogRow           = typeof auditLogs.$inferInsert;
export type ActivityLogRow           = typeof activityLogs.$inferSelect;
export type NewActivityLogRow        = typeof activityLogs.$inferInsert;
