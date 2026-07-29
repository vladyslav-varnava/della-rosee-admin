import { apiClient } from '@/lib/api';
import {
  GetPromotionsParams,
  Promotion,
  PromotionPayload,
  PromotionUpdatePayload,
} from '@/types/promotion';

const PROMOTIONS_PATH = '/promotions';

export const promotionsService = {
  getPromotions: async (params: GetPromotionsParams = {}) => {
    return apiClient.get<Promotion[]>(PROMOTIONS_PATH, {
      params,
    });
  },

  getPromotion: async (id: string) => {
    return apiClient.get<Promotion>(`${PROMOTIONS_PATH}/${id}`);
  },

  createPromotion: async (payload: PromotionPayload) => {
    return apiClient.post<Promotion, PromotionPayload>(
      PROMOTIONS_PATH,
      payload,
    );
  },

  updatePromotion: async (id: string, payload: PromotionUpdatePayload) => {
    return apiClient.put<Promotion, PromotionUpdatePayload>(
      `${PROMOTIONS_PATH}/${id}`,
      payload,
    );
  },

  deletePromotion: async (id: string) => {
    return apiClient.delete<Promotion>(`${PROMOTIONS_PATH}/${id}`);
  },
};
