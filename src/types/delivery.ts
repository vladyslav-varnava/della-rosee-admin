import { DELIVERY_TYPE, DeliveryType } from '@/types/order';

export const NEW_POST_WAREHOUSE_TYPE_REFS = {
  WAREHOUSE: '841339c7-591a-42e2-8233-7a0a00f0ed6f',
  POSTMAT: 'f9316480-5f2d-425d-bc2c-ac7cd29decf0',
  PICKUP: 'collect',
} as const;

export type NewPostWarehouseTypeRef =
  (typeof NEW_POST_WAREHOUSE_TYPE_REFS)[keyof typeof NEW_POST_WAREHOUSE_TYPE_REFS];

export type DropdownItem = {
  id: string;
  value: string;
  label: string;
};

export type Address = {
  id?: number;
  firstName: string;
  lastName: string;
  phone: string;
  city: string;
  warehouseNumber: string;
  deliveryType: DeliveryType;
  deliverySettlementRefValue: string;
};

export type NovaPoshtaSettlement = {
  Present: string;
  Ref: string;
};

export type NovaPoshtaSettlementsResponse = {
  success: boolean;
  data?: Array<{
    Addresses?: NovaPoshtaSettlement[];
  }>;
};

export type NovaPoshtaWarehouse = {
  id: string;
  ref: string;
  siteKey?: string | null;
  number?: string | null;
  description: string;
  shortAddress?: string | null;
  typeOfWarehouse?: string | null;
  categoryOfWarehouse?: string | null;
  postMachineType?: string | null;
  cityDescription?: string | null;
  settlementDescription?: string | null;
  settlementAreaDescription?: string | null;
  warehouseStatus?: string | null;
  warehouseIndex?: string | null;
  postalCodeUA?: string | null;
  latitude?: string | null;
  longitude?: string | null;
};

export const adminDeliveryTypeOptions = [
  {
    label: 'Нова Пошта відділення',
    value: NEW_POST_WAREHOUSE_TYPE_REFS.WAREHOUSE,
  },
  {
    label: 'Нова Пошта поштомат',
    value: NEW_POST_WAREHOUSE_TYPE_REFS.POSTMAT,
  },
  {
    label: 'Самовивіз',
    value: NEW_POST_WAREHOUSE_TYPE_REFS.PICKUP,
  },
];

export const getDeliveryTypeById = (deliveryTypeId: string): DeliveryType => {
  if (deliveryTypeId === NEW_POST_WAREHOUSE_TYPE_REFS.WAREHOUSE) {
    return DELIVERY_TYPE.NOVA_POSHTA_WAREHOUSE;
  }

  if (deliveryTypeId === NEW_POST_WAREHOUSE_TYPE_REFS.POSTMAT) {
    return DELIVERY_TYPE.NOVA_POSHTA_POSTMAT;
  }

  return DELIVERY_TYPE.PICKUP;
};

export const getDeliveryTypeRef = (deliveryType: string) => {
  if (deliveryType === DELIVERY_TYPE.NOVA_POSHTA_WAREHOUSE) {
    return NEW_POST_WAREHOUSE_TYPE_REFS.WAREHOUSE;
  }

  if (deliveryType === DELIVERY_TYPE.NOVA_POSHTA_POSTMAT) {
    return NEW_POST_WAREHOUSE_TYPE_REFS.POSTMAT;
  }

  return NEW_POST_WAREHOUSE_TYPE_REFS.PICKUP;
};
