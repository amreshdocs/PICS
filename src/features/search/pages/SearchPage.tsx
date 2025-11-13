import { useAppDispatch } from '@/app/store/hooks';
import { setSelectedCustomer } from '@/features/customers/store/customerSlice';
import type { Customer } from '@/features/customers/types/customer.types';
import {
  customersApi,
  type CustomerSearchResponse,
  type SearchType,
} from '@/features/search/services/customersApi';
import { showToast } from '@/shared/utils/toast';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface TableRow {
  [key: string]: unknown;
}

export const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchType, setSearchType] = useState<SearchType>('accountNumber');
  const [searchValue, setSearchValue] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<CustomerSearchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Listen for perform-search events dispatched by the top search bar
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as { q?: string; type?: SearchType } | undefined;
      if (!detail || !detail.q) return;
      const q = detail.q || '';
      const type = (detail.type as SearchType) || 'accountNumber';
      // set local state for visibility
      setSearchValue(q);
      setSearchType(type);
      performSearch(q, type, 1, pageSize);
    };

    window.addEventListener('perform-search', handler as EventListener);
    return () => window.removeEventListener('perform-search', handler as EventListener);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const performSearch = async (
    value: string,
    type: SearchType,
    page: number = 1,
    size: number = 10
  ) => {
    setIsSearching(true);
    setError(null);
    setResults(null);

    try {
      const endpointType: SearchType =
        type === 'ssn' || type === 'taxId' ? 'taxId' : type === 'cisNumber' ? 'cisNumber' : type;
      const data = await customersApi.search(value.trim(), endpointType, page, size);
      setResults(data);
      setCurrentPage(page);
      setPageSize(size);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred during search';
      setError(message);
      try {
        showToast(message, 3000);
      } catch {}
    } finally {
      setIsSearching(false);
      window.dispatchEvent(new CustomEvent('search-complete'));
    }
  };

  const handleSearch = async () => {
    if (!searchValue.trim()) {
      setError('Please enter a search value');
      return;
    }

    await performSearch(searchValue, searchType, 1, pageSize);
  };

  const handlePageChange = async (page: number) => {
    if (!searchValue.trim()) return;
    await performSearch(searchValue, searchType, page, pageSize);
  };

  const handlePageSizeChange = async (newPageSize: number) => {
    if (!searchValue.trim()) return;
    await performSearch(searchValue, searchType, 1, newPageSize);
  };

  const handleClear = () => {
    setSearchValue('');
    setSearchType('accountNumber');
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
    <section className='space-y-6 p-6 rounded'>
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
                  const handleRowClick = () => {
                    const customer: Customer = {
                      demographics: customerDetails,
                      raw: row as Record<string, unknown>,
                    };
                    dispatch(setSelectedCustomer(customer));
                    const id =
                      customerDetails.cisNumber && customerDetails.cisNumber.trim() !== ''
                        ? customerDetails.cisNumber
                        : 'unknown';
                    navigate(`/customers/${encodeURIComponent(id)}`);
                  };

                  return (
                    <tr
                      key={index}
                      onClick={handleRowClick}
                      className='hover:bg-gray-50 transition-colors duration-150 cursor-pointer'
                    >
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
        <div className='bg-white rounded-lg border border-gray-200 p-6 text-center'>
          <p className='text-gray-700 font-semibold text-sm'>No results found</p>
          <p className='text-gray-600 text-xs mt-1'>
            Try searching with different criteria using the top search bar
          </p>
        </div>
      )}
    </section>
  );
};

export default SearchPage;
