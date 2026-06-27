/**
 * Server-side barrel export.
 *
 * Only import from this path in Server Components, Server Actions, and Route Handlers.
 * Never import from "@/server" in Client Components — it will include server-only code in the bundle.
 */

export { getDb } from "./db";
export * from "./db/schema";
export { employeeRepository } from "./repositories/employeeRepository";
export {
  getEmployeesAction,
  getEmployeeByIdAction,
  createEmployeeAction,
  updateEmployeeAction,
  deleteEmployeeAction,
} from "./actions/employees";
