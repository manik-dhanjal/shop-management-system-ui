import {
  AddProduct,
  Product,
} from "@features/product/interfaces/product.interface";
import { apiClient } from "@shared/api/client.api";
import { Pagination } from "@shared/interfaces/pagination.interface";
import { omit as _omit } from "lodash";

export class ProductApi {
  static async createProduct(
    shopId: string,
    product: AddProduct
  ): Promise<Product> {
    const response = await apiClient.post(`/api/v1/shop/${shopId}/product`, {
      ...product,
      images: product.images.map((image) => image._id),
    });
    return response.data;
  }
  static async getPaginatedProducts(
    shopId: string,
    limit: number,
    page: number,
    filter?: Partial<AddProduct>,
    sort?: Record<keyof AddProduct, string>
  ): Promise<Pagination<Product>> {
    const response = await apiClient.post(
      `/api/v1/shop/${shopId}/product/paginated`,
      {
        limit,
        page,
        filter,
        sort,
      }
    );
    return response.data;
  }
  static async deleteProduct(shopId: string, productId: string): Promise<void> {
    await apiClient.delete(`/api/v1/shop/${shopId}/product/${productId}`);
  }

  static async getProduct(shopId: string, productId: string): Promise<Product> {
    const response = await apiClient.get(
      `/api/v1/shop/${shopId}/product/${productId}`
    );
    return response.data;
  }

  static async updateProduct(
    shopId: string,
    productId: string,
    product: Partial<Product>
  ): Promise<Product> {
    let productPayload: Partial<Omit<Product, "images"> & { images: string[] }>;
    if (product.images) {
      productPayload = {
        ...product,
        images: product.images.map((image) => image._id),
      };
    } else {
      productPayload = _omit(product, ["images"]);
    }
    const response = await apiClient.patch(
      `/api/v1/shop/${shopId}/product/${productId}`,
      productPayload
    );
    return response.data;
  }
}
