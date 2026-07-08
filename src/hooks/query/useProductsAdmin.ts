'use client';

import { useQuery } from '@tanstack/react-query';

import { productsService } from '@/services/products.service';
import { GetProductsAdminParams } from '@/types/product';

export const productsKeys = {
  all: ['products'] as const,
  adminLists: () => [...productsKeys.all, 'admin-list'] as const,
  adminList: (params: GetProductsAdminParams) =>
    [...productsKeys.adminLists(), params] as const,
  details: (id: number) => [...productsKeys.all, 'details', id] as const,
};

export const useProductsAdmin = (params: GetProductsAdminParams) => {
  return useQuery({
    queryKey: productsKeys.adminList(params),
    queryFn: () => productsService.getAdminProducts(params),
    placeholderData: (previousData) => previousData,
  });
};
