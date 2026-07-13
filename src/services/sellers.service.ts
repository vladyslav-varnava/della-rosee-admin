import { apiClient } from '@/lib/api';
import { Seller } from '@/types/seller';

const SELLERS_PATH = '/sellers';

export const sellersService = {
  getSellers: async () => {
    return apiClient.get<Seller[]>(SELLERS_PATH);
  },
};
