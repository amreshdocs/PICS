import React, { useState } from 'react';
import type { ApiResponse } from '../types';

interface ResponseViewerProps {
  response: ApiResponse | null;
  isLoading: boolean;
  error?: string | null;
}

const JsonTreeNode: React.FC<{ data: unknown; level: number }> = ({ data, level }) => {
  const [expanded, setExpanded] = useState(level < 2);

  if (data === null) {
    return <span className='text-red-600'>null</span>;
  }

  if (typeof data === 'boolean') {
    return <span className='text-orange-600'>{String(data)}</span>;
  }

  if (typeof data === 'number') {
    return <span className='text-blue-600'>{data}</span>;
  }

  if (typeof data === 'string') {
    return <span className='text-green-600'>"{data}"</span>;
  }

  if (Array.isArray(data)) {
    return (
      <div>
        <button
          onClick={() => setExpanded(!expanded)}
          className='text-blue-600 hover:underline font-mono text-sm'
        >
          {expanded ? '▼' : '▶'} [
        </button>
        {expanded && (
          <div className='ml-4 border-l border-gray-300 pl-2'>
            {data.map((item, idx) => (
              <div key={idx} className='text-xs font-mono'>
                <span className='text-gray-600'>{idx}:</span>{' '}
                <JsonTreeNode data={item} level={level + 1} />
              </div>
            ))}
          </div>
        )}
        <div className='font-mono text-sm'>]</div>
      </div>
    );
  }

  if (typeof data === 'object') {
    const entries = Object.entries(data);
    return (
      <div>
        <button
          onClick={() => setExpanded(!expanded)}
          className='text-blue-600 hover:underline font-mono text-sm'
        >
          {expanded ? '▼' : '▶'} {'{'}{' '}
        </button>
        {expanded && (
          <div className='ml-4 border-l border-gray-300 pl-2'>
            {entries.map(([key, value], idx) => (
              <div key={key} className='text-xs font-mono py-0.5'>
                <span className='text-purple-600'>"{key}"</span>
                <span className='text-gray-600'>: </span>
                <JsonTreeNode data={value} level={level + 1} />
                {idx < entries.length - 1 && <span className='text-gray-600'>,</span>}
              </div>
            ))}
          </div>
        )}
        <div className='font-mono text-sm'>{'}'}</div>
      </div>
    );
  }

  return <span>{String(data)}</span>;
};

export const ResponseViewer: React.FC<ResponseViewerProps> = ({ response, isLoading, error }) => {
  const [viewMode, setViewMode] = useState<'tree' | 'raw'>('tree');

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-72 bg-gradient-to-b from-gray-50 to-gray-100 rounded-xl border border-gray-200'>
        <div className='text-center space-y-4'>
          <div className='inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-100'>
            <div className='animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600'></div>
          </div>
          <p className='text-gray-600 font-medium text-base'>Loading response...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='bg-red-50 border-2 border-red-200 rounded-xl p-6 space-y-2'>
        <p className='text-red-900 font-bold text-base'>❌ Error</p>
        <p className='text-red-700 text-sm leading-relaxed'>{error}</p>
      </div>
    );
  }

  if (!response) {
    return (
      <div className='bg-gradient-to-b from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-12 text-center space-y-3'>
        <p className='text-gray-500 text-base font-medium'>
          Send a request to see the response here
        </p>
        <p className='text-gray-400 text-sm'>
          The response will be displayed in tree or raw JSON format
        </p>
      </div>
    );
  }

  return (
    <div className='bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm'>
      <div className='flex items-center justify-between bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200'>
        <div className='flex items-center gap-5'>
          <span className='text-base font-bold text-gray-700\'>Status Code:</span>
          <span
            className={`px-4 py-2 rounded-lg text-base font-bold ${
              response.status >= 200 && response.status < 300
                ? 'bg-green-100 text-green-800'
                : response.status >= 400
                  ? 'bg-red-100 text-red-800'
                  : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            {response.status} {response.statusText}
          </span>
        </div>
        <div className='flex gap-3'>
          <button
            onClick={() => setViewMode('tree')}
            className={`px-4 py-2 text-sm font-bold rounded-lg transition-all duration-150 ${
              viewMode === 'tree'
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            🌳 Tree
          </button>
          <button
            onClick={() => setViewMode('raw')}
            className={`px-4 py-2 text-sm font-bold rounded-lg transition-all duration-150 ${
              viewMode === 'raw'
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            📄 Raw
          </button>
        </div>
      </div>

      <div className='p-6 bg-gray-50 max-h-96 overflow-auto font-mono text-sm leading-relaxed'>
        {viewMode === 'tree' ? (
          <div className='text-gray-800 space-y-1'>
            <JsonTreeNode data={response.data} level={0} />
          </div>
        ) : (
          <pre className='text-gray-800 whitespace-pre-wrap break-words text-xs'>
            {JSON.stringify(response.data, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
};
