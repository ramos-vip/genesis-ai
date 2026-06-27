/**
 * Employee Service
 *
 * Single interface between the UI layer (TanStack Query hooks) and
 * the data layer (Server Actions → Repository → Drizzle → Neon).
 *
 * The hooks never import Server Actions or the repository directly.
 * Swapping the data layer means changing only this file.
 */

import {
  getEmployeesAction,
  getEmployeeByIdAction,
  createEmployeeAction,
  updateEmployeeAction,
  deleteEmployeeAction,
} from "@/server/actions/employees";
import type { Employee, CreateEmployeeDto, UpdateEmployeeDto } from "../types";

export const employeeService = {
  /** Fetch all employees for the authenticated user */
  getAll: (): Promise<Employee[]> =>
    getEmployeesAction(),

  /** Fetch a single employee by id (returns null if not found or not owned) */
  getById: (id: string): Promise<Employee | null> =>
    getEmployeeByIdAction(id),

  /** Create a new employee */
  create: (dto: CreateEmployeeDto): Promise<Employee> =>
    createEmployeeAction(dto),

  /** Partially update an employee */
  update: (id: string, dto: UpdateEmployeeDto): Promise<Employee> =>
    updateEmployeeAction(id, dto),

  /** Permanently delete an employee */
  delete: (id: string): Promise<void> =>
    deleteEmployeeAction(id),
} as const;
