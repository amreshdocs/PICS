import type { ApiEndpoint } from '../types';

export const ACTIVITY_ENDPOINTS: ApiEndpoint[] = [
  {
    id: 'create-activity',
    method: 'POST',
    path: '/api/Activity',
    description: 'Create a new activity',
    requestParams: [],
    requestBody: {
      name: 'string',
      description: 'string',
      status: 'string',
    },
  },
  {
    id: 'get-activity',
    method: 'GET',
    path: '/api/Activity/{id}',
    description: 'Get activity by ID',
    requestParams: [
      {
        name: 'id',
        value: '',
        type: 'string',
        required: true,
        description: 'Activity ID',
      },
    ],
  },
  {
    id: 'update-activity',
    method: 'PUT',
    path: '/api/Activity/{id}',
    description: 'Update activity by ID',
    requestParams: [
      {
        name: 'id',
        value: '',
        type: 'string',
        required: true,
        description: 'Activity ID',
      },
    ],
    requestBody: {
      name: 'string',
      description: 'string',
      status: 'string',
    },
  },
  {
    id: 'get-workflow',
    method: 'GET',
    path: '/api/Activity/workflow/{workflowId}',
    description: 'Get activity by workflow ID',
    requestParams: [
      {
        name: 'workflowId',
        value: '',
        type: 'string',
        required: true,
        description: 'Workflow ID',
      },
    ],
  },
  {
    id: 'get-latest-workflow',
    method: 'GET',
    path: '/api/Activity/workflow/{workflowId}/latest',
    description: 'Get latest activity for workflow',
    requestParams: [
      {
        name: 'workflowId',
        value: '',
        type: 'string',
        required: true,
        description: 'Workflow ID',
      },
    ],
  },
];
