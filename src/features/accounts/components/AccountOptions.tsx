import React, { useState, useRef, useEffect } from 'react';

interface AccountOptionsProps {
  accountNumber: string | number;
  onDetails?: (accountNumber: string | number) => void;
  onTransactions?: (accountNumber: string | number) => void;
}

export const AccountOptions: React.FC<AccountOptionsProps> = ({
  accountNumber,
  onDetails,
  onTransactions,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (action: 'details' | 'transactions') => {
    setIsOpen(false);
    if (action === 'details' && onDetails) {
      onDetails(accountNumber);
    } else if (action === 'transactions' && onTransactions) {
      onTransactions(accountNumber);
    }
  };

  return (
    <div className='relative' ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='px-3 py-1 bg-white border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500'
      >
        {isOpen ? 'Open' : 'Select'}
      </button>
      {isOpen && (
        <div className='absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10'>
          <button
            onClick={() => handleSelect('details')}
            className='w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 focus:outline-none'
          >
            Details
          </button>
          <button
            onClick={() => handleSelect('transactions')}
            className='w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 focus:outline-none'
          >
            Transactions
          </button>
        </div>
      )}
    </div>
  );
};

export default AccountOptions;
