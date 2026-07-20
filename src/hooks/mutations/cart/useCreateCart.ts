'use client';

import { useMutation } from '@tanstack/react-query';

import { toaster } from '@/components/ui/toaster';
import { cartService } from '@/services/cart.service';

export const useCreateCart = () => {
  return useMutation({
    mutationFn: cartService.createCart,

    onError: (error) => {
      toaster.create({
        title: 'Не вдалося створити кошик',
        description:
          error instanceof Error ? error.message : 'Спробуйте ще раз',
        type: 'error',
      });
    },
  });
};
