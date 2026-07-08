'use client';

import { useRouter } from 'next/navigation';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { toaster } from '@/components/ui/toaster';
import { productsKeys } from '@/hooks/query/useProductsAdmin';
import { productsService } from '@/services/products.service';

export const useDeleteProduct = (productId?: number) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      if (!productId) {
        throw new Error('Product ID is required');
      }

      return productsService.deleteProduct(productId);
    },

    onError: () => {
      toaster.create({
        title: 'Не вдалося видалити продукт',
        type: 'error',
      });
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: productsKeys.adminLists(),
      });

      toaster.create({
        title: 'Продукт видалено',
        type: 'success',
      });

      router.push('/products');
    },
  });
};
