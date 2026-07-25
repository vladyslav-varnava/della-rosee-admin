import { OrderStatus } from '@/types/order';

export type Seller = {
  id: number;
  name: string;
  phone: string | null;
  email: string | null;
  isActive: boolean;
  createdAt: string;
};

export type SellerPayload = {
  name: string;
  phone?: string;
  email?: string;
};

export type UpdateSellerPayload = Partial<SellerPayload> & {
  isActive?: boolean;
};

export type SellerStats = {
  id: number;
  name: string;
  phone: string | null;
  email: string | null;
  totalOrders: number;
  totalAmount: number;
  totalFullAmount: number;
  totalDiscount: number;
  ordersByStatus: Record<OrderStatus, number>;
};

export type SellerStatsParams = {
  from?: string;
  to?: string;
};
