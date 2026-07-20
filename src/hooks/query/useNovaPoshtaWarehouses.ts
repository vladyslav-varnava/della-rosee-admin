'use client';

import { useQuery } from '@tanstack/react-query';

import { novaPoshtaKeys } from '@/hooks/query/useNovaPoshtaSettlements';
import { novaPoshtaService } from '@/services/nova-poshta.service';

export const useNovaPoshtaWarehouses = ({
  settlementRef,
  typeOfWarehouseRef,
}: {
  settlementRef: string;
  typeOfWarehouseRef: string;
}) => {
  return useQuery({
    queryKey: novaPoshtaKeys.warehouses(settlementRef, typeOfWarehouseRef),
    queryFn: () =>
      novaPoshtaService.searchWarehouses({
        settlementRef,
        typeOfWarehouseRef,
      }),
    enabled: Boolean(settlementRef) && Boolean(typeOfWarehouseRef),
    staleTime: 1000 * 60 * 5,
  });
};
