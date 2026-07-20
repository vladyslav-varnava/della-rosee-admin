import { apiClient } from '@/lib/api';
import {
  NovaPoshtaSettlementsResponse,
  NovaPoshtaWarehouse,
} from '@/types/delivery';

export const novaPoshtaService = {
  searchSettlements: async (search: string) => {
    const params = new URLSearchParams({
      search,
    });

    const response = await fetch(`/api/nova-poshta/settlements?${params}`);

    if (!response.ok) {
      throw new Error('Could not load settlements');
    }

    return response.json() as Promise<NovaPoshtaSettlementsResponse>;
  },

  searchWarehouses: async ({
    settlementRef,
    typeOfWarehouseRef,
  }: {
    settlementRef: string;
    typeOfWarehouseRef: string;
  }) => {
    const params = new URLSearchParams({
      take: '20',
      settlementRef,
      typeOfWarehouseRef,
    });

    return apiClient.get<NovaPoshtaWarehouse[]>(
      `/nova-poshta/warehouses/search?${params.toString()}`,
    );
  },
};
