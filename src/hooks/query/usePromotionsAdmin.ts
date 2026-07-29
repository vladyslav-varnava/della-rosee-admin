'use client';

import { useQuery } from '@tanstack/react-query';

import { promotionsService } from '@/services/promotions.service';
import { GetPromotionsParams } from '@/types/promotion';

export const promotionsKeys = {
  all: ['promotions'] as const,
  lists: () => [...promotionsKeys.all, 'list'] as const,
  list: (params: GetPromotionsParams) =>
    [...promotionsKeys.lists(), params] as const,
  details: (id: string) => [...promotionsKeys.all, 'details', id] as const,
};

export const usePromotionsAdmin = (params: GetPromotionsParams) => {
  return useQuery({
    queryKey: promotionsKeys.list(params),
    queryFn: () => promotionsService.getPromotions(params),
    placeholderData: (previousData) => previousData,
  });
};

export const useGetPromotion = (id: string) => {
  return useQuery({
    queryKey: promotionsKeys.details(id),
    queryFn: () => promotionsService.getPromotion(id),
    enabled: Boolean(id),
  });
};
