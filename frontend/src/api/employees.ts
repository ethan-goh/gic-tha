import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Employee, CreateEmployeeDto, UpdateEmployeeDto } from '../types';

const BASE = import.meta.env.VITE_API_BASE_URL;

const api = {
  getAll: (cafeId?: string) =>
    axios
      .get<Employee[]>(`${BASE}/employees`, { params: cafeId ? { cafe: cafeId } : {} })
      .then((r) => r.data),

  getById: (id: string) =>
    axios.get<Employee>(`${BASE}/employees/${id}`).then((r) => r.data),

  create: (dto: CreateEmployeeDto) =>
    axios.post<Employee>(`${BASE}/employees`, dto).then((r) => r.data),

  update: (id: string, dto: UpdateEmployeeDto) =>
    axios.put<Employee>(`${BASE}/employees/${id}`, dto).then((r) => r.data),

  remove: (id: string) => axios.delete(`${BASE}/employees/${id}`),
};

export const useEmployees = (cafeId?: string) =>
  useQuery({
    queryKey: ['employees', cafeId ?? ''],
    queryFn: () => api.getAll(cafeId),
  });

export const useEmployee = (id: string) =>
  useQuery({
    queryKey: ['employees', id],
    queryFn: () => api.getById(id),
    enabled: !!id,
  });

export const useCreateEmployee = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['employees'] }),
  });
};

export const useUpdateEmployee = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateEmployeeDto }) =>
      api.update(id, dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['employees'] }),
  });
};

export const useDeleteEmployee = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.remove,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['employees'] }),
  });
};
