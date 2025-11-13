import React from 'react';

interface MissingAccountsListProps {
  raw?: Record<string, unknown>;
}

export const MissingAccountsList: React.FC<MissingAccountsListProps> = ({ raw }) => {
  // Prefer explicit list if provided by API
  const explicit: Array<{ number?: string | number; product?: string }> | undefined = (raw &&
    (raw.MissingDocumentAccountList || raw.MissingAccounts)) as any;

  let items: Array<{ number: string | number; product: string }> = [];

  if (Array.isArray(explicit) && explicit.length > 0) {
    items = explicit.map((it: any) => ({
      number: it.number || it.AcctId || it.Acct || '-',
      product: it.product || it.StmtMktName || '',
    }));
  } else if (Array.isArray(raw?.RelatedAccounts)) {
    const related = raw!.RelatedAccounts as any[];
    // Heuristic fallback: treat accounts with LastStmtBal === 0 as missing documents
    items = related
      .filter(
        (r) =>
          r.DepAcct && (Number(r.DepAcct.LastStmtBal) === 0 || r.DepAcct.MissingDocument === true)
      )
      .slice(0, 10)
      .map((r) => ({ number: r.DepAcct.AcctId || '-', product: r.DepAcct.StmtMktName || '' }));
  }

  return (
    <aside className='bg-white border border-gray-200 rounded-lg shadow-sm p-4'>
      <div className='text-sm font-semibold text-sky-700 mb-3'>Missing Document Account List</div>
      {items.length === 0 ? (
        <div className='text-sm text-gray-600'>No missing documents found</div>
      ) : (
        <ul className='space-y-2'>
          {items.map((it, i) => (
            <li key={i} className='flex items-center justify-between bg-sky-50 rounded px-3 py-2'>
              <div className='text-sm font-medium text-sky-700'>{it.number}</div>
              <div className='text-sm text-gray-800'>{it.product}</div>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
};

export default MissingAccountsList;
