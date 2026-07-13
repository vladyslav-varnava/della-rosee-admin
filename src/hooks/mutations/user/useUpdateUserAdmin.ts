'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { toaster } from '@/components/ui/toaster';
import { usersKeys } from '@/hooks/query/useUsers';
import { usersService } from '@/services/users.service';
import { UpdateUserAdminPayload, User } from '@/types/user';

type Payload = {
  userId: number;
  data: UpdateUserAdminPayload;
};

export const useUpdateUserAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, data }: Payload) =>
      usersService.updateUserAdmin(userId, data),

    onError: () => {
      toaster.create({
        title: 'Не вдалося оновити користувача',
        type: 'error',
      });
    },

    onSuccess: async (updatedUser: User) => {
      queryClient.setQueryData<User>(
        usersKeys.details(updatedUser.id),
        updatedUser,
      );

      await queryClient.invalidateQueries({
        queryKey: usersKeys.lists(),
      });

      toaster.create({
        title: 'Користувача оновлено',
        type: 'success',
      });
    },
  });
};
