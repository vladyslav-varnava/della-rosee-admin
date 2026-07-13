'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { toaster } from '@/components/ui/toaster';
import { productsKeys } from '@/hooks/query/useProductsAdmin';
import { productVariantsService } from '@/services/product-variants.service';
import {
  CreateVariantFromSmartKasaPayload,
  Product,
  ProductVariant,
  ProductVariantPayload,
} from '@/types/product';

const upsertVariantInProduct = (
  product: Product | undefined,
  variant: ProductVariant,
) => {
  if (!product) return product;

  const currentItems = product.items ?? [];
  const exists = currentItems.some((item) => item.id === variant.id);

  return {
    ...product,
    items: exists
      ? currentItems.map((item) => (item.id === variant.id ? variant : item))
      : [...currentItems, variant],
  };
};

const removeVariantFromProduct = (
  product: Product | undefined,
  variantId: number,
) => {
  if (!product) return product;

  return {
    ...product,
    items: product.items?.filter((item) => item.id !== variantId) ?? [],
  };
};

export const useCreateVariantFromSmartKasa = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateVariantFromSmartKasaPayload) =>
      productVariantsService.createFromSmartKasa(payload),

    onError: (error) => {
      toaster.create({
        title:
          error instanceof Error
            ? error.message
            : 'Не вдалося створити варіант зі SmartKasa',
        type: 'error',
      });
    },

    onSuccess: async (variant) => {
      queryClient.setQueryData<Product>(
        productsKeys.details(variant.productId),
        (product) => upsertVariantInProduct(product, variant),
      );

      await queryClient.invalidateQueries({
        queryKey: productsKeys.adminLists(),
      });

      toaster.create({
        title: 'Варіант створено зі SmartKasa',
        type: 'success',
      });
    },
  });
};

export const useUpdateProductVariant = (
  variantId: number,
  productId: number,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ProductVariantPayload) =>
      productVariantsService.updateVariant(variantId, payload),

    onError: () => {
      toaster.create({
        title: 'Не вдалося оновити варіант',
        type: 'error',
      });
    },

    onSuccess: async (variant) => {
      queryClient.setQueryData<Product>(
        productsKeys.details(productId),
        (product) => upsertVariantInProduct(product, variant),
      );

      toaster.create({
        title: 'Варіант оновлено',
        type: 'success',
      });
    },
  });
};

export const useToggleProductVariantVisibility = (variant: ProductVariant) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      return variant.isVisible
        ? productVariantsService.deactivateVariant(variant.id)
        : productVariantsService.activateVariant(variant.id);
    },

    onError: () => {
      toaster.create({
        title: 'Не вдалося змінити статус варіанту',
        type: 'error',
      });
    },

    onSuccess: async (updatedVariant) => {
      queryClient.setQueryData<Product>(
        productsKeys.details(updatedVariant.productId),
        (product) => upsertVariantInProduct(product, updatedVariant),
      );

      toaster.create({
        title: updatedVariant.isVisible
          ? 'Варіант активовано'
          : 'Варіант деактивовано',
        type: 'success',
      });
    },
  });
};

export const useDeleteProductVariant = (
  variantId: number,
  productId: number,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => productVariantsService.deleteVariant(variantId),

    onError: () => {
      toaster.create({
        title: 'Не вдалося видалити варіант',
        type: 'error',
      });
    },

    onSuccess: async () => {
      queryClient.setQueryData<Product>(
        productsKeys.details(productId),
        (product) => removeVariantFromProduct(product, variantId),
      );

      await queryClient.invalidateQueries({
        queryKey: productsKeys.adminLists(),
      });

      toaster.create({
        title: 'Варіант видалено',
        type: 'success',
      });
    },
  });
};

export const useSyncSmartKasaStock = (variant: ProductVariant) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      productVariantsService.syncSmartKasaStock(variant.id, variant.cardId),

    onError: () => {
      toaster.create({
        title: 'Не вдалося синхронізувати залишки',
        type: 'error',
      });
    },

    onSuccess: async (updatedVariant) => {
      queryClient.setQueryData<Product>(
        productsKeys.details(updatedVariant.productId),
        (product) => upsertVariantInProduct(product, updatedVariant),
      );

      toaster.create({
        title: 'Залишки синхронізовано',
        type: 'success',
      });
    },
  });
};
