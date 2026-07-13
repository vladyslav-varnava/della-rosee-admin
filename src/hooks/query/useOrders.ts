'use client';

import { useQuery } from '@tanstack/react-query';

import { ordersService } from '@/services/orders.service';
import { GetOrdersAdminParams } from '@/types/order';

export const ordersKeys = {
  all: ['orders'] as const,
  adminLists: () => [...ordersKeys.all, 'admin-list'] as const,
  adminList: (params: GetOrdersAdminParams) =>
    [...ordersKeys.adminLists(), params] as const,
  details: (id: number) => [...ordersKeys.all, 'details', id] as const,
};

export const useGetOrdersAdmin = (params: GetOrdersAdminParams) => {
  return useQuery({
    queryKey: ordersKeys.adminList(params),
    queryFn: () => ordersService.getAdminOrders(params),
    placeholderData: (previousData) => previousData,
  });
};

export const useGetOrder = (id: number) => {
  return useQuery({
    queryKey: ordersKeys.details(id),
    queryFn: () => ordersService.getOrder(id),
    enabled: Number.isFinite(id) && id > 0,
    staleTime: 1000 * 60,
  });
};
