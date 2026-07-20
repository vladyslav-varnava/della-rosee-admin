'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { toaster } from '@/components/ui/toaster';
import { cartKeys } from '@/hooks/query/useCart';
import { AddItemToCartByIdPayload, cartService } from '@/services/cart.service';
import { Cart } from '@/types/cart';

type Params = {
  cartId: string;
  userId: number;
};

export const useAddItemToCartById = ({ cartId, userId }: Params) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AddItemToCartByIdPayload) =>
      cartService.addItemToCartById(payload),

    onError: (error) => {
      toaster.create({
        title: 'Не вдалося додати товар у кошик',
        description:
          error instanceof Error ? error.message : 'Спробуйте ще раз',
        type: 'error',
      });
    },

    onSuccess: async (cart: Cart) => {
      queryClient.setQueryData<Cart>(cartKeys.details(cartId, userId), cart);

      await queryClient.invalidateQueries({
        queryKey: cartKeys.details(cartId, userId),
      });

      toaster.create({
        title: 'Товар додано у кошик',
        type: 'success',
      });
    },
  });
};
