import { apiClient } from '@/lib/api';
import { Cart, CartCreateResponse } from '@/types/cart';

export type AddItemToCartByIdPayload = {
  quantity: number;
  cardId: number;
  productId: number;
  brandId: string;
  cartId: string;
  userId: number;
  shouldNotCheckInStock?: boolean;
};

export type UpdateCartItemPayload = {
  cartItemId: string;
  quantity: number;
  productId: number;
  cardId: number;
  cartId: string;
  shouldNotCheckInStock?: boolean;
};

export const cartService = {
  createCart: async () => {
    return apiClient.post<CartCreateResponse, Record<string, never>>(
      '/cart/create',
      {},
    );
  },

  getCartById: async (cartId: string, userId: number) => {
    return apiClient.get<Cart>(`/cart/${cartId}/${userId}`);
  },
  addItemToCartById: async (payload: AddItemToCartByIdPayload) => {
    return apiClient.post<Cart, AddItemToCartByIdPayload>(
      `/cart/add/${payload.cartId}`,
      payload,
    );
  },
  updateCartItem: async (payload: UpdateCartItemPayload) => {
    return apiClient.post<Cart, UpdateCartItemPayload>('/cart/update', payload);
  },
};
