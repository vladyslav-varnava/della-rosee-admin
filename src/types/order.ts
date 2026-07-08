export type PaymentType =
  'CASH' | 'CARD' | 'ONLINE' | 'MONOBANK' | 'PAY_ON_DELIVERY' | string;

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'CANCELED' | string;

export type DeliveryType =
  'PICKUP' | 'NOVA_POSHTA_WAREHOUSE' | 'NOVA_POSHTA_POSTMAT' | string;

export type DiscountLine = {
  discount: number;
  reason?: string;
  promotionId?: number;
  promoCode?: string;
  affectedItems?: number[];
  meta?: Record<string, unknown>;
};

export type OrderUser = {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
};

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  code: string;
  image: string;
  title: string;
  price: number;
  slug: string;
  quantityInStock: number;
}

export interface Order {
  id: number;
  amount: number;
  fulAmount: number;
  userId: null | number;

  /**
   * Backend Date becomes string after JSON response.
   */
  createdAt: string;

  paymentType: PaymentType;
  paymentStatus: PaymentStatus;
  deliveryType: DeliveryType;
  addressString: string;
  warehouse: string;
  firstName: string;
  lastName: string;
  status: OrderStatus;
  email: string;
  phone: string;
  orderItems?: OrderItem[];
  user?: OrderUser | null;
  isFormedByAdmin: boolean;
  sellerId?: number;
  discounts: DiscountLine[];
}

export interface MakeOrder {
  cartId: string;
  userId: null | number;
  paymentType: PaymentType;
  deliveryType: DeliveryType;
  addressString: string;
  warehouse: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  isSaveAddress: boolean;
  isMakeAddressDefault: boolean;
  deliverySettlementRefValue: string;
}

export type OrdersPaging = {
  total: number;
  limit: number;
  offset: number;
};

export type OrdersResponse = {
  items: Order[];
  paging: OrdersPaging;
};

export type GetOrdersAdminParams = {
  take: number;
  skip: number;
  from?: string;
  to?: string;
  search?: string;
};

export type UpdateOrderPayload = Partial<
  Pick<
    Order,
    | 'paymentType'
    | 'paymentStatus'
    | 'deliveryType'
    | 'addressString'
    | 'warehouse'
    | 'firstName'
    | 'lastName'
    | 'email'
    | 'phone'
  >
>;

export type UpdateOrderStatusPayload = {
  id: number;
  status: OrderStatus;
};

export const ORDER_STATUS = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  CANCELED: 'CANCELED',
  CANCELLED: 'CANCELLED',
} as const;

export type OrderStatus =
  (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS] | (string & {});

export const translateOrderStatus = (status: string) => {
  const statuses: Record<string, string> = {
    PENDING: 'Нове',
    PROCESSING: 'В обробці',
    COMPLETED: 'Виконано',
    CANCELED: 'Скасовано',
    CANCELLED: 'Скасовано',
  };

  return statuses[status] ?? status;
};

export const translatePaymentType = (type: string) => {
  const types: Record<string, string> = {
    CASH: 'Готівка',
    CARD: 'Картка',
    ONLINE: 'Онлайн',
    MONOBANK: 'Monobank',
    PAY_ON_DELIVERY: 'Накладений платіж',
    CARD_AFTER_DELIVERY: 'Картка після доставки',
    PAY_ON_IBAN: 'Оплата по IBAN',
  };

  return types[type] ?? type;
};

export const translatePaymentStatus = (status: string) => {
  const statuses: Record<string, string> = {
    PENDING: 'Очікує',
    PAID: 'Оплачено',
    FAILED: 'Помилка',
    CANCELED: 'Скасовано',
  };

  return statuses[status] ?? status;
};

export const translateDeliveryType = (type: string) => {
  const types: Record<string, string> = {
    PICKUP: 'Самовивіз',
    NOVA_POSHTA_WAREHOUSE: 'Нова Пошта відділення',
    NOVA_POSHTA_POSTMAT: 'Поштомат',
  };

  return types[type] ?? type;
};

export const getOrderStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    PENDING: 'red',
    PROCESSING: 'blue',
    COMPLETED: 'green',
    CANCELED: 'gray',
    CANCELLED: 'gray',
  };

  return colors[status] ?? 'gray';
};
