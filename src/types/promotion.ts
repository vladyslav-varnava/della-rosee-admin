export const PROMOTION_TYPES = [
  'PRODUCT_DISCOUNT',
  'CATEGORY_DISCOUNT',
  'BRAND_DISCOUNT',
  'CART_DISCOUNT',
  'BUNDLE',
  'BUY_X_GET_Y',
  'FREE_GIFT',
  'FREE_SHIPPING',
  'PROMOCODE',
  'LOYALTY',
] as const;

export type PromotionType = (typeof PROMOTION_TYPES)[number];

export type PromoCode = {
  id: string;
  code: string;
  promotionId: string;
  usageLimit: number | null;
  usageCount: number;
  perUserLimit: number | null;
  expiresAt: string | null;
  isActive: boolean;
  createdAt: string;
};

export type Promotion = {
  id: string;
  title: string;
  description: string | null;
  slug: string;
  type: PromotionType;
  priority: number;
  stackable: boolean;
  imageUrl: string | null;
  imageUrlMobile: string | null;
  productText: string | null;
  isPageVisible: boolean;
  isShowTimer: boolean;
  startAt: string;
  endAt: string | null;
  isActive: boolean;
  conditions: unknown;
  effects: unknown;
  usageLimit: number | null;
  usageCount: number;
  perUserLimit: number | null;
  createdAt: string;
  updatedAt: string;
  promoCodes: PromoCode[];
};

export type PromotionPayload = {
  title: string;
  description?: string;
  slug?: string;
  type: PromotionType;
  priority: number;
  stackable: boolean;
  imageUrl?: string;
  imageUrlMobile?: string;
  productText?: string;
  isPageVisible: boolean;
  isShowTimer: boolean;
  startAt: string;
  endAt?: string | null;
  isActive: boolean;
  conditions: Record<string, unknown>;
  effects: Record<string, unknown>;
  usageLimit?: number | null;
  perUserLimit?: number | null;
};

export type PromotionUpdatePayload = Partial<PromotionPayload>;

export type PromotionActiveFilter = 'all' | 'active' | 'inactive';

export type GetPromotionsParams = {
  active?: boolean;
  type?: PromotionType;
};
