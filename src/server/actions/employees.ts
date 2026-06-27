"use server";

/**
 * Employee Server Actions
 *
 * Authentication: every action calls auth() first. Unauthenticated requests throw.
 * Authorization: every DB query includes clerkUserId — no cross-user data leakage.
 * Validation: Zod parses all inputs before touching the database.
 *
 * These functions are the only server-side entry points for employee data.
 */

import { auth } from "@clerk/nextjs/server";
import { employeeRepository } from "@/server/repositories/employeeRepository";
import {
  createEmployeeSchema,
  updateEmployeeSchema,
} from "@/server/validation/employee";
import type { Employee } from "@/modules/employees/types";
import type { CreateEmployeeDto, UpdateEmployeeDto } from "@/modules/employees/types";

/* ─── Auth helper ─────────────────────────────────────────────────────────── */

async function requireUserId(): Promise<string> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  return userId;
}

/* ─── Actions ─────────────────────────────────────────────────────────────── */

export async function getEmployeesAction(): Promise<Employee[]> {
  const userId = await requireUserId();
  return employeeRepository.findAll(userId);
}

export async function getEmployeeByIdAction(id: string): Promise<Employee | null> {
  const userId = await requireUserId();
  return employeeRepository.findById(userId, id);
}

export async function createEmployeeAction(dto: CreateEmployeeDto): Promise<Employee> {
  const userId = await requireUserId();

  const parsed = createEmployeeSchema.safeParse(dto);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid employee data");
  }

  return employeeRepository.create(userId, parsed.data);
}

export async function updateEmployeeAction(
  id:  string,
  dto: UpdateEmployeeDto
): Promise<Employee> {
  const userId = await requireUserId();

  const parsed = updateEmployeeSchema.safeParse(dto);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid update data");
  }

  return employeeRepository.update(userId, id, parsed.data);
}

export async function deleteEmployeeAction(id: string): Promise<void> {
  const userId = await requireUserId();
  return employeeRepository.delete(userId, id);
}
