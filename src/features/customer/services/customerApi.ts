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

const getQueryParamName = (searchType: SearchType): string => {
  const paramMap: Record<SearchType, string> = {
    accountNumber: 'accountNumber',
    ssn: 'ssn',
    name: 'name',
    phone: 'phone',
    cisNumber: 'cisNumber',
    taxId: 'taxId',
  };
  return paramMap[searchType];
};

export const customerApi = {
  search: async (
    searchValue: string,
    searchType: SearchType,
    page: number = 1,
    pageSize: number = 10
  ): Promise<CustomerSearchResponse> => {
    try {
      const accessToken = await authService.getAccessToken();

      // Use TaxId endpoint for taxId search type
      if (searchType === 'taxId') {
        const response = await fetch(`/api/urn:TaxId:Headers.TaxId/Reference/Retrieve`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
            'X-API-Key': API_KEY,
            'TaxId': searchValue,
            'AppCode': APP_CODE,
          },
        });

        if (!response.ok) {
          const errorBody = await response.text();
          throw new Error(`Tax ID search failed with status ${response.status}: ${errorBody}`);
        }

        const responseData = await response.json();

        // Normalize response to expected format
        const normalizedResponse: CustomerSearchResponse = {
          data: Array.isArray(responseData) ? responseData : responseData.data ? [responseData.data] : [responseData],
          total: 1,
          page,
          pageSize,
          totalPages: 1,
        };

        return normalizedResponse;
      }

      // Use payment customer endpoint for other search types
      const paramName = getQueryParamName(searchType);

      const queryParams = new URLSearchParams({
        [paramName]: searchValue,
        page: page.toString(),
        pageSize: pageSize.toString(),
      });

      const response = await fetch(`/api/payment/customer?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          'X-API-Key': API_KEY,
        },
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Search failed with status ${response.status}: ${errorBody}`);
      }

      const responseData = await response.json();

      // Normalize response to expected format
      const normalizedResponse: CustomerSearchResponse = {
        data: Array.isArray(responseData) ? responseData : responseData.data || [],
        total: responseData.total || (Array.isArray(responseData) ? responseData.length : 0),
        page,
        pageSize,
        totalPages: Math.ceil(
          (responseData.total || (Array.isArray(responseData) ? responseData.length : 0)) / pageSize
        ),
      };

      return normalizedResponse;
    } catch (error) {
      throw new Error(
        `Customer search error: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  },
};
