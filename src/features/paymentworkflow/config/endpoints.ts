import type { ApiEndpoint } from '../../activity/types';

export const PAYMENTWORKFLOW_ENDPOINTS: ApiEndpoint[] = [
  {
    id: 'create-workflow',
    method: 'POST',
    path: '/api/PaymentWorkflow/create/{workflowId}',
    description: 'Create payment workflow',
    requestParams: [
      { name: 'workflowId', value: '', type: 'string', required: true, description: 'Workflow ID' },
    ],
    requestBody: { name: 'string', description: 'string' },
  },
  {
    id: 'workflow-status',
    method: 'GET',
    path: '/api/PaymentWorkflow/status/{workflowId}',
    description: 'Get workflow status',
    requestParams: [
      { name: 'workflowId', value: '', type: 'string', required: true, description: 'Workflow ID' },
    ],
  },
  {
    id: 'workflow-trigger',
    method: 'POST',
    path: '/api/PaymentWorkflow/trigger/{workflowId}',
    description: 'Trigger workflow execution',
    requestParams: [
      { name: 'workflowId', value: '', type: 'string', required: true, description: 'Workflow ID' },
    ],
    requestBody: { triggerData: 'object' },
  },
  {
    id: 'debit-transfer',
    method: 'POST',
    path: '/api/PaymentWorkflow/debit-transfer',
    description: 'Process debit transfer',
    requestParams: [],
    requestBody: { accountId: 'string', amount: 'number' },
  },
  {
    id: 'manual-review-resume',
    method: 'POST',
    path: '/api/PaymentWorkflow/manual-review/{workflowId}/resume',
    description: 'Resume workflow from manual review',
    requestParams: [
      { name: 'workflowId', value: '', type: 'string', required: true, description: 'Workflow ID' },
    ],
    requestBody: { approved: 'boolean' },
  },
  {
    id: 'batch-transaction-complete',
    method: 'POST',
    path: '/api/PaymentWorkflow/batch-transaction/{workflowId}/complete',
    description: 'Complete batch transaction',
    requestParams: [
      { name: 'workflowId', value: '', type: 'string', required: true, description: 'Workflow ID' },
    ],
    requestBody: { batchId: 'string' },
  },
  {
    id: 'workflow-activities',
    method: 'GET',
    path: '/api/PaymentWorkflow/activities/{workflowId}',
    description: 'Get workflow activities',
    requestParams: [
      { name: 'workflowId', value: '', type: 'string', required: true, description: 'Workflow ID' },
    ],
  },
  {
    id: 'workflow-customer',
    method: 'GET',
    path: '/api/PaymentWorkflow/customer/{customerCis}',
    description: 'Get workflows by customer',
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
  {
    id: 'manual-review-queue',
    method: 'GET',
    path: '/api/PaymentWorkflow/manual-review-queue',
    description: 'Get manual review queue',
    requestParams: [],
  },
];
