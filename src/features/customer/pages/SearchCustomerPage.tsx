import React, { useState } from 'react';
import { customerApi, type SearchType, type CustomerSearchResponse } from '../services/customerApi';

interface TableRow {
  [key: string]: unknown;
}

export const SearchCustomerPage: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<CustomerSearchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleSearch = async () => {
    if (!searchValue.trim()) {
      setError('Please enter a Tax ID');
      return;
    }

    setIsSearching(true);
    setError(null);
    setResults(null);
    setCurrentPage(1);

    try {
      const data = await customerApi.search(searchValue.trim(), 'taxId', 1, pageSize);
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during search');
    } finally {
      setIsSearching(false);
    }
  };

  const handlePageChange = async (page: number) => {
    if (!searchValue.trim()) return;

    setIsSearching(true);
    setError(null);

    try {
      const data = await customerApi.search(searchValue.trim(), 'taxId', page, pageSize);
      setResults(data);
      setCurrentPage(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during search');
    } finally {
      setIsSearching(false);
    }
  };

  const handlePageSizeChange = async (newPageSize: number) => {
    if (!searchValue.trim()) return;

    setIsSearching(true);
    setError(null);

    try {
      const data = await customerApi.search(searchValue.trim(), 'taxId', 1, newPageSize);
      setResults(data);
      setPageSize(newPageSize);
      setCurrentPage(1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during search');
    } finally {
      setIsSearching(false);
    }
  };

  const handleClear = () => {
    setSearchValue('');
    setResults(null);
    setError(null);
    setCurrentPage(1);
  };

  interface CustomerDetail {
    name: string;
    address: string;
    birthDateOrBusinessSince: string;
    ssn: string;
    phone: string;
    email: string;
    cisNumber: string;
  }

  const formatPhoneNumber = (phone: string | number): string => {
    const cleaned = String(phone).replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return String(phone);
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  const extractCustomerDetails = (data: Record<string, unknown>): CustomerDetail => {
    return {
      name: `${data.FirstName || ''} ${data.LastName || ''}`.trim() || '-',
      address: `${data.Addr1 || ''} ${data.Addr2 || ''}`.trim() || '-',
      birthDateOrBusinessSince: formatDate(String(data.BirthDt || '')),
      ssn: String(data.TaxId || '') || '-',
      phone: data.PrimaryPhoneNum ? formatPhoneNumber(String(data.PrimaryPhoneNum)) : '-',
      email: String(data.EmailAddr || '').toLowerCase() || '-',
      cisNumber: String(data.CustPermId || '') || '-',
    };
  };

  const getCustomerTableColumns = (): (keyof CustomerDetail)[] => [
    'name',
    'address',
    'birthDateOrBusinessSince',
    'ssn',
    'phone',
    'email',
    'cisNumber',
  ];

  const formatColumnHeader = (columnKey: string): string => {
    const headerMap: Record<string, string> = {
      name: 'Name',
      address: 'Address',
      birthDateOrBusinessSince: 'Birth Date / Business Since',
      ssn: 'Social Security / Tax ID',
      phone: 'Phone Number',
      email: 'Email Address',
      cisNumber: 'CIS Number',
    };
    return headerMap[columnKey] || columnKey;
  };

  return (
    <section className='space-y-6'>
      <div className='pb-2'>
        <h1 className='text-3xl font-bold text-gray-900'>Search Customer</h1>
        <p className='text-gray-600 text-sm mt-1'>
          Find customer information by various search criteria
        </p>
      </div>

      <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
        {/* Search Input */}
        <div className='flex flex-col gap-2'>
          <label className='block text-sm font-medium text-gray-700'>Tax ID</label>
          <input
            type='text'
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder='Enter tax ID'
            className='w-full max-w-md px-4 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
          />
        </div>

        {/* Action Buttons */}
        <div className='flex gap-3 mt-6 pt-1'>
          <button
            onClick={handleSearch}
            disabled={isSearching}
            className='px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 active:bg-blue-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md'
          >
            {isSearching ? 'Searching...' : 'Search'}
          </button>
          <button
            onClick={handleClear}
            className='px-6 py-2.5 bg-gray-100 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 active:bg-gray-300 transition-all duration-200'
          >
            Reset
          </button>
        </div>

        {/* Error Block */}
        {error && (
          <div className='mt-6 p-4 bg-red-50 border border-red-200 rounded-md'>
            <p className='text-red-700 text-sm font-semibold'>❌ Error</p>
            <p className='text-red-600 text-xs mt-1'>{error}</p>
          </div>
        )}
      </div>

      {/* Results Table */}
      {results && results.data.length > 0 && (
        <div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
          <div className='overflow-x-auto'>
            <table className='w-full border-collapse'>
              <thead className='bg-gray-50 border-b border-gray-200'>
                <tr>
                  {getCustomerTableColumns().map((column) => (
                    <th
                      key={column}
                      className='px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap'
                    >
                      {formatColumnHeader(column)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-100'>
                {results.data.map((row: TableRow, index: number) => {
                  const customerDetails = extractCustomerDetails(row);
                  return (
                    <tr key={index} className='hover:bg-gray-50 transition-colors duration-150'>
                      {getCustomerTableColumns().map((column) => (
                        <td
                          key={`${index}-${column}`}
                          className='px-6 py-3.5 text-sm text-gray-700 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs'
                        >
                          {customerDetails[column]}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className='px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between gap-6 flex-wrap max-sm:gap-4'>
            <div className='flex items-center gap-3'>
              <label className='text-sm font-medium text-gray-700'>Rows per page:</label>
              <select
                value={pageSize}
                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                className='px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>

            <div className='text-sm text-gray-600'>
              Page {currentPage} of {results.totalPages || 1} (Total: {results.total} results)
            </div>

            <div className='flex gap-2'>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || isSearching}
                className='px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 active:bg-gray-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-all duration-200'
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= (results.totalPages || 1) || isSearching}
                className='px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 active:bg-gray-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-all duration-200'
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* No Results */}
      {results && results.data.length === 0 && !isSearching && (
        <div className='bg-blue-50 border border-blue-200 rounded-md p-6 text-center'>
          <p className='text-blue-700 font-semibold text-sm'>No results found</p>
          <p className='text-blue-600 text-xs mt-1'>Try searching with different criteria</p>
        </div>
      )}
    </section>
  );
};

export default SearchCustomerPage;
