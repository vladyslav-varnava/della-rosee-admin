'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { toaster } from '@/components/ui/toaster';
import { productsKeys } from '@/hooks/query/useProductsAdmin';
import { productsService } from '@/services/products.service';
import { Product, UpdateProductPayload } from '@/types/product';

export const useUpdateProduct = (productId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateProductPayload) =>
      productsService.updateProduct(productId, payload),

    onError: () => {
      toaster.create({
        title: 'Не вдалося оновити продукт',
        description: 'Спробуйте ще раз або перевірте дані продукту.',
        type: 'error',
      });
    },

    onSuccess: async (updatedProduct) => {
      queryClient.setQueryData<Product>(
        productsKeys.details(updatedProduct.id),
        (oldProduct) => ({
          ...oldProduct,
          ...updatedProduct,
          items: updatedProduct.items ?? oldProduct?.items ?? [],
        }),
      );

      await queryClient.invalidateQueries({
        queryKey: productsKeys.adminLists(),
      });

      toaster.create({
        title: 'Продукт оновлено',
        type: 'success',
      });
    },
  });
};
