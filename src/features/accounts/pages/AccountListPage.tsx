import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/app/store/hooks';
import type { AccountDetails } from '@/features/accounts/types/account.types';
import { CustomerHeader } from '@/features/accounts/components/CustomerHeader';
import { AccountsListTable } from '@/features/accounts/components/AccountsListTable';
import { showToast } from '@/shared/utils/toast';

export const AccountListPage: React.FC = () => {
  const navigate = useNavigate();
  const selected = useAppSelector((s) => s.customers?.selected ?? null);

  const accounts: AccountDetails[] = useMemo(() => {
    if (!selected?.raw) return [];

    const related = Array.isArray(selected.raw.RelatedAccounts) ? selected.raw.RelatedAccounts : [];

    return related
      .map((r: any) => {
        if (r.DepAcct) {
          return {
            number: r.DepAcct.AcctId ?? '',
            bank: '001',
            product: r.DepAcct.StmtMktName || 'Deposit Account',
            bookBalance: r.DepAcct.LastStmtBal ?? null,
            availableBalance: r.DepAcct.CashAvail ?? null,
            status: r.DepAcct.Status || 'A',
            relationship: r.DepAcct.DepositRelationCode === '0' ? 'JOINT OR' : 'SOLE OWNER',
            accountType: 'IDA',
            productType: 'DepositAccount',
            acctType: r.AcctType || 'DP',
          };
        }

        if (r.CardAcct) {
          return {
            number: r.CardAcct.CardNum ?? '',
            bank: '001',
            product: 'Card Account',
            bookBalance: null,
            availableBalance: null,
            status: r.CardAcct.Status || 'A',
            relationship: 'CARDHOLDER',
            accountType: 'CCA',
            productType: 'CardAccount',
            acctType: r.AcctType || 'CBM',
          };
        }

        if (r.LoanAcct) {
          return {
            number: r.LoanAcct.AcctId ?? '',
            bank: '001',
            product: 'Loan Account',
            bookBalance: r.LoanAcct.LastPmtAmt ?? null,
            availableBalance: null,
            status: r.LoanAcct.Status || 'A',
            relationship: 'PRIMARY BORROWER',
            accountType: 'MLA',
            productType: 'LoanAccount',
            acctType: r.AcctType || 'LN',
          };
        }

        if (r.ExternalAcct) {
          return {
            number: r.ExternalAcct.ExternalAcctId || r.ExternalAcct.AcctId || '',
            bank: '001',
            product: 'External Account',
            bookBalance: null,
            availableBalance: null,
            status: r.ExternalAcct.Status || 'A',
            relationship: 'EXTERNAL',
            accountType: 'XACCT',
            productType: 'ExternalAccount',
            acctType: r.AcctType || 'XACCT',
          };
        }

        return null;
      })
      .filter((a: AccountDetails | null): a is AccountDetails => a !== null);
  }, [selected?.raw]);

  const handleAccountDetails = (accountNumber: string | number) => {
    showToast(`Navigating to details for account ${accountNumber}`);
    // This will be extended in the future when the account details page is created
    // navigate(`/accounts/${accountNumber}`);
  };

  const handleAccountTransactions = (accountNumber: string | number) => {
    showToast(`Opening transactions for account ${accountNumber}`);
    // This will be extended in the future when the account transactions page is created
    // navigate(`/accounts/${accountNumber}/transactions`);
  };

  if (!selected) {
    return (
      <div className='bg-white border border-gray-200 rounded-lg shadow-sm p-6'>
        <div className='mb-4 text-sm text-gray-700'>
          No customer selected. Please search for a customer first.
        </div>
        <button
          onClick={() => navigate('/search')}
          className='px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
        >
          Go to Search
        </button>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <CustomerHeader customer={selected.demographics} />
      <AccountsListTable
        accounts={accounts}
        onAccountDetails={handleAccountDetails}
        onAccountTransactions={handleAccountTransactions}
      />
    </div>
  );
};

export default AccountListPage;
