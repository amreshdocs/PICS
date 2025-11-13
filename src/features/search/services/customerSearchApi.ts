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

      const BASE_URL = import.meta.env.VITE_POL_API_BASE_URL || '';

      let url = `${BASE_URL}/urn:TaxId:Headers.TaxId/Reference/Retrieve`;
      let headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        TaxId: searchValue,
        AppCode: APP_CODE,
        'x-client-traceid': new Date().toISOString(),
      };

      // Only include Authorization header when accessToken is present
      if (accessToken && accessToken.trim() !== '') {
        headers.Authorization = `Bearer ${accessToken}`;
      }

      if (searchType === 'cisNumber') {
        url = `${BASE_URL}/urn:CustPermId:Headers.CustPermId/Reference/Retrieve`;
        headers = {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY,
          CustPermId: searchValue,
          AppCode: APP_CODE,
          'x-client-traceid': new Date().toISOString(),
        };

        if (accessToken && accessToken.trim() !== '') {
          headers.Authorization = `Bearer ${accessToken}`;
        }
      }

      let response;
      try {
        response = await fetch(url, {
          method: 'GET',
          headers,
        });
      } catch (err) {
        // Network fetch failed (CORS or network). Try using a proxied relative path so Vite dev server can proxy it.
        try {
          const proxiedPath = url.includes('/urn:CustPermId:')
            ? `/urn:CustPermId:Headers.CustPermId/Reference/Retrieve`
            : `/urn:TaxId:Headers.TaxId/Reference/Retrieve`;
          response = await fetch(proxiedPath, {
            method: 'GET',
            headers,
          });
        } catch (innerErr) {
          throw innerErr;
        }
      }

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
      } catch (err) {
        throw new Error(
          `Invalid response format: ${err instanceof Error ? err.message : String(err)}`
        );
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
