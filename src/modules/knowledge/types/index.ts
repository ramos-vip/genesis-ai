import type { ID, Timestamps } from "@/shared/types";

export type KnowledgeSourceType = "document" | "url" | "notion" | "confluence" | "custom";
export type KnowledgeStatus     = "processing" | "ready" | "error" | "outdated";

export interface KnowledgeSource extends Timestamps {
  id:             ID;
  name:           string;
  type:           KnowledgeSourceType;
  status:         KnowledgeStatus;
  organizationId: ID;
  /** Byte size of the source */
  size?:          number;
  url?:           string;
  /** Employee IDs that use this source */
  employeeIds:    ID[];
  metadata:       Record<string, string>;
  lastSyncedAt?:  string;
  chunkCount?:    number;
}

export type CreateKnowledgeSourceDto = Pick<KnowledgeSource, "name" | "type"> & {
  url?:  string;
  file?: File;
};
