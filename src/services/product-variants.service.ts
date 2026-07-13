import { apiClient } from '@/lib/api';
import {
  CreateVariantFromSmartKasaPayload,
  ProductVariant,
  ProductVariantPayload,
} from '@/types/product';

const VARIANT_PATH = '/variant';

export const productVariantsService = {
  createFromSmartKasa: async ({
    productId,
    cardId,
  }: CreateVariantFromSmartKasaPayload) => {
    return apiClient.post<ProductVariant, CreateVariantFromSmartKasaPayload>(
      `${VARIANT_PATH}/createByCardId/${cardId}`,
      {
        productId,
        cardId,
      },
    );
  },

  updateVariant: async (variantId: number, payload: ProductVariantPayload) => {
    return apiClient.put<ProductVariant, ProductVariantPayload>(
      `${VARIANT_PATH}/${variantId}`,
      payload,
    );
  },

  activateVariant: async (variantId: number) => {
    return apiClient.put<ProductVariant>(
      `${VARIANT_PATH}/activate/${variantId}`,
    );
  },

  deactivateVariant: async (variantId: number) => {
    return apiClient.put<ProductVariant>(
      `${VARIANT_PATH}/deactivate/${variantId}`,
    );
  },

  deleteVariant: async (variantId: number) => {
    return apiClient.delete<void>(`${VARIANT_PATH}/${variantId}`);
  },

  syncSmartKasaStock: async (variantId: number, cardId: number) => {
    return apiClient.put<ProductVariant>(
      `${VARIANT_PATH}/syncSmartKasaStock/${variantId}`,
      {
        cardId,
      },
    );
  },
};
