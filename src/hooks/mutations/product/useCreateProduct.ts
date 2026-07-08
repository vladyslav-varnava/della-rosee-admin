'use client';

import { useRouter } from 'next/navigation';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { toaster } from '@/components/ui/toaster';
import { productsKeys } from '@/hooks/query/useProductsAdmin';
import { productsService } from '@/services/products.service';
import { CreateProductInput } from '@/types/product';

export const useCreateProduct = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateProductInput) =>
      productsService.createProduct(payload),

    onError: () => {
      toaster.create({
        title: 'Не вдалося створити продукт',
        description: 'Перевірте поля форми та спробуйте ще раз.',
        type: 'error',
      });
    },

    onSuccess: async (product) => {
      await queryClient.invalidateQueries({
        queryKey: productsKeys.adminLists(),
      });

      toaster.create({
        title: 'Продукт створено',
        type: 'success',
      });

      router.push(`/products/${product.id}/edit`);
    },
  });
};
