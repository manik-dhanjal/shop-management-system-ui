import { apiClient } from "./client.api";
import { AddUser, User } from "@features/user/interface/user.interface";
import { Pagination } from "@shared/interfaces/pagination.interface";

export class EmployeeApi {
  /** create a new employee to shop */
  static async addEmployee(shopId: string, userData: AddUser): Promise<User> {
    const response = await apiClient.post<User>(
      `/api/v1/shop/${shopId}/employee`,
      userData
    );
    return response.data;
  }

  static async getPaginatedEmployees(
    shopId: string,
    limit: number,
    page: number,
    filter?: Partial<AddUser>,
    sort?: Record<keyof AddUser, string>
  ): Promise<
    Pagination<
      Omit<User, "shopsMeta"> & {
        shopsMeta: { shop: string; roles: string[] }[];
      }
    >
  > {
    const response = await apiClient.post(
      `/api/v1/shop/${shopId}/employee/paginated`,
      {
        limit,
        page,
        filter,
        sort,
      }
    );
    return response.data;
  }

  static async getEmployee(
    shopId: string,
    employeeId: string
  ): Promise<
    Omit<User, "shopsMeta"> & {
      shopsMeta: { shop: string; roles: string[] }[];
    }
  > {
    const response = await apiClient.get(
      `/api/v1/shop/${shopId}/employee/${employeeId}`
    );
    return response.data;
  }

  static async updateEmployee(
    shopId: string,
    employeeId: string,
    user: Partial<AddUser>
  ): Promise<
    Omit<User, "shopsMeta"> & {
      shopsMeta: { shop: string; roles: string[] }[];
    }
  > {
    const response = await apiClient.patch(
      `/api/v1/shop/${shopId}/employee/${employeeId}`,
      user
    );
    return response.data;
  }
}
