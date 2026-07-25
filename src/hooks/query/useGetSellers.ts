'use client';

import { useQuery } from '@tanstack/react-query';

import { sellersService } from '@/services/sellers.service';
import { SellerStatsParams } from '@/types/seller';

export const sellersKeys = {
  all: ['sellers'] as const,
  lists: () => [...sellersKeys.all, 'list'] as const,
  stats: (params: SellerStatsParams) =>
    [...sellersKeys.all, 'stats', params] as const,
};

export const useGetSellers = () => {
  return useQuery({
    queryKey: sellersKeys.lists(),
    queryFn: sellersService.getSellers,
    staleTime: 1000 * 60 * 5,
  });
};

export const useGetSellerStats = (params: SellerStatsParams) => {
  return useQuery({
    queryKey: sellersKeys.stats(params),
    queryFn: () => sellersService.getSellerStats(params),
    placeholderData: (previousData) => previousData,
  });
};
