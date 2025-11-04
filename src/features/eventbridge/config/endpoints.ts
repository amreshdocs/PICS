import type { ApiEndpoint } from '../../activity/types';

export const EVENTBRIDGE_ENDPOINTS: ApiEndpoint[] = [
  {
    id: 'scheduled-payment-trigger',
    method: 'POST',
    path: '/api/EventBridge/scheduled-payment-trigger',
    description: 'Trigger scheduled payment event',
    requestParams: [],
    requestBody: { eventType: 'string', timestamp: 'string' },
  },
  {
    id: 'health',
    method: 'GET',
    path: '/api/EventBridge/health',
    description: 'Health check endpoint',
    requestParams: [],
  },
  {
    id: 'metrics-daily',
    method: 'GET',
    path: '/api/EventBridge/metrics/daily',
    description: 'Get daily metrics',
    requestParams: [],
  },
  {
    id: 'summary-date',
    method: 'GET',
    path: '/api/EventBridge/summary/{date}',
    description: 'Get summary for specific date',
    requestParams: [
      {
        name: 'date',
        value: '',
        type: 'string',
        required: true,
        description: 'Date in YYYY-MM-DD format',
      },
    ],
  },
];
