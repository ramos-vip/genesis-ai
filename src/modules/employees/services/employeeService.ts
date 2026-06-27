/**
 * Employee Service — Mock Implementation
 *
 * Implements the same interface the real service will use.
 * Persistence: localStorage (browser only).
 *
 * To replace with real API: create employeeService.api.ts implementing
 * the same exported shape and swap the import in hooks/useEmployees.ts.
 * Zero UI changes required.
 */

import type { Employee, CreateEmployeeDto, UpdateEmployeeDto } from "../types";
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
  } catch {
    // QuotaExceededError — fail silently in mock
  }
}

export const employeeService = {
  /** List all employees for the current organization */
  getAll(): Employee[] {
    return read();
  },

  /** Get a single employee by id */
  getById(id: string): Employee | null {
    return read().find((e) => e.id === toId(id)) ?? null;
  },

  /** Create a new employee */
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
      config: {
        toneOfVoice:     "professional",
        language:        "en",
        escalationRules: [],
      },
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

  /** Update an existing employee */
  update(id: string, dto: UpdateEmployeeDto): Employee {
    const employees = read();
    const idx = employees.findIndex((e) => e.id === toId(id));
    if (idx === -1) throw new Error(`Employee ${id} not found`);

    const updated: Employee = {
      ...employees[idx],
      ...dto,
      updatedAt: now() as Employee["updatedAt"],
    };
    employees[idx] = updated;
    write(employees);
    return updated;
  },

  /** Delete an employee */
  delete(id: string): void {
    write(read().filter((e) => e.id !== toId(id)));
  },
} as const;
