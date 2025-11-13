import React from 'react';
import { formatCurrency } from '@/shared/utils';

interface AccountsSummaryProps {
  raw?: Record<string, unknown>;
}

export const AccountsSummary: React.FC<AccountsSummaryProps> = ({ raw }) => {
  return (
    <div className='mt-6 grid grid-cols-2 gap-4'>
      <div className='bg-white border border-gray-200 rounded shadow-sm'>
        <div className='px-4 py-3 border-b border-gray-100'>
          <div className='text-sm font-semibold text-sky-700'>Assets</div>
        </div>
        <div className='p-4'>{renderAccounts(raw, 'asset')}</div>
      </div>

      <div className='bg-white border border-gray-200 rounded shadow-sm'>
        <div className='px-4 py-3 border-b border-gray-100'>
          <div className='text-sm font-semibold text-sky-700'>Liabilities</div>
        </div>
        <div className='p-4'>{renderAccounts(raw, 'liability')}</div>
      </div>
    </div>
  );
};

const renderAccounts = (raw?: Record<string, unknown>, type: 'asset' | 'liability' = 'asset') => {
  if (!raw || !Array.isArray(raw.RelatedAccounts)) {
    return <div className='text-sm text-gray-600'>No accounts found</div>;
  }

  const related = raw.RelatedAccounts as any[];

  const items = related
    .map((r) => {
      // Determine common fields
      const acctType =
        r.AcctType ||
        (r.DepAcct
          ? 'DP'
          : r.CardAcct
            ? 'CBM'
            : r.LoanAcct
              ? 'LN'
              : r.ExternalAcct
                ? 'XACCT'
                : 'OTHER');

      if (r.DepAcct) {
        return {
          title: r.DepAcct.StmtMktName || `${r.DepAcct.AcctId || ''}`,
          book: r.DepAcct.LastStmtBal ?? null,
          available: r.DepAcct.CashAvail ?? null,
          kind: 'asset',
          acctType,
        };
      }

      if (r.CardAcct) {
        return {
          title: `Card ${r.CardAcct.CardNum || ''}`,
          book: null,
          available: null,
          kind: 'asset',
          acctType,
        };
      }

      if (r.LoanAcct) {
        return {
          title: `Loan ${r.LoanAcct.AcctId || ''}`,
          book: r.LoanAcct.LastStmtBal ?? null,
          available: null,
          kind: 'liability',
          acctType,
        };
      }

      if (r.ExternalAcct) {
        return {
          title: `External ${r.ExternalAcct.ExternalAcctId || r.ExternalAcct.AcctId || ''}`,
          book: null,
          available: null,
          kind: 'asset',
          acctType,
        };
      }

      return null;
    })
    .filter(Boolean)
    .filter((it) => (type === 'asset' ? it!.kind === 'asset' : it!.kind === 'liability')) as {
    title: string;
    book: number | string | null;
    available: number | string | null;
    acctType: string;
  }[];

  if (items.length === 0) return <div className='text-sm text-gray-600'>No accounts found</div>;

  // group by acctType + title so we can show counts per account type + product
  const groupedMap: Record<
    string,
    { title: string; acctType: string; book: number; available: number; count: number }
  > = {};
  items.forEach((it) => {
    const key = `${it.acctType}::${it.title || 'Other'}`;
    if (!groupedMap[key])
      groupedMap[key] = {
        title: it.title || 'Other',
        acctType: it.acctType || 'UNK',
        book: 0,
        available: 0,
        count: 0,
      };
    groupedMap[key].book += Number(it.book) || 0;
    groupedMap[key].available += Number(it.available) || 0;
    groupedMap[key].count += 1;
  });

  const groups = Object.values(groupedMap);

  if (groups.length === 0) return <div className='text-sm text-gray-600'>No accounts found</div>;

  const getDisplay = (acctType: string, title: string) => {
    const t = String(acctType || '').toUpperCase();
    const name = String(title || '');

    // human-friendly mapping heuristics
    if (t === 'CBM') return { code: '4 CCA'.split(' ')[1] ? 'CCA' : 'CCA', label: 'Card' };
    if (t === 'LN') return { code: 'MLA', label: 'Loan' };
    if (t === 'XACCT') return { code: 'XACCT', label: 'External' };

    // Default for deposit-like accounts
    // Detect checking/savings/money market from product name
    const n = name.toUpperCase();
    if (n.includes('CHECK')) return { code: 'IDA', label: 'Checking' };
    if (n.includes('SAV')) return { code: 'IDA', label: 'Savings' };
    if (n.includes('MM') || n.includes('MONEY')) return { code: 'IDA', label: 'Money Market' };

    // fallback use first word as label
    const first = name.split(/\s+/)[0] || name;
    return { code: t || 'UNK', label: first || name };
  };

  return (
    <div className='space-y-3'>
      {groups.map((g, i) => {
        const d = getDisplay(g.acctType, g.title);
        const header = `${g.count} ${d.code} / ${d.label}`;
        return (
          <div key={i} className='border border-gray-100 rounded'>
            <div className='px-3 py-2 bg-gray-50 text-sm font-bold text-gray-700 text-center'>
              {header}
            </div>
            <div className='px-3 py-2 text-sm text-gray-700 flex justify-between'>
              <div>Book</div>
              <div className='font-semibold'>{formatCurrency(g.book)}</div>
            </div>
            <div className='px-3 py-2 text-sm text-gray-700 flex justify-between border-t border-gray-100'>
              <div>Available</div>
              <div className='font-semibold'>{formatCurrency(g.available)}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const formatCurrency = (value: number | string | null) => {
  const num = Number(value) || 0;
  return num.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};

export default AccountsSummary;
