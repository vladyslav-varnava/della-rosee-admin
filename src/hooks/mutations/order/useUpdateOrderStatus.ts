'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { toaster } from '@/components/ui/toaster';
import { ordersKeys } from '@/hooks/query/useOrders';
import { ordersService } from '@/services/orders.service';
import { Order, UpdateOrderStatusPayload } from '@/types/order';

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateOrderStatusPayload) =>
      ordersService.updateStatus(payload),

    onError: () => {
      toaster.create({
        title: 'Не вдалося оновити статус',
        type: 'error',
      });
    },

    onSuccess: async (updatedOrder: Order) => {
      queryClient.setQueryData<Order>(
        ordersKeys.details(updatedOrder.id),
        updatedOrder,
      );

      await queryClient.invalidateQueries({
        queryKey: ordersKeys.adminLists(),
      });

      await queryClient.invalidateQueries({
        queryKey: ['admin-notifications'],
      });

      toaster.create({
        title: 'Статус замовлення оновлено',
        type: 'success',
      });
    },
  });
};
