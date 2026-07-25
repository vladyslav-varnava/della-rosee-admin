import { apiClient } from '@/lib/api';
import { Ingredient, IngredientPayload } from '@/types/product';

export const ingredientsService = {
  getIngredients: async () => {
    return apiClient.get<Ingredient[]>('/ingredients');
  },

  getIngredient: async (id: number) => {
    return apiClient.get<Ingredient>(`/ingredients/${id}`);
  },

  createIngredient: async (payload: IngredientPayload) => {
    return apiClient.post<Ingredient, IngredientPayload>(
      '/ingredients',
      payload,
    );
  },

  updateIngredient: async (id: number, payload: IngredientPayload) => {
    return apiClient.put<Ingredient, IngredientPayload>(
      `/ingredients/${id}`,
      payload,
    );
  },

  deleteIngredient: async (id: number) => {
    return apiClient.delete<void>(`/ingredients/${id}`);
  },
};
