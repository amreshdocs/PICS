import type { MenuItem } from '../types';

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'customer',
    label: 'Customer',
    path: '/customer',
    icon: '👤',
    submenu: [{ id: 'customer-search', label: 'Search Customer', endpointId: 'search-customer' }],
  },
];

export const ENDPOINT_ROUTES: Record<string, string> = {
  // Customer
  'search-customer': '/customer/search',
};
