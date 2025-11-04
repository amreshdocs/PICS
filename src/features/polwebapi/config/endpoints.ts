import type { ApiEndpoint } from '../../activity/types';

export const POLWEBAPI_ENDPOINTS: ApiEndpoint[] = [
  {
    id: 'health',
    method: 'GET',
    path: '/health',
    description: 'Health check endpoint',
    requestParams: [],
  },
];
