'use client';

import { useQuery } from '@tanstack/react-query';

import { sellersService } from '@/services/sellers.service';

export const sellersKeys = {
  all: ['sellers'] as const,
};

export const useGetSellers = () => {
  return useQuery({
    queryKey: sellersKeys.all,
    queryFn: sellersService.getSellers,
    staleTime: 1000 * 60 * 5,
  });
};
