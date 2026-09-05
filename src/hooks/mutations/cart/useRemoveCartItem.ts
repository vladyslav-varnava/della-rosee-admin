'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { toaster } from '@/components/ui/toaster';
import { cartKeys } from '@/hooks/query/useCart';
import { cartService } from '@/services/cart.service';

type Params = {
  cartId: string;
  userId: number;
};

export const useRemoveCartItem = ({ cartId, userId }: Params) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (cartItemId: string) => cartService.removeCartItem(cartItemId),

    onError: (error) => {
      toaster.create({
        title: 'Не вдалося видалити товар',
        description:
          error instanceof Error ? error.message : 'Спробуйте ще раз',
        type: 'error',
      });
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: cartKeys.details(cartId, userId),
      });

      toaster.create({
        title: 'Товар видалено з кошика',
        type: 'success',
      });
    },
  });
};
