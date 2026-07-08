export interface ProductsPagedList {
  items: Product[];
  paging: {
    total: number;
    limit: number;
    offset: number;
  };
}

export interface Product {
  id: number;
  isVisible: boolean;
  isPopular: boolean;
  isNew: boolean;
  isComingSoon: boolean;
  isForMen: boolean;
  quantity: number;
  averageRating: number;
  title: string;
  subtitle: string;
  description: string;
  shortDescription: string;
  syllable: string;
  hasActivePromotion: boolean;
  brand: string;
  types: string[];
  skinTypes: string[];
  useTime: string;
  treats: string[];
  faqs: string;
  howToUse: string;
  country: string;
  feedbacks?: unknown[];
  recommendations: string[];
  bodyType: string[];
  buyWith: string[];
  items: ProductVariant[];
  slug: string;
  code: string;
  buyWithProducts?: Product[];
  videos: string[];
  ingredients: string[];
  isSet: boolean;
  image?: string;
}

export interface ProductVariant {
  basePrice: number;
  discount: string;
  id: number;
  isVisible: boolean;
  price: number;
  productId: number;
  image: string;
  imageSecondary?: string;
  images?: string[];
  code: string;
  quantity: number;
  title: string;
  value: number;
  unit: string;
  cardId: number;
  endAt?: string;
  isShowTimer?: boolean;
  reservedCount: number;
}

export type Ingredient = {
  id: number;
  label: string;
  value: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateProductInput = {
  isPopular: boolean;
  isNew: boolean;
  isComingSoon: boolean;
  isForMen: boolean;
  isSet: boolean;
  quantity: number;
  averageRating: number;
  title: string;
  subtitle: string;
  description: string;
  shortDescription: string;
  syllable: string;
  hasActivePromotion: boolean;
  brand: string;
  types: string[];
  skinTypes: string[];
  useTime: string;
  treats: string[];
  country: string;
  howToUse: string;
  bodyType: string[];
  buyWith: string[];
  ingredients: string[];
  videos: string[];
};

export type ProductFormValues = {
  title: string;
  brand: string;
  shortDescription: string;
  description: string;
  syllable: string;
  howToUse: string;

  country: string;
  useTime: string;

  isPopular: boolean;
  isNew: boolean;
  isComingSoon: boolean;
  isForMen: boolean;
  isSet: boolean;
  hasActivePromotion: boolean;

  types: string[];
  skinTypes: string[];
  treats: string[];
  bodyType: string[];
  ingredients: string[];
};

export type GetProductsAdminParams = {
  take: number;
  skip: number;
  search?: string;
};

export type UpdateProductPayload = Partial<
  Pick<
    Product,
    | 'title'
    | 'subtitle'
    | 'description'
    | 'shortDescription'
    | 'brand'
    | 'isVisible'
    | 'isPopular'
    | 'isNew'
    | 'isComingSoon'
    | 'isForMen'
    | 'country'
    | 'howToUse'
    | 'faqs'
  >
>;

export type ProductOption = {
  value: string;
  label: string;
  groupLabel?: string;
  groupId?: string;
  area?: string;
};
