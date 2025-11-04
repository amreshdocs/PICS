import type { ApiEndpoint } from '../../activity/types';

export const SUBSCRIPTION_ENDPOINTS: ApiEndpoint[] = [
  {
    id: 'create-subscription',
    method: 'POST',
    path: '/api/Subscription',
    description: 'Create a new subscription',
    requestParams: [],
    requestBody: { name: 'string', plan: 'string', customerId: 'string' },
  },
  {
    id: 'get-subscription',
    method: 'GET',
    path: '/api/Subscription/{id}',
    description: 'Get subscription by ID',
    requestParams: [
      { name: 'id', value: '', type: 'string', required: true, description: 'Subscription ID' },
    ],
  },
  {
    id: 'update-subscription',
    method: 'PUT',
    path: '/api/Subscription/{id}',
    description: 'Update subscription',
    requestParams: [
      { name: 'id', value: '', type: 'string', required: true, description: 'Subscription ID' },
    ],
    requestBody: { status: 'string', plan: 'string' },
  },
  {
    id: 'customer-subscriptions',
    method: 'GET',
    path: '/api/Subscription/customer/{customerCis}',
    description: 'Get subscriptions by customer',
    requestParams: [
      {
        name: 'customerCis',
        value: '',
        type: 'string',
        required: true,
        description: 'Customer CIS',
      },
    ],
  },
];
