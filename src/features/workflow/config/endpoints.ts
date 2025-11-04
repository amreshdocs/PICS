import type { ApiEndpoint } from '../../activity/types';

export const WORKFLOW_ENDPOINTS: ApiEndpoint[] = [
  {
    id: 'create-workflow',
    method: 'POST',
    path: '/api/Workflow',
    description: 'Create a new workflow',
    requestParams: [],
    requestBody: { name: 'string', description: 'string', steps: 'array' },
  },
  {
    id: 'get-workflow',
    method: 'GET',
    path: '/api/Workflow/{id}',
    description: 'Get workflow by ID',
    requestParams: [
      { name: 'id', value: '', type: 'string', required: true, description: 'Workflow ID' },
    ],
  },
  {
    id: 'update-workflow',
    method: 'PUT',
    path: '/api/Workflow/{id}',
    description: 'Update workflow',
    requestParams: [
      { name: 'id', value: '', type: 'string', required: true, description: 'Workflow ID' },
    ],
    requestBody: { name: 'string', status: 'string', steps: 'array' },
  },
  {
    id: 'workflow-status',
    method: 'GET',
    path: '/api/Workflow/status/{status}',
    description: 'Get workflows by status',
    requestParams: [
      { name: 'status', value: '', type: 'string', required: true, description: 'Workflow status' },
    ],
  },
];
