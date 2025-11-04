import { authService } from '@/shared/services/authService';

export type SearchType = 'name' | 'custId' | 'txId' | 'phone' | 'accountNumber';

export interface CustomerSearchResult {
  name: string;
  address: string;
  dob: string;
  ssn: string;
  txnId: string;
  phone: string;
  email: string;
  cisNumber: string;
  [key: string]: unknown;
}

export interface RelatedAcctsResponse {
  data: CustomerSearchResult[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

const API_KEY = import.meta.env.VITE_X_API_KEY || '';

const getQueryParamName = (searchType: SearchType): string => {
  const paramMap: Record<SearchType, string> = {
    name: 'name',
    custId: 'custId',
    txId: 'txnId',
    phone: 'phone',
    accountNumber: 'accountNumber',
  };
  return paramMap[searchType];
};

export const relatedAcctsApi = {
  search: async (
    searchValue: string,
    searchType: SearchType,
    page: number = 1,
    pageSize: number = 10
  ): Promise<RelatedAcctsResponse> => {
    try {
      const accessToken = await authService.getAccessToken();
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
      const normalizedResponse: RelatedAcctsResponse = {
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
        `Related accounts search error: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  },
};
