import type { ApiEndpoint } from '../../activity/types';

export const PAYMENT_ENDPOINTS: ApiEndpoint[] = [
  {
    id: 'create-payment',
    method: 'POST',
    path: '/api/Payment',
    description: 'Create a new payment',
    requestParams: [],
    requestBody: { amount: 'number', currency: 'string', description: 'string' },
  },
  {
    id: 'get-payment',
    method: 'GET',
    path: '/api/Payment/{id}',
    description: 'Get payment by ID',
    requestParams: [
      { name: 'id', value: '', type: 'string', required: true, description: 'Payment ID' },
    ],
  },
  {
    id: 'update-payment',
    method: 'PUT',
    path: '/api/Payment/{id}',
    description: 'Update payment by ID',
    requestParams: [
      { name: 'id', value: '', type: 'string', required: true, description: 'Payment ID' },
    ],
    requestBody: { status: 'string', amount: 'number' },
  },
  {
    id: 'get-payment-workflow',
    method: 'GET',
    path: '/api/Payment/workflow/{workflowId}',
    description: 'Get payment by workflow ID',
    requestParams: [
      { name: 'workflowId', value: '', type: 'string', required: true, description: 'Workflow ID' },
    ],
  },
  {
    id: 'get-payment-customer',
    method: 'GET',
    path: '/api/Payment/customer/{customerCis}',
    description: 'Get payments by customer',
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
