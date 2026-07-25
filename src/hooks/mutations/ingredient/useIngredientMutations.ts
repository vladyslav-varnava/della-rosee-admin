'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { toaster } from '@/components/ui/toaster';
import { ingredientsKeys } from '@/hooks/query/useGetIngredients';
import { ingredientsService } from '@/services/ingredients.service';
import { IngredientPayload } from '@/types/product';

type UpdateIngredientVariables = {
  id: number;
  payload: IngredientPayload;
};

export const useCreateIngredient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: IngredientPayload) =>
      ingredientsService.createIngredient(payload),

    onError: () => {
      toaster.create({
        title: 'Не вдалося створити інгредієнт',
        description: 'Перевірте назву та value.',
        type: 'error',
      });
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ingredientsKeys.all,
      });

      toaster.create({
        title: 'Інгредієнт створено',
        type: 'success',
      });
    },
  });
};

export const useUpdateIngredient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: UpdateIngredientVariables) =>
      ingredientsService.updateIngredient(id, payload),

    onError: () => {
      toaster.create({
        title: 'Не вдалося оновити інгредієнт',
        type: 'error',
      });
    },

    onSuccess: async (ingredient) => {
      queryClient.setQueryData(
        ingredientsKeys.details(ingredient.id),
        ingredient,
      );

      await queryClient.invalidateQueries({
        queryKey: ingredientsKeys.all,
      });

      toaster.create({
        title: 'Інгредієнт оновлено',
        type: 'success',
      });
    },
  });
};

export const useDeleteIngredient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => ingredientsService.deleteIngredient(id),

    onError: () => {
      toaster.create({
        title: 'Не вдалося видалити інгредієнт',
        type: 'error',
      });
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ingredientsKeys.all,
      });

      toaster.create({
        title: 'Інгредієнт видалено',
        type: 'success',
      });
    },
  });
};
