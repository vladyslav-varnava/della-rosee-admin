'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { toaster } from '@/components/ui/toaster';
import { ordersKeys } from '@/hooks/query/useOrders';
import { ordersService } from '@/services/orders.service';
import { Order, UpdateOrderPayload } from '@/types/order';

type Payload = {
  id: number;
  data: UpdateOrderPayload;
};

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: Payload) => ordersService.updateOrder(id, data),

    onError: () => {
      toaster.create({
        title: 'Не вдалося оновити замовлення',
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

      toaster.create({
        title: 'Замовлення оновлено',
        type: 'success',
      });
    },
  });
};
