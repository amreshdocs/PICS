import type { MenuItem } from '../types';

export const MENU_ITEMS: MenuItem[] = [
  { id: 'home', label: 'Home', path: '/', icon: '🏠' },
  { id: 'search', label: 'Search', path: '/search', icon: '🔎' },
  { id: 'create-customer', label: 'Create Customer', path: '/create-customer', icon: '➕' },
  { id: 'open-account', label: 'Open Account', path: '/open-account', icon: '🏦' },
  { id: 'accounts', label: 'Accounts', path: '/accounts', icon: '📊' },
  { id: 'tools', label: 'Tools', path: '/tools', icon: '🛠️' },
  { id: 'apps', label: 'Apps', path: '/apps', icon: '📦' },
];

export const ENDPOINT_ROUTES: Record<string, string> = {
  'search-customer': '/search',
};
