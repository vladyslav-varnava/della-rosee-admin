'use client';

import { useQuery } from '@tanstack/react-query';

import { productVariantsService } from '@/services/product-variants.service';
import { productsService } from '@/services/products.service';
import { GetProductsAdminParams } from '@/types/product';

export const productsKeys = {
  all: ['products'] as const,
  adminLists: () => [...productsKeys.all, 'admin-list'] as const,
  adminList: (params: GetProductsAdminParams) =>
    [...productsKeys.adminLists(), params] as const,
  details: (id: number) => [...productsKeys.all, 'details', id] as const,
};

export const productVariantsKeys = {
  all: ['product-variants'] as const,
  details: (id: number) => [...productVariantsKeys.all, 'details', id] as const,
};

export const useProductsAdmin = (params: GetProductsAdminParams) => {
  return useQuery({
    queryKey: productsKeys.adminList(params),
    queryFn: () => productsService.getAdminProducts(params),
    placeholderData: (previousData) => previousData,
  });
};

export const useGetProduct = (id: number) => {
  return useQuery({
    queryKey: productsKeys.details(id),
    queryFn: () => productsService.getProduct(id),
    enabled: Number.isFinite(id) && id > 0,
  });
};

export const useGetProductVariant = (id: number) => {
  return useQuery({
    queryKey: productVariantsKeys.details(id),
    queryFn: () => productVariantsService.getVariant(id),
    enabled: Number.isFinite(id) && id > 0,
  });
};
