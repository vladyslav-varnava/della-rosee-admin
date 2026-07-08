'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ordersKeys } from '@/hooks/query/useGetOrdersAdmin';
import { ordersService } from '@/services/orders.service';
import { UpdateOrderPayload, UpdateOrderStatusPayload } from '@/types/order';

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateOrderStatusPayload) =>
      ordersService.updateStatus(payload),
    onSuccess: async (updatedOrder) => {
      await queryClient.invalidateQueries({
        queryKey: ordersKeys.all,
      });

      queryClient.setQueryData(
        ordersKeys.details(updatedOrder.id),
        updatedOrder,
      );
    },
  });
};

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: UpdateOrderPayload;
    }) => ordersService.updateOrder(id, payload),
    onSuccess: async (updatedOrder) => {
      await queryClient.invalidateQueries({
        queryKey: ordersKeys.all,
      });

      queryClient.setQueryData(
        ordersKeys.details(updatedOrder.id),
        updatedOrder,
      );
    },
  });
};
