'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ordersKeys } from '@/hooks/query/useOrders';
import { ordersService } from '@/services/orders.service';
import { Order, UpdateOrderPayload, UpdateOrderStatusPayload } from '@/types/order';

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateOrderStatusPayload) =>
      ordersService.updateStatus(payload),
    onSuccess: async (updatedOrder: Order, variables) => {
      queryClient.setQueryData<Order>(
        ordersKeys.details(variables.id),
        (currentOrder) => {
          if (!currentOrder) return updatedOrder;

          return {
            ...currentOrder,
            ...updatedOrder,

            // зберігаємо вкладені дані, якщо backend їх не повернув
            orderItems: updatedOrder.orderItems ?? currentOrder.orderItems,
            user: updatedOrder.user ?? currentOrder.user,
            discounts: updatedOrder.discounts ?? currentOrder.discounts,
          };
        },
      );

      await queryClient.invalidateQueries({
        queryKey: ordersKeys.adminLists(),
      });

      await queryClient.invalidateQueries({
        queryKey: ['admin-notifications'],
      });
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
