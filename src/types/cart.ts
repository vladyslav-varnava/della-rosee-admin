export type CartCreateResponse = {
  id: string;
};

export type CartItem = {
  id: string;
  cartItemId?: string;

  productId: number;
  cardId: number;

  slug?: string;
  title: string;
  image: string;
  code?: string;

  quantity: number;
  price: number;
  basePrice: number;

  volume?: string;
  quantityInStock?: number;
};

export type CartDiscount = {
  title?: string;
  discount?: number;
  amount?: number;
  reason?: string;
};

export type Cart = {
  id: string;
  items: CartItem[];
  sum: number;
  fullSum: number;
  discountTotal?: number;
  discounts?: CartDiscount[];
};
