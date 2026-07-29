'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { toaster } from '@/components/ui/toaster';
import { promotionsKeys } from '@/hooks/query/usePromotionsAdmin';
import { promotionsService } from '@/services/promotions.service';
import { PromotionPayload, PromotionUpdatePayload } from '@/types/promotion';

type UpdatePromotionVariables = {
  id: string;
  payload: PromotionUpdatePayload;
};

export const useCreatePromotion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: PromotionPayload) =>
      promotionsService.createPromotion(payload),

    onError: () => {
      toaster.create({
        title: 'Не вдалося створити акцію',
        description: 'Перевірте поля форми та спробуйте ще раз.',
        type: 'error',
      });
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: promotionsKeys.all,
      });

      toaster.create({
        title: 'Акцію створено',
        type: 'success',
      });
    },
  });
};

export const useUpdatePromotion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: UpdatePromotionVariables) =>
      promotionsService.updatePromotion(id, payload),

    onError: () => {
      toaster.create({
        title: 'Не вдалося оновити акцію',
        type: 'error',
      });
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: promotionsKeys.all,
      });

      toaster.create({
        title: 'Акцію оновлено',
        type: 'success',
      });
    },
  });
};

export const useDeletePromotion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => promotionsService.deletePromotion(id),

    onError: () => {
      toaster.create({
        title: 'Не вдалося видалити акцію',
        type: 'error',
      });
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: promotionsKeys.all,
      });

      toaster.create({
        title: 'Акцію деактивовано',
        type: 'success',
      });
    },
  });
};
