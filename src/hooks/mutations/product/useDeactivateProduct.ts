'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { toaster } from '@/components/ui/toaster';
import { productsKeys } from '@/hooks/query/useProductsAdmin';
import { productsService } from '@/services/products.service';

export const useDeactivateProduct = (productId?: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      if (!productId) {
        throw new Error('Product ID is required');
      }

      return productsService.deactivateProduct(productId);
    },

    onError: () => {
      toaster.create({
        title: 'Продукт не деактивовано',
        type: 'error',
      });
    },

    onSuccess: async (product) => {
      await queryClient.invalidateQueries({
        queryKey: productsKeys.all,
      });

      queryClient.setQueryData(productsKeys.details(product.id), product);

      toaster.create({
        title: 'Продукт деактивовано',
        type: 'success',
      });
    },
  });
};
