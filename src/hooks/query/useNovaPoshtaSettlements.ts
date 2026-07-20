'use client';

import { useQuery } from '@tanstack/react-query';

import { novaPoshtaService } from '@/services/nova-poshta.service';

export const novaPoshtaKeys = {
  all: ['nova-poshta'] as const,
  settlements: (search: string) =>
    [...novaPoshtaKeys.all, 'settlements', search] as const,
  warehouses: (settlementRef: string, typeOfWarehouseRef: string) =>
    [
      ...novaPoshtaKeys.all,
      'warehouses',
      settlementRef,
      typeOfWarehouseRef,
    ] as const,
};

export const useNovaPoshtaSettlements = (search: string) => {
  return useQuery({
    queryKey: novaPoshtaKeys.settlements(search),
    queryFn: () => novaPoshtaService.searchSettlements(search),
    enabled: search.trim().length >= 2,
    staleTime: 1000 * 60 * 5,
  });
};
