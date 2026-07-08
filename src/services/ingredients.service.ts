import { apiClient } from '@/lib/api';
import { Ingredient } from '@/types/product';

export const ingredientsService = {
  getIngredients: async () => {
    return apiClient.get<Ingredient[]>('/ingredients');
  },
};
