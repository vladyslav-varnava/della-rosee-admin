import { apiClient } from '@/lib/api';
import {
  GetOrdersAdminParams,
  Order,
  OrdersResponse,
  UpdateOrderPayload,
  UpdateOrderStatusPayload,
} from '@/types/order';
import { FormOrder, FormOrderResponse } from '@/types/admin-order';

const ORDER_PATH = '/order';

export const ordersService = {
  getAdminOrders: async (params: GetOrdersAdminParams) => {
    return apiClient.get<OrdersResponse>(`${ORDER_PATH}/admin`, {
      params,
    });
  },

  getOrder: async (id: number) => {
    return apiClient.get<Order>(`${ORDER_PATH}/${id}`);
  },

  updateOrder: async (id: number, payload: UpdateOrderPayload) => {
    return apiClient.put<Order, UpdateOrderPayload>(
      `${ORDER_PATH}/${id}`,
      payload,
    );
  },

  updateStatus: async ({ id, status }: UpdateOrderStatusPayload) => {
    return apiClient.put<Order, { status: string }>(
      `${ORDER_PATH}/status/${id}`,
      { status },
    );
  },
  formOrder: async (payload: FormOrder) => {
    return apiClient.post<FormOrderResponse, FormOrder>('/order/form', payload);
  },
};
