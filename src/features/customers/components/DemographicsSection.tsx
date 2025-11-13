import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { CustomerDemographics } from '@/features/customers/types/customer.types';

interface DemographicsSectionProps {
  data: CustomerDemographics;
  raw?: Record<string, unknown>;
}

export const DemographicsSection: React.FC<DemographicsSectionProps> = ({ data, raw }) => {
  const SmallLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className='text-xs font-medium text-sky-700 uppercase tracking-wide'>{children}</div>
  );

  const Value: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className='text-sm text-gray-800'>{children || '-'}</div>
  );
  const navigate = useNavigate();

  // Map CustCodes from raw payload (flattened from data.Customer.CustCodes)
  const codes: string[] = (() => {
    const custCodes = raw?.CustCodes as Record<string, unknown> | undefined;
    if (!custCodes) return [];

    return Object.entries(custCodes)
      .filter(([, v]) => v && String(v).trim() !== '0' && String(v).trim() !== '')
      .map(([k, v]) => `${k} - ${v}`);
  })();

  return (
    <section className='bg-white border border-gray-200 rounded-lg shadow-sm'>
      <div className='px-5 py-3 border-b border-gray-200'>
        <h3 className='text-sm font-semibold text-gray-700'>Demographic Information</h3>
      </div>

      {/* Header: Name + SSN and action */}
      <div className='px-5 py-4 flex items-start justify-between gap-4'>
        <div>
          <div className='text-lg font-bold text-gray-900'>
            {data.name}
            {data.ssn ? (
              <span className='text-sm font-normal text-gray-600'> ( {data.ssn} )</span>
            ) : null}
          </div>
        </div>

        <div className='ml-auto'>
          <button
            onClick={() => navigate(`/open-account?cisNumber=${data.cisNumber}`)}
            className='px-3 py-1 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700'
          >
            Open Account
          </button>
        </div>
      </div>

      <div className='px-5 pb-5'>
        <div className='grid grid-cols-3 gap-4'>
          <div className='space-y-3'>
            <SmallLabel>Customer CIS Number</SmallLabel>
            <Value>{data.cisNumber}</Value>
          </div>

          <div className='space-y-3'>
            <SmallLabel>Tax Id</SmallLabel>
            <Value>{data.ssn}</Value>
          </div>

          <div className='space-y-3'>
            <SmallLabel>Customer Since</SmallLabel>
            <Value>{data.customerSince ?? '-'}</Value>
          </div>

          <div className='space-y-3'>
            <SmallLabel>Email</SmallLabel>
            <Value>{data.email}</Value>
          </div>

          <div className='space-y-3'>
            <SmallLabel>Primary Phone</SmallLabel>
            <Value>{data.phone}</Value>
          </div>

          <div className='space-y-3'>
            <SmallLabel>Secondary Phone</SmallLabel>
            <Value>{data.secondaryPhone ?? '-'}</Value>
          </div>

          <div className='space-y-3'>
            <SmallLabel>Business Phone</SmallLabel>
            <Value>{data.businessPhone ?? '-'}</Value>
          </div>

          <div className='space-y-3'>
            <SmallLabel>Birth Date</SmallLabel>
            <Value>{data.birthDateOrBusinessSince}</Value>
          </div>

          <div className='space-y-3'>
            <SmallLabel>Marital Status</SmallLabel>
            <Value>{data.maritalStatus ?? '-'}</Value>
          </div>

          <div className='space-y-3'>
            <SmallLabel>Gender</SmallLabel>
            <Value>{data.gender ?? '-'}</Value>
          </div>

          <div className='space-y-3 col-span-2'>
            <SmallLabel>Occupation</SmallLabel>
            <Value>{data.occupation ?? '-'}</Value>
          </div>

          <div className='space-y-3 col-span-1'>
            <SmallLabel>Employer / School Name</SmallLabel>
            <Value>{data.employer ?? '-'}</Value>
          </div>
        </div>

        {/* Residential Address and Customer Codes boxes */}
        <div className='mt-5 grid grid-cols-2 gap-4'>
          <div className='bg-gray-50 border border-gray-200 rounded p-4'>
            <div className='text-xs font-semibold text-gray-600 mb-2'>Residential Address</div>
            <div className='text-sm text-gray-800'>{data.address || '-'}</div>
          </div>

          <div className='bg-gray-50 border border-gray-200 rounded p-4'>
            <div className='text-xs font-semibold text-gray-600 mb-2'>Customer Codes</div>
            {codes.length === 0 ? (
              <div className='text-sm text-gray-600'>No customer codes</div>
            ) : (
              <ul className='text-sm text-gray-800 list-disc list-inside space-y-1'>
                {codes.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DemographicsSection;
