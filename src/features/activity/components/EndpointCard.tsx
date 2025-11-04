import React from 'react';
import type { ApiEndpoint } from '../types';

interface EndpointCardProps {
  endpoint: ApiEndpoint;
}

const getMethodColor = (method: string) => {
  const colors: Record<string, string> = {
    GET: 'bg-blue-100 text-blue-700 border border-blue-300',
    POST: 'bg-green-100 text-green-700 border border-green-300',
    PUT: 'bg-orange-100 text-orange-700 border border-orange-300',
    DELETE: 'bg-red-100 text-red-700 border border-red-300',
    PATCH: 'bg-yellow-100 text-yellow-700 border border-yellow-300',
  };
  return colors[method] || 'bg-gray-100 text-gray-700';
};

export const EndpointCard: React.FC<EndpointCardProps> = ({ endpoint }) => {
  return (
    <div
      id={`endpoint-${endpoint.id}`}
      className='bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg hover:border-blue-300 transition-all duration-200'
    >
      <div className='px-8 py-6 flex items-center gap-5'>
        <span
          className={`px-4 py-2 rounded-lg font-bold text-sm tracking-wide ${getMethodColor(endpoint.method)}`}
        >
          {endpoint.method}
        </span>
        <div className='flex-1 min-w-0'>
          <p className='font-mono text-base text-gray-800 truncate font-semibold'>
            {endpoint.path}
          </p>
          {endpoint.description && (
            <p className='text-sm text-gray-500 mt-2 font-medium'>{endpoint.description}</p>
          )}
        </div>
      </div>
    </div>
  );
};
