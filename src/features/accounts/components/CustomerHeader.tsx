import React from 'react';
import type { CustomerDemographics } from '@/features/customers/types/customer.types';

interface CustomerHeaderProps {
  customer: CustomerDemographics;
}

const formatDate = (dateString: string): string => {
  if (!dateString || dateString === '-') return '-';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
  } catch {
    return dateString;
  }
};

export const CustomerHeader: React.FC<CustomerHeaderProps> = ({ customer }) => {
  return (
    <div className='bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-6'>
      <h2 className='text-lg font-semibold text-gray-900 mb-4'>Customer Accounts</h2>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div>
          <label className='block text-xs font-medium text-gray-500 uppercase mb-1'>
            Customer Name
          </label>
          <div className='text-sm font-medium text-gray-900'>{customer.name}</div>
        </div>

        <div>
          <label className='block text-xs font-medium text-gray-500 uppercase mb-1'>
            Social Security / Tax ID
          </label>
          <div className='text-sm font-medium text-gray-900'>{customer.ssn}</div>
        </div>

        <div>
          <label className='block text-xs font-medium text-gray-500 uppercase mb-1'>
            Birth Date
          </label>
          <div className='text-sm font-medium text-gray-900'>
            {formatDate(customer.birthDateOrBusinessSince)}
          </div>
        </div>

        <div>
          <label className='block text-xs font-medium text-gray-500 uppercase mb-1'>
            Customer Since
          </label>
          <div className='text-sm font-medium text-gray-900'>
            {customer.customerSince
              ? formatDate(customer.customerSince)
              : customer.birthDateOrBusinessSince}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerHeader;
