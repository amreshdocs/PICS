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

export interface ApiError {
  ErrorMessage: string | null;
  ErrorType: string;
}

export interface ApiException {
  Errors: ApiError[];
}

export interface CustomerSearchResponse {
  data: CustomerResult[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  exceptions?: ApiException;
}

const API_KEY = import.meta.env.VITE_X_API_KEY || '';
const APP_CODE = import.meta.env.VITE_APP_CODE || '';

export const customersApi = {
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

      // Check for exceptions in response
      const exceptions = responseData?.Exceptions;
      if (exceptions && exceptions.Errors && Array.isArray(exceptions.Errors)) {
        const errorMessages = exceptions.Errors
          .map((err: ApiError) => err.ErrorMessage || err.ErrorType)
          .filter((msg: string) => msg && msg.trim() !== '')
          .join('; ');

        if (errorMessages) {
          throw new Error(errorMessages);
        }
      }

      // Helper function to flatten nested Customer.PersonInfo structure
      const flattenCustomerData = (raw: Record<string, any>): Record<string, any> => {
        if (!raw) return raw;

        // If data has nested Customer.PersonInfo structure, flatten it
        if (raw.Customer && raw.Customer.PersonInfo) {
          const { Customer, RelatedAccounts, ...rootFields } = raw;
          const { PersonInfo, CustCodes, ...otherCustomerFields } = Customer;
          return {
            ...rootFields,
            ...PersonInfo,
            ...otherCustomerFields,
            CustCodes: Customer.CustCodes,
            RelatedAccounts: RelatedAccounts || Customer.RelatedAccounts,
            RawPayload: raw,
          };
        }

        // If already flat or different structure, return as is with raw payload
        return {
          ...raw,
          RawPayload: raw,
        };
      };

      // Normalize response to expected format
      let dataArray: Record<string, any>[] = [];

      if (Array.isArray(responseData)) {
        dataArray = responseData.map(flattenCustomerData);
      } else if (responseData.data && Array.isArray(responseData.data)) {
        dataArray = responseData.data.map(flattenCustomerData);
      } else if (responseData && !exceptions) {
        dataArray = [flattenCustomerData(responseData)];
      }

      const normalizedResponse: CustomerSearchResponse = {
        data: dataArray,
        total: dataArray.length,
        page,
        pageSize,
        totalPages: Math.ceil(dataArray.length / pageSize),
      };

      return normalizedResponse;
    } catch (error) {
      throw new Error(
        `Customer search error: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  },
};

export default customersApi;
