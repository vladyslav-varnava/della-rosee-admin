'use client';

import { useQuery } from '@tanstack/react-query';

import { ingredientsService } from '@/services/ingredients.service';

export const ingredientsKeys = {
  all: ['ingredients'] as const,
  details: (id: number) => [...ingredientsKeys.all, 'details', id] as const,
};

export const useGetIngredients = () => {
  return useQuery({
    queryKey: ingredientsKeys.all,
    queryFn: ingredientsService.getIngredients,
    staleTime: 1000 * 60 * 5,
  });
};
