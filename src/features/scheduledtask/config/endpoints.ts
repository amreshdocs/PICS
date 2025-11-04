import type { ApiEndpoint } from '../../activity/types';

export const SCHEDULEDTASK_ENDPOINTS: ApiEndpoint[] = [
  {
    id: 'create-task',
    method: 'POST',
    path: '/api/ScheduledTask',
    description: 'Create a new scheduled task',
    requestParams: [],
    requestBody: { name: 'string', schedule: 'string', action: 'string' },
  },
  {
    id: 'get-task',
    method: 'GET',
    path: '/api/ScheduledTask/{id}',
    description: 'Get scheduled task by ID',
    requestParams: [
      { name: 'id', value: '', type: 'string', required: true, description: 'Task ID' },
    ],
  },
  {
    id: 'update-task',
    method: 'PUT',
    path: '/api/ScheduledTask/{id}',
    description: 'Update scheduled task',
    requestParams: [
      { name: 'id', value: '', type: 'string', required: true, description: 'Task ID' },
    ],
    requestBody: { name: 'string', schedule: 'string', status: 'string' },
  },
  {
    id: 'task-subscription',
    method: 'GET',
    path: '/api/ScheduledTask/subscription/{subscriptionId}',
    description: 'Get tasks by subscription',
    requestParams: [
      {
        name: 'subscriptionId',
        value: '',
        type: 'string',
        required: true,
        description: 'Subscription ID',
      },
    ],
  },
  {
    id: 'task-workflow',
    method: 'GET',
    path: '/api/ScheduledTask/workflow/{workflowId}',
    description: 'Get tasks by workflow',
    requestParams: [
      { name: 'workflowId', value: '', type: 'string', required: true, description: 'Workflow ID' },
    ],
  },
  {
    id: 'task-date',
    method: 'GET',
    path: '/api/ScheduledTask/date/{date}',
    description: 'Get tasks by date',
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
