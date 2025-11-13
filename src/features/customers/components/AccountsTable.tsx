import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '@/shared/utils';

interface AccountsTableProps {
  raw?: Record<string, unknown>;
}

const ACCOUNT_DISPLAY_LIMIT = 5;

export const AccountsTable: React.FC<AccountsTableProps> = ({ raw }) => {
  const navigate = useNavigate();
  const related = Array.isArray(raw?.RelatedAccounts) ? (raw!.RelatedAccounts as any[]) : [];

  const mapAcctTypeCode = (acctType?: string) => {
    const t = String(acctType || '').toUpperCase();
    if (t === 'DP' || t === 'D') return 'IDA';
    if (t === 'CBM') return 'CCA';
    if (t === 'LN') return 'MLA';
    if (t === 'XACCT') return 'XACCT';
    return t || 'UNK';
  };

  const rows = related
    .map((r) => {
      if (r.DepAcct) {
        const acctCode = mapAcctTypeCode(r.AcctType || r.DepAcct.AcctType || r.DepAcct.Category);
        const productName = r.DepAcct.StmtMktName || `Acct ${r.DepAcct.AcctId || ''}`;
        const productFull = `${productName} - ${acctCode} - DepositAccount`;
        return {
          number: r.DepAcct.AcctId ?? '',
          product: productFull,
          shortProduct: productName,
          productType: 'DepositAccount',
          acctType: r.AcctType || 'DP',
          balance: r.DepAcct.LastStmtBal ?? 0,
          available: r.DepAcct.CashAvail ?? 0,
          status: (r.DepAcct.Status && String(r.DepAcct.Status)) || 'ACTIVE',
        };
      }

      if (r.CardAcct) {
        const acctCode = mapAcctTypeCode(r.AcctType || 'CBM');
        const productName = `Card ${r.CardAcct.CardNum || ''}`;
        const productFull = `${productName} - ${acctCode} - CardAccount`;
        return {
          number: r.CardAcct.CardNum ?? '',
          product: productFull,
          shortProduct: productName,
          productType: 'CardAccount',
          acctType: r.AcctType || 'CBM',
          balance: null,
          available: null,
          status: (r.CardAcct.Status && String(r.CardAcct.Status)) || 'ACTIVE',
        };
      }

      if (r.LoanAcct) {
        const acctCode = mapAcctTypeCode(r.AcctType || 'LN');
        const productName = `Loan ${r.LoanAcct.AcctId || ''}`;
        const productFull = `${productName} - ${acctCode} - LoanAccount`;
        return {
          number: r.LoanAcct.AcctId ?? '',
          product: productFull,
          shortProduct: productName,
          productType: 'LoanAccount',
          acctType: r.AcctType || 'LN',
          balance: r.LoanAcct.LastStmtBal ?? 0,
          available: null,
          status: (r.LoanAcct.Status && String(r.LoanAcct.Status)) || 'ACTIVE',
        };
      }

      if (r.ExternalAcct) {
        const acctCode = mapAcctTypeCode(r.AcctType || 'XACCT');
        const id = r.ExternalAcct.ExternalAcctId || r.ExternalAcct.AcctId || '';
        const productName = `External ${id}`;
        const productFull = `${productName} - ${acctCode} - ExternalAccount`;
        return {
          number: id,
          product: productFull,
          shortProduct: productName,
          productType: 'ExternalAccount',
          acctType: r.AcctType || 'XACCT',
          balance: null,
          available: null,
          status: (r.ExternalAcct.Status && String(r.ExternalAcct.Status)) || 'ACTIVE',
        };
      }

      return null;
    })
    .filter(Boolean) as Array<{
    number: string | number;
    product: string;
    shortProduct?: string;
    productType?: string;
    acctType?: string;
    balance: number | string | null;
    available: number | string | null;
    status: string;
  }>;

  if (rows.length === 0) {
    return <div className='text-sm text-gray-600'>No account information available</div>;
  }

  const hasMoreAccounts = rows.length > ACCOUNT_DISPLAY_LIMIT;
  const displayedRows = rows.slice(0, ACCOUNT_DISPLAY_LIMIT);

  const formatCurrency = (val: number | string | null) => {
    const num = Number(val);
    if (Number.isNaN(num)) return '-';
    return num.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  };

  return (
    <div className='mt-6 bg-white border border-gray-200 rounded-lg shadow-sm overflow-x-auto'>
      <div className='px-4 py-3 border-b border-gray-100 flex items-center justify-between'>
        <h4 className='text-sm font-semibold text-gray-700'>Accounts</h4>
        {hasMoreAccounts && (
          <span className='text-xs text-gray-600'>
            Showing {ACCOUNT_DISPLAY_LIMIT} of {rows.length}
          </span>
        )}
      </div>
      <table className='w-full table-auto'>
        <thead className='bg-gray-50 text-xs text-gray-600'>
          <tr>
            <th className='px-4 py-2 text-left'>Number</th>
            <th className='px-4 py-2 text-left'>Product</th>
            <th className='px-4 py-2 text-right'>Balance</th>
            <th className='px-4 py-2 text-right'>Available Funds</th>
            <th className='px-4 py-2 text-left'>Status</th>
            <th className='px-4 py-2 text-left'>General Notes</th>
            <th className='px-4 py-2 text-left'>Signature</th>
          </tr>
        </thead>
        <tbody className='text-sm text-gray-700'>
          {displayedRows.map((r, i) => (
            <tr key={i} className='even:bg-gray-50'>
              <td className='px-4 py-3 break-words max-w-[160px]'>{r.number}</td>
              <td className='px-4 py-3'>
                <div className='text-sm font-medium text-gray-900'>
                  {r.shortProduct ?? r.product}
                </div>
                <div className='text-xs text-gray-600 mt-1'>{r.product}</div>
              </td>
              <td className='px-4 py-3 text-right'>
                {r.balance !== null ? formatCurrency(r.balance) : '-'}
              </td>
              <td className='px-4 py-3 text-right'>
                {r.available !== null ? formatCurrency(r.available) : '-'}
              </td>
              <td className='px-4 py-3'>
                <span
                  className={`px-2 py-0.5 rounded text-sm font-medium ${r.status === 'ACTIVE' ? 'text-green-700 bg-green-50' : r.status === 'CLOSED' ? 'text-gray-500 bg-gray-50' : 'text-yellow-700 bg-yellow-50'}`}
                >
                  {r.status}
                </span>
              </td>
              <td className='px-4 py-3'>-</td>
              <td className='px-4 py-3'>
                <button className='px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700'>
                  View Signature
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {hasMoreAccounts && (
        <div className='px-4 py-4 border-t border-gray-100 flex justify-center'>
          <button
            onClick={() => navigate('/accounts')}
            className='px-6 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
          >
            View All Accounts
          </button>
        </div>
      )}
    </div>
  );
};

export default AccountsTable;
