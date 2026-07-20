'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { toaster } from '@/components/ui/toaster';
import { cartKeys } from '@/hooks/query/useCart';
import { ordersKeys } from '@/hooks/query/useOrders';
import { ordersService } from '@/services/orders.service';
import { FormOrder, FormOrderResponse } from '@/types/admin-order';

export const useFormOrder = (cartId: string, userId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: FormOrder) => ordersService.formOrder(payload),

    onError: (error) => {
      toaster.create({
        title: 'Не вдалося створити замовлення',
        description:
          error instanceof Error ? error.message : 'Спробуйте ще раз',
        type: 'error',
      });
    },

    onSuccess: async (data: FormOrderResponse) => {
      if (data.success === false && data.outOfStockProducts?.length) {
        toaster.create({
          title: 'Недостатньо товарів на складі',
          description: `Закінчились: ${data.outOfStockProducts
            .map((item) => item.title)
            .join(', ')}`,
          type: 'error',
        });

        return;
      }

      queryClient.setQueryData(cartKeys.details(cartId, userId), undefined);

      await queryClient.invalidateQueries({
        queryKey: ordersKeys.adminLists(),
      });

      toaster.create({
        title: 'Замовлення створено',
        description: 'Замовлення додано в історію користувача',
        type: 'success',
      });
    },
  });
};
