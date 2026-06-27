"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/constants";
import { employeeService } from "../services/employeeService";
import type { CreateEmployeeDto, UpdateEmployeeDto } from "../types";

/** All employees list */
export function useEmployees() {
  return useQuery({
    queryKey:  queryKeys.employees.list(),
    queryFn:   () => employeeService.getAll(),
    staleTime: 0, // Always fresh — mock data can change from another tab
  });
}

/** Single employee */
export function useEmployee(id: string) {
  return useQuery({
    queryKey: queryKeys.employees.detail(id),
    queryFn:  () => employeeService.getById(id),
    enabled:  !!id,
  });
}

/** Create mutation — invalidates list on success */
export function useCreateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateEmployeeDto) => Promise.resolve(employeeService.create(dto)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.employees.all() });
    },
  });
}

/** Update mutation */
export function useUpdateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateEmployeeDto }) =>
      Promise.resolve(employeeService.update(id, dto)),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.employees.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.employees.detail(id) });
    },
  });
}

/** Delete mutation */
export function useDeleteEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => {
      employeeService.delete(id);
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.employees.all() });
    },
  });
}
