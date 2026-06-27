"use client";

/**
 * Employee Service
 *
 * Explicit "use client" directive tells Turbopack to bundle this file
 * for the client and replace the Server Action imports with RPC stubs.
 * Without this directive, Turbopack has to infer the boundary from the
 * import chain, which can cause silent failures in some configurations.
 *
 * This file is the only layer that touches Server Actions.
 * Hooks call this service; they never import Server Actions directly.
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
  getAll:   (): Promise<Employee[]>           => getEmployeesAction(),
  getById:  (id: string): Promise<Employee | null> => getEmployeeByIdAction(id),
  create:   (dto: CreateEmployeeDto): Promise<Employee> => createEmployeeAction(dto),
  update:   (id: string, dto: UpdateEmployeeDto): Promise<Employee> => updateEmployeeAction(id, dto),
  delete:   (id: string): Promise<void>       => deleteEmployeeAction(id),
} as const;
