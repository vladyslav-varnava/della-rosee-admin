import { DeliveryType, PaymentType } from '@/types/order';

export type FormOrder = {
  cartId: string;
  userId: number;
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
  isSendEmailToCustomer: boolean;
  isSendMessageToTelegram: boolean;
  isCheckIsProductsAvailable: boolean;
  deliverySettlementRefValue: string;
  sellerId?: number;
};

export type FormOrderResponse = {
  email: string;
  outOfStockProducts?: Array<{
    title: string;
    productId: number;
  }>;
  paymentLink: string | null;
  success: boolean;
};

export type AdminOrderCreateFormValues = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;

  sellerId: string;
  paymentType: PaymentType;

  deliveryType: string;
  addressString: string;
  deliverySettlementRef: string;
  warehouse: string;
  warehouseRef: string;

  isSaveAddress: boolean;
  isMakeAddressDefault: boolean;
  isCheckIsProductsAvailable: boolean;
  isSendEmailToCustomer: boolean;
  isSendMessageToTelegram: boolean;
};
