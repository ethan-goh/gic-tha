import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Cafe, CreateCafeDto, UpdateCafeDto } from '../types';

const BASE = import.meta.env.VITE_API_BASE_URL;

const api = {
  getAll: (location?: string) =>
    axios
      .get<Cafe[]>(`${BASE}/cafes`, { params: location ? { location } : {} })
      .then((r) => r.data),

  getById: (id: string) =>
    axios.get<Cafe>(`${BASE}/cafes/${id}`).then((r) => r.data),

  create: (dto: CreateCafeDto) =>
    axios.post<Cafe>(`${BASE}/cafes`, dto).then((r) => r.data),

  update: (id: string, dto: UpdateCafeDto) =>
    axios.put<Cafe>(`${BASE}/cafes/${id}`, dto).then((r) => r.data),

  remove: (id: string) => axios.delete(`${BASE}/cafes/${id}`),
};

export const useCafes = (location?: string) =>
  useQuery({
    queryKey: ['cafes', location ?? ''],
    queryFn: () => api.getAll(location),
  });

export const useCafe = (id: string) =>
  useQuery({
    queryKey: ['cafes', id],
    queryFn: () => api.getById(id),
    enabled: !!id,
  });

export const useCreateCafe = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['cafes'] }),
  });
};

export const useUpdateCafe = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateCafeDto }) =>
      api.update(id, dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['cafes'] }),
  });
};

export const useDeleteCafe = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.remove,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['cafes'] }),
  });
};
