import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { setSelectedCustomer } from '@/features/customers/store/customerSlice';
import type { Customer, CustomerDemographics } from '@/features/customers/types/customer.types';
import { customersApi, type SearchType } from '@/features/search/services/customersApi';
import { DemographicsSection } from '@/features/customers/components/DemographicsSection';
import AccountsSummary from '@/features/customers/components/AccountsSummary';
import AccountsTable from '@/features/customers/components/AccountsTable';
import MissingAccountsList from '@/features/customers/components/MissingAccountsList';
import { showToast } from '@/shared/utils/toast';

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
    return date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
  } catch {
    return dateString;
  }
};

const extractCustomerDetails = (data: Record<string, unknown>): CustomerDemographics => {
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

export const CustomerDetailPage: React.FC = () => {
  const { cisNumber } = useParams<{ cisNumber: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const selected = useAppSelector((s) => s.customers?.selected ?? null);
  const [loading, setLoading] = useState(false);

  const demographics: CustomerDemographics | null = useMemo(() => {
    if (!selected) return null;
    return selected.demographics;
  }, [selected]);

  useEffect(() => {
    const needFetch = !selected || (cisNumber && selected.demographics.cisNumber !== cisNumber);
    if (!cisNumber && !selected) return;

    if (needFetch && cisNumber) {
      const run = async () => {
        setLoading(true);
        try {
          const data = await customersApi.search(cisNumber, 'cisNumber' as SearchType, 1, 1);
          const first =
            data.data && data.data.length > 0 ? (data.data[0] as Record<string, unknown>) : null;
          if (first) {
            const demo = extractCustomerDetails(first);
            const customer: Customer = { demographics: demo, raw: first };
            dispatch(setSelectedCustomer(customer));
          } else {
            showToast('Customer not found');
          }
        } catch (err) {
          const msg = err instanceof Error ? err.message : 'Failed to load customer';
          showToast(msg);
        } finally {
          setLoading(false);
        }
      };
      run();
    }
  }, [cisNumber, selected, dispatch]);

  if (!demographics && !loading) {
    return (
      <div className='space-y-4'>
        <div className='text-sm text-gray-700'>No customer selected.</div>
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
    <div className='grid grid-cols-12 gap-6'>
      <div className='col-span-12 max-lg:col-span-12 lg:col-span-8'>
        {demographics && (
          <DemographicsSection data={demographics} raw={selected?.raw ?? undefined} />
        )}
        {loading && <div className='mt-4 text-sm text-gray-600'>Loading latest customer data…</div>}

        {/* Accounts Summary (assets & liabilities) outside of Demographics card */}
        <div className='mt-6'>
          <AccountsSummary raw={selected?.raw ?? undefined} />
        </div>

        {/* Detailed accounts table */}
        <div className='mt-6'>
          <AccountsTable raw={selected?.raw ?? undefined} />
        </div>
      </div>

      {/* Right column: missing accounts list */}
      <div className='col-span-12 lg:col-span-4'>
        <MissingAccountsList raw={selected?.raw ?? undefined} />
      </div>
    </div>
  );
};

export default CustomerDetailPage;
