import { apiClient } from '@/lib/api';
import { GetPromotionsParams, Promotion } from '@/types/promotion';

const PROMOTIONS_PATH = '/promotions';

export const promotionsService = {
  getPromotions: async (params: GetPromotionsParams = {}) => {
    return apiClient.get<Promotion[]>(PROMOTIONS_PATH, {
      params,
    });
  },
};
