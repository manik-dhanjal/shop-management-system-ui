import { apiClient } from "./client.api";
import {
  CreateCustomer,
  Customer,
  UpdateCustomer,
} from "@features/customer/interface/customer.interface";
import { Pagination } from "@shared/interfaces/pagination.interface";

export class CustomerApi {
  static async createCustomer(
    shopId: string,
    customer: CreateCustomer,
  ): Promise<Customer> {
    const response = await apiClient.post<Customer>(
      `/api/v1/shop/${shopId}/customer`,
      customer,
    );
    return response.data;
  }

  static async getPaginatedCustomers(
    shopId: string,
    limit: number,
    page: number,
    filter?: Partial<CreateCustomer>,
    sort?: Record<keyof CreateCustomer, string>,
  ): Promise<Pagination<Customer>> {
    const response = await apiClient.post(
      `/api/v1/shop/${shopId}/customer/paginated`,
      {
        limit,
        page,
        filter,
        sort,
      },
    );
    return response.data;
  }

  static async getCustomer(
    shopId: string,
    customerId: string,
  ): Promise<Customer> {
    const response = await apiClient.get<Customer>(
      `/api/v1/shop/${shopId}/customer/${customerId}`,
    );
    return response.data;
  }

  static async updateCustomer(
    shopId: string,
    customerId: string,
    customer: UpdateCustomer,
  ): Promise<Customer> {
    const response = await apiClient.patch<Customer>(
      `/api/v1/shop/${shopId}/customer/${customerId}`,
      customer,
    );
    return response.data;
  }

  static async deleteCustomer(
    shopId: string,
    customerId: string,
  ): Promise<void> {
    await apiClient.delete(`/api/v1/shop/${shopId}/customer/${customerId}`);
  }
}
