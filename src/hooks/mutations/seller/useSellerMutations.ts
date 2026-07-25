'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { toaster } from '@/components/ui/toaster';
import { sellersKeys } from '@/hooks/query/useGetSellers';
import { sellersService } from '@/services/sellers.service';
import { SellerPayload, UpdateSellerPayload } from '@/types/seller';

type UpdateSellerVariables = {
  id: number;
  payload: UpdateSellerPayload;
};

export const useCreateSeller = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SellerPayload) => sellersService.createSeller(payload),

    onError: () => {
      toaster.create({
        title: 'Не вдалося створити продавця',
        description: 'Перевірте поля та спробуйте ще раз.',
        type: 'error',
      });
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: sellersKeys.all,
      });

      toaster.create({
        title: 'Продавця створено',
        type: 'success',
      });
    },
  });
};

export const useUpdateSeller = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: UpdateSellerVariables) =>
      sellersService.updateSeller(id, payload),

    onError: () => {
      toaster.create({
        title: 'Не вдалося оновити продавця',
        type: 'error',
      });
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: sellersKeys.all,
      });

      toaster.create({
        title: 'Продавця оновлено',
        type: 'success',
      });
    },
  });
};

export const useDeleteSeller = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => sellersService.deleteSeller(id),

    onError: () => {
      toaster.create({
        title: 'Не вдалося видалити продавця',
        description: 'Можливо, до продавця привʼязані замовлення.',
        type: 'error',
      });
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: sellersKeys.all,
      });

      toaster.create({
        title: 'Продавця видалено',
        type: 'success',
      });
    },
  });
};
