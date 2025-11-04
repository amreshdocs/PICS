export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface RequestParam {
  name: string;
  value: string;
  type: 'string' | 'number' | 'boolean';
  required: boolean;
  description?: string;
}

export interface ApiEndpoint {
  id: string;
  method: HttpMethod;
  path: string;
  description?: string;
  requestParams: RequestParam[];
  requestBody?: object;
}

export interface ApiResponse {
  status: number;
  statusText: string;
  data: unknown;
  headers?: Record<string, string>;
}
