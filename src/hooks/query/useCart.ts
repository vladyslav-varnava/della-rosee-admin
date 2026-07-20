'use client';

import { useQuery } from '@tanstack/react-query';

import { cartService } from '@/services/cart.service';

export const cartKeys = {
  all: ['cart'] as const,
  details: (cartId: string, userId: number) =>
    [...cartKeys.all, cartId, userId] as const,
};

export const useGetCartById = (cartId: string, userId: number) => {
  return useQuery({
    queryKey: cartKeys.details(cartId, userId),
    queryFn: () => cartService.getCartById(cartId, userId),
    enabled: Boolean(cartId) && Number.isFinite(userId) && userId > 0,
    refetchOnWindowFocus: true,
  });
};
