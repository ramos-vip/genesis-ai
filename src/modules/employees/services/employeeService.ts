/**
 * Employee Service — Mock Implementation
 *
 * Implements the same interface the real service will use.
 * Persistence: localStorage (browser-only).
 *
 * To replace with real API: swap the import in hooks/useEmployees.ts.
 * No UI or hook changes required.
 */

import type {
  Employee,
  CreateEmployeeDto,
  UpdateEmployeeDto,
} from "../types";
import { DEFAULT_EMPLOYEE_CONFIG } from "../types";
import { toId } from "@/shared/types";

const STORAGE_KEY = "genesis:employees:v1";

function now() {
  return new Date().toISOString();
}

function generateId(): string {
  return `emp_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

function read(): Employee[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Employee[]) : [];
  } catch {
    return [];
  }
}

function write(employees: Employee[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
  } catch { /* QuotaExceededError — fail silently */ }
}

export const employeeService = {
  getAll(): Employee[] {
    return read();
  },

  getById(id: string): Employee | null {
    return read().find((e) => e.id === toId(id)) ?? null;
  },

  create(dto: CreateEmployeeDto): Employee {
    const employees = read();
    const timestamp = now();

    const employee: Employee = {
      id:             toId(generateId()),
      name:           dto.name.trim(),
      role:           dto.role,
      status:         "active",
      description:    dto.description.trim(),
      organizationId: toId("org_mock"),
      config:         { ...DEFAULT_EMPLOYEE_CONFIG },
      stats: {
        tasksCompleted:  0,
        tasksToday:      0,
        avgResponseTime: 0,
        successRate:     0,
      },
      knowledgeIds:   [],
      automationIds:  [],
      createdAt:      timestamp as Employee["createdAt"],
      updatedAt:      timestamp as Employee["updatedAt"],
    };

    write([employee, ...employees]);
    return employee;
  },

  update(id: string, dto: UpdateEmployeeDto): Employee {
    const employees = read();
    const idx = employees.findIndex((e) => e.id === toId(id));
    if (idx === -1) throw new Error(`Employee ${id} not found`);

    const existing = employees[idx];
    const updated: Employee = {
      ...existing,
      ...(dto.name        !== undefined && { name: dto.name }),
      ...(dto.role        !== undefined && { role: dto.role }),
      ...(dto.description !== undefined && { description: dto.description }),
      ...(dto.status      !== undefined && { status: dto.status }),
      /* Deep-merge config — only replace keys explicitly provided */
      config:    dto.config ? { ...existing.config, ...dto.config } : existing.config,
      updatedAt: now() as Employee["updatedAt"],
    };

    employees[idx] = updated;
    write(employees);
    return updated;
  },

  delete(id: string): void {
    write(read().filter((e) => e.id !== toId(id)));
  },
} as const;
