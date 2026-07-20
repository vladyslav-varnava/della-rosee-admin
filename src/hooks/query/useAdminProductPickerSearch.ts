'use client';

import { useQuery } from '@tanstack/react-query';

import { productsService } from '@/services/products.service';

const MIN_SEARCH_LENGTH = 2;

type Params = {
  search: string;
  page: number;
  take: number;
};

export const adminProductPickerKeys = {
  all: ['admin-product-picker'] as const,
  search: (params: Params) =>
    [
      ...adminProductPickerKeys.all,
      params.search,
      params.page,
      params.take,
    ] as const,
};

export const useAdminProductPickerSearch = ({ search, page, take }: Params) => {
  const normalizedSearch = search.trim();
  const skip = (page - 1) * take;

  return useQuery({
    queryKey: adminProductPickerKeys.search({
      search: normalizedSearch,
      page,
      take,
    }),
    queryFn: () =>
      productsService.searchAdminProductsForPicker({
        search: normalizedSearch,
        take,
        skip,
      }),
    enabled: normalizedSearch.length >= MIN_SEARCH_LENGTH,
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60,
  });
};
