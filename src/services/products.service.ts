import { apiClient } from '@/lib/api';
import {
  CreateProductInput,
  GetProductsAdminParams,
  Product,
  ProductsPagedList,
  UpdateProductPayload,
} from '@/types/product';

const PRODUCTS_PATH = '/products';
const PRODUCT_PATH = '/product';

export const productsService = {
  getAdminProducts: async (params: GetProductsAdminParams) => {
    return apiClient.get<ProductsPagedList>(`${PRODUCTS_PATH}/admin`, {
      params,
    });
  },

  createProduct: async (payload: CreateProductInput) => {
    return apiClient.post<Product, CreateProductInput>(PRODUCT_PATH, payload);
  },

  updateProduct: async (id: number, payload: UpdateProductPayload) => {
    return apiClient.put<Product, UpdateProductPayload>(
      `${PRODUCT_PATH}/${id}`,
      payload,
    );
  },

  activateProduct: async (id: number) => {
    return apiClient.put<Product>(`/activate/${id}`, {});
  },

  deactivateProduct: async (id: number) => {
    return apiClient.put<Product>(`/deactivate/${id}`, {});
  },

  deleteProduct: async (id: number) => {
    return apiClient.delete<void>(`${PRODUCT_PATH}/${id}`);
  },
};
