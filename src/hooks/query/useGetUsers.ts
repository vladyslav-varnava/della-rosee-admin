'use client';

import { useQuery } from '@tanstack/react-query';

import { usersService } from '@/services/users.service';
import { GetUsersParams } from '@/types/user';

export const usersKeys = {
  all: ['users'] as const,
  lists: () => [...usersKeys.all, 'list'] as const,
  list: (params: GetUsersParams) => [...usersKeys.lists(), params] as const,
};

export const useGetUsers = (params: GetUsersParams) => {
  return useQuery({
    queryKey: usersKeys.list(params),
    queryFn: () => usersService.getUsers(params),
    placeholderData: (previousData) => previousData,
    staleTime: 30 * 1000,
  });
};
