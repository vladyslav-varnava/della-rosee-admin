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
    | 'amount'
    | 'paymentType'
    | 'paymentStatus'
    | 'deliveryType'
    | 'addressString'
    | 'warehouse'
    | 'firstName'
    | 'lastName'
    | 'email'
    | 'phone'
    | 'sellerId'
  >
>;

export type UpdateOrderStatusPayload = {
  id: number;
  status: OrderStatus;
};

export const ORDER_STATUS = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  PROCESSED: 'PROCESSED',
  DISPATCHED: 'DISPATCHED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  RETURNED: 'RETURNED',
} as const;

export type OrderStatus =
  (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS] | (string & {});

export const translateOrderStatus = (status: string) => {
  const statuses: Record<string, string> = {
    PENDING: 'Нове',
    PROCESSING: 'В обробці',
    PROCESSED: 'Оброблено',
    DISPATCHED: 'Відправлено',
    COMPLETED: 'Виконано',
    CANCELLED: 'Скасовано',
    RETURNED: 'Повернення',
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
    PENDING: 'orange',
    PROCESSING: 'blue',
    PROCESSED: 'purple',
    DISPATCHED: 'cyan',
    COMPLETED: 'green',
    CANCELLED: 'red',
    RETURNED: 'gray',
  };

  return colors[status] ?? 'gray';
};

export const ORDER_STATUS_OPTIONS = [
  ORDER_STATUS.PENDING,
  ORDER_STATUS.PROCESSING,
  ORDER_STATUS.PROCESSED,
  ORDER_STATUS.DISPATCHED,
  ORDER_STATUS.COMPLETED,
  ORDER_STATUS.CANCELLED,
  ORDER_STATUS.RETURNED,
] as const;

export const PAYMENT_TYPE = {
  CARD: 'CARD',
  CASH: 'CASH',
  CARD_AFTER_DELIVERY: 'CARD_AFTER_DELIVERY',
  COMBINED_PAY: 'COMBINED_PAY',
  PAY_ON_IBAN: 'PAY_ON_IBAN',
} as const;

export type PaymentType = (typeof PAYMENT_TYPE)[keyof typeof PAYMENT_TYPE];

export const paymentTypeOptions = [
  {
    label: 'Онлайн за допомогою платіжної системи',
    value: PAYMENT_TYPE.CARD,
  },
  {
    label: 'Готівка при отриманні',
    value: PAYMENT_TYPE.CASH,
  },
  {
    label: 'Карткою при отриманні',
    value: PAYMENT_TYPE.CARD_AFTER_DELIVERY,
  },
  {
    label: 'Комбінована оплата',
    value: PAYMENT_TYPE.COMBINED_PAY,
  },
  {
    label: 'Оплата на IBAN',
    value: PAYMENT_TYPE.PAY_ON_IBAN,
  },
];

export const translatePaymentType = (paymentType: string) => {
  const translations: Record<string, string> = {
    CARD: 'Онлайн за допомогою платіжної системи',
    CASH: 'Готівка при отриманні',
    CARD_AFTER_DELIVERY: 'Карткою при отриманні',
    COMBINED_PAY: 'Комбінована оплата',
    PAY_ON_IBAN: 'Оплата на IBAN',
  };

  return translations[paymentType] ?? paymentType;
};

export const PAYMENT_STATUS = {
  pending: 'pending',
  created: 'created',
  processing: 'processing',
  hold: 'hold',
  success: 'success',
  failure: 'failure',
  reversed: 'reversed',
  expired: 'expired',
} as const;

export const DELIVERY_TYPE = {
  PICKUP: 'PICKUP',
  NOVA_POSHTA_WAREHOUSE: 'NOVA_POSHTA_WAREHOUSE',
  NOVA_POSHTA_POSTMAT: 'NOVA_POSHTA_POSTMAT',
} as const;


export const deliveryTypeOptions = [
  { label: 'Нова Пошта відділення', value: DELIVERY_TYPE.NOVA_POSHTA_WAREHOUSE },
  { label: 'Нова Пошта поштомат', value: DELIVERY_TYPE.NOVA_POSHTA_POSTMAT },
  { label: 'Самовивіз', value: DELIVERY_TYPE.PICKUP },
];

export type PaymentStatus =
  (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];

export const paymentStatusOptions = [
  {
    label: 'Оплата очікується',
    value: PAYMENT_STATUS.pending,
  },
  {
    label: 'Оплата створена',
    value: PAYMENT_STATUS.created,
  },
  {
    label: 'Оплата в обробці',
    value: PAYMENT_STATUS.processing,
  },
  {
    label: 'Оплата на утриманні',
    value: PAYMENT_STATUS.hold,
  },
  {
    label: 'Оплата успішна',
    value: PAYMENT_STATUS.success,
  },
  {
    label: 'Сталась помилка при оплаті',
    value: PAYMENT_STATUS.failure,
  },
  {
    label: 'Платіж повернено',
    value: PAYMENT_STATUS.reversed,
  },
  {
    label: 'Оплата не виконана вчасно',
    value: PAYMENT_STATUS.expired,
  },
];

export const translatePaymentStatus = (paymentStatus: string) => {
  const translations: Record<string, string> = {
    pending: 'Оплата очікується',
    created: 'Оплата створена',
    processing: 'Оплата в обробці',
    hold: 'Оплата на утриманні',
    success: 'Оплата успішна',
    failure: 'Сталась помилка при оплаті',
    reversed: 'Платіж повернено',
    expired: 'Оплата не виконана вчасно',
  };

  return translations[paymentStatus] ?? paymentStatus;
};
