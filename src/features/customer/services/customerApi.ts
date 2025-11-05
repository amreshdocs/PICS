import { authService } from '@/shared/services/authService';

export type SearchType = 'accountNumber' | 'ssn' | 'name' | 'phone' | 'cisNumber' | 'taxId';

export interface CustomerResult {
  name: string;
  address: string;
  dob: string;
  ssn: string;
  txnId: string;
  phone: string;
  email: string;
  cisNumber: string;
  accountNumber: string;
  [key: string]: unknown;
}

export interface CustomerSearchResponse {
  data: CustomerResult[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

const API_KEY = import.meta.env.VITE_X_API_KEY || '';
const APP_CODE = import.meta.env.VITE_APP_CODE || '';

export const customerApi = {
  search: async (
    searchValue: string,
    searchType: SearchType,
    page: number = 1,
    pageSize: number = 10
  ): Promise<CustomerSearchResponse> => {
    try {
      const accessToken = await authService.getAccessToken();

      const response = await fetch(`/v1/urn:TaxId:Headers.TaxId/Reference/Retrieve`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          'x-api-key': API_KEY,
          TaxId: searchValue,
          AppCode: APP_CODE,
          'x-client-traceid': new Date().toISOString(),
        },
      });

      if (!response.ok) {
        let errorBody = '';
        try {
          errorBody = await response.clone().text();
        } catch {
          errorBody = response.statusText || `HTTP ${response.status}`;
        }
        throw new Error(`Search failed with status ${response.status}: ${errorBody}`);
      }

      let responseData;
      try {
        responseData = await response.json();
      } catch {
        throw new Error(`Invalid response format: ${response.statusText}`);
      }

      // Normalize response to expected format
      const normalizedResponse: CustomerSearchResponse = {
        data: Array.isArray(responseData)
          ? responseData
          : responseData.data
            ? [responseData.data]
            : [responseData],
        total: 1,
        page,
        pageSize,
        totalPages: 1,
      };

      return normalizedResponse;
    } catch (error) {
      throw new Error(
        `Customer search error: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  },
};
