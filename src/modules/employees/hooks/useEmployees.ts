"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/constants";
import { employeeService } from "../services/employeeService";
import type { CreateEmployeeDto, UpdateEmployeeDto } from "../types";

/** All employees — uses Server Action under the hood */
export function useEmployees() {
  return useQuery({
    queryKey: queryKeys.employees.list(),
    queryFn:  () => employeeService.getAll(),
    staleTime: 30_000, // 30s — avoids hammering the DB on every focus change
  });
}

/** Single employee by id */
export function useEmployee(id: string) {
  return useQuery({
    queryKey: queryKeys.employees.detail(id),
    queryFn:  () => employeeService.getById(id),
    enabled:  !!id,
    staleTime: 30_000,
  });
}

/** Create — invalidates all employee queries on success */
export function useCreateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateEmployeeDto) => employeeService.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.employees.all() });
    },
  });
}

/** Update — invalidates list and the specific detail query */
export function useUpdateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateEmployeeDto }) =>
      employeeService.update(id, dto),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.employees.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.employees.detail(id) });
    },
  });
}

/** Delete — invalidates all employee queries and removes the detail cache entry */
export function useDeleteEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => employeeService.delete(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.employees.all() });
      queryClient.removeQueries({ queryKey: queryKeys.employees.detail(id) });
    },
  });
}
