import React, { useMemo, useState } from 'react';
import type {
  AccountDetails,
  SortConfig,
  FilterConfig,
} from '@/features/accounts/types/account.types';
import { AccountOptions } from './AccountOptions';

interface AccountsListTableProps {
  accounts: AccountDetails[];
  onAccountDetails?: (accountNumber: string | number) => void;
  onAccountTransactions?: (accountNumber: string | number) => void;
}

export const AccountsListTable: React.FC<AccountsListTableProps> = ({
  accounts,
  onAccountDetails,
  onAccountTransactions,
}) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: 'number',
    direction: 'asc',
  });
  const [filterConfig, setFilterConfig] = useState<FilterConfig>({});

  const getStatusLabel = (status: string): string => {
    const statusMap: Record<string, string> = {
      A: 'A / ACTIVE',
      ACTIVE: 'A / ACTIVE',
      C: 'C / CLOSED',
      CLOSED: 'C / CLOSED',
      N: 'N / INACTIVE',
      INACTIVE: 'N / INACTIVE',
      T: 'T',
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string): string => {
    const statusUpper = String(status).toUpperCase();
    if (statusUpper === 'A' || statusUpper === 'ACTIVE') {
      return 'text-green-700 bg-green-50';
    }
    if (statusUpper === 'C' || statusUpper === 'CLOSED') {
      return 'text-gray-500 bg-gray-50';
    }
    if (statusUpper === 'N' || statusUpper === 'INACTIVE') {
      return 'text-yellow-700 bg-yellow-50';
    }
    if (statusUpper === 'T') {
      return 'text-blue-700 bg-blue-50';
    }
    return 'text-gray-700 bg-gray-50';
  };

  const sortedAndFilteredAccounts = useMemo(() => {
    let filtered = accounts.filter((account) => {
      if (filterConfig.status && account.status !== filterConfig.status) {
        return false;
      }
      if (filterConfig.accountType && account.accountType !== filterConfig.accountType) {
        return false;
      }
      return true;
    });

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aVal = a[sortConfig.key!];
        const bVal = b[sortConfig.key!];

        let comparison = 0;

        if (typeof aVal === 'number' && typeof bVal === 'number') {
          comparison = aVal - bVal;
        } else if (typeof aVal === 'string' && typeof bVal === 'string') {
          comparison = aVal.localeCompare(bVal);
        }

        return sortConfig.direction === 'asc' ? comparison : -comparison;
      });
    }

    return filtered;
  }, [accounts, sortConfig, filterConfig]);

  const handleSort = (key: keyof AccountDetails) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const sortableColumns: (keyof AccountDetails)[] = ['number', 'bank', 'product'];

  const formatCurrency = (value: number | null): string => {
    if (value === null) return '$0.00';
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  };

  const renderSortIndicator = (column: keyof AccountDetails) => {
    if (sortConfig.key !== column) return null;
    return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
  };

  if (accounts.length === 0) {
    return (
      <div className='bg-white border border-gray-200 rounded-lg shadow-sm p-6'>
        <div className='text-center text-sm text-gray-600'>No accounts found for this customer</div>
      </div>
    );
  }

  return (
    <div className='bg-white border border-gray-200 rounded-lg shadow-sm'>
      <div className='px-6 py-4 border-b border-gray-100'>
        <h3 className='text-base font-semibold text-gray-900'>Accounts List</h3>
      </div>

      <div className='overflow-x-auto'>
        <table className='w-full'>
          <thead className='bg-gray-50 border-b border-gray-200 sticky top-0'>
            <tr>
              <th
                className='px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100'
                onClick={() => handleSort('number')}
              >
                Account Number{renderSortIndicator('number')}
              </th>
              <th
                className='px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100'
                onClick={() => handleSort('bank')}
              >
                Bank{renderSortIndicator('bank')}
              </th>
              <th
                className='px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100'
                onClick={() => handleSort('product')}
              >
                Product{renderSortIndicator('product')}
              </th>
              <th className='px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider'>
                Book/Note Balance
              </th>
              <th className='px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider'>
                Avail/Current Balance
              </th>
              <th className='px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'>
                Status
              </th>
              <th className='px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'>
                Relationship
              </th>
              <th className='px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'>
                Account Type
              </th>
              <th className='px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider'>
                Account Options
              </th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-200'>
            {sortedAndFilteredAccounts.map((account, index) => (
              <tr key={index} className='even:bg-gray-50 hover:bg-blue-50 transition-colors'>
                <td className='px-6 py-4 text-sm font-medium text-gray-900'>{account.number}</td>
                <td className='px-6 py-4 text-sm text-gray-700'>{account.bank}</td>
                <td className='px-6 py-4 text-sm text-gray-700'>{account.product}</td>
                <td className='px-6 py-4 text-sm text-right text-gray-900 font-medium'>
                  {formatCurrency(account.bookBalance)}
                </td>
                <td className='px-6 py-4 text-sm text-right text-gray-900 font-medium'>
                  {formatCurrency(account.availableBalance)}
                </td>
                <td className='px-6 py-4 text-sm'>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(account.status)}`}
                  >
                    {getStatusLabel(account.status)}
                  </span>
                </td>
                <td className='px-6 py-4 text-sm text-gray-700'>{account.relationship}</td>
                <td className='px-6 py-4 text-sm text-gray-700'>{account.accountType}</td>
                <td className='px-6 py-4 text-sm text-center'>
                  <AccountOptions
                    accountNumber={account.number}
                    onDetails={onAccountDetails}
                    onTransactions={onAccountTransactions}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AccountsListTable;
