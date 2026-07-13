'use client';

import { useQuery } from '@tanstack/react-query';

import { usersService } from '@/services/users.service';

export const usersKeys = {
  all: ['users'] as const,
  lists: () => [...usersKeys.all, 'list'] as const,
  details: (id: number) => [...usersKeys.all, 'details', id] as const,
};

export const useGetUserById = (id: number) => {
  return useQuery({
    queryKey: usersKeys.details(id),
    queryFn: () => usersService.getUserById(id),
    enabled: Number.isFinite(id) && id > 0,
    staleTime: 1000 * 60,
  });
};
