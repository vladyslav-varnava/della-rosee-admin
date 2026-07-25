import { apiClient } from '@/lib/api';
import {
  Seller,
  SellerPayload,
  SellerStats,
  SellerStatsParams,
  UpdateSellerPayload,
} from '@/types/seller';

const SELLERS_PATH = '/sellers';

export const sellersService = {
  getSellers: async () => {
    return apiClient.get<Seller[]>(SELLERS_PATH);
  },

  createSeller: async (payload: SellerPayload) => {
    return apiClient.post<Seller, SellerPayload>(SELLERS_PATH, payload);
  },

  updateSeller: async (id: number, payload: UpdateSellerPayload) => {
    return apiClient.put<Seller, UpdateSellerPayload>(
      `${SELLERS_PATH}/${id}`,
      payload,
    );
  },

  deleteSeller: async (id: number) => {
    return apiClient.delete<void>(`${SELLERS_PATH}/${id}`);
  },

  getSellerStats: async (params: SellerStatsParams) => {
    return apiClient.get<SellerStats[]>(`${SELLERS_PATH}/stats`, {
      params,
    });
  },
};
