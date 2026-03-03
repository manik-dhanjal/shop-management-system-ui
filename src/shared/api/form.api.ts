import { apiClient } from "@shared/api/client.api";
import { Pagination } from "@shared/interfaces/pagination.interface";

export interface DropdownOption {
  value: any;
  label: string;
}

export interface GetDropdownOptionsPayload {
  entityType: string;
  valueField: string;
  labelField: string;
  query: {
    limit: number;
    page: number;
    filter?: Record<string, any>;
    sort?: Record<string, any>;
  };
}

export class FormApi {
  static async getDropdownOptions(
    shopId: string,
    payload: GetDropdownOptionsPayload,
  ): Promise<Pagination<DropdownOption>> {
    const response = await apiClient.post(
      `/api/v1/shop/${shopId}/form/dropdown-options`,
      payload,
    );
    return response.data;
  }
}
