'use client';

import { useQuery } from '@tanstack/react-query';

import { ordersService } from '@/services/orders.service';
import { GetOrdersAdminParams } from '@/types/order';

export const ordersKeys = {
  all: ['orders'] as const,
  adminList: (params: GetOrdersAdminParams) =>
    [...ordersKeys.all, 'admin-list', params] as const,
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
    enabled: Boolean(id),
  });
};
