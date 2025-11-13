export interface AccountDetails {
  number: string | number;
  bank: string;
  product: string;
  bookBalance: number | null;
  availableBalance: number | null;
  status: 'A' | 'C' | 'N' | 'T' | string;
  relationship: string;
  accountType: string;
  productType?: string;
  acctType?: string;
}

export interface SortConfig {
  key: keyof AccountDetails | null;
  direction: 'asc' | 'desc';
}

export interface FilterConfig {
  status?: string;
  accountType?: string;
}
