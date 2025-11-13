import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';

export const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const [searchType, setSearchType] = useState<string>('accountNumber');
  const [searchValue, setSearchValue] = useState<string>('');
  const [isSearching, setIsSearching] = useState(false);
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({
    message: '',
    visible: false,
  });

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    // Navigate to search page without exposing query params in URL
    navigate('/search');
    setIsSearching(true);
    // Dispatch a cross-window event to trigger the search on the SearchPage
    window.dispatchEvent(
      new CustomEvent('perform-search', { detail: { type: searchType, q: searchValue } })
    );
  };

  const handleReset = () => {
    setSearchValue('');
    setSearchType('accountNumber');
    navigate('/search');
  };

  React.useEffect(() => {
    const onToast = (e: Event) => {
      const detail = (e as CustomEvent).detail as { message: string; duration?: number };
      if (!detail) return;
      setToast({ message: detail.message, visible: true });
      const timeout = detail.duration ?? 3000;
      window.setTimeout(() => setToast((s) => ({ ...s, visible: false })), timeout);
    };

    const onSearchComplete = () => {
      setIsSearching(false);
    };

    window.addEventListener('app-toast', onToast as EventListener);
    window.addEventListener('search-complete', onSearchComplete as EventListener);
    return () => {
      window.removeEventListener('app-toast', onToast as EventListener);
      window.removeEventListener('search-complete', onSearchComplete as EventListener);
    };
  }, []);

  return (
    <div className='min-h-screen flex flex-col bg-gray-50'>
      {/* Top search bar only */}
      <header className='bg-blue-800 text-white'>
        <div className='max-w-7xl mx-auto px-4 py-2 flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <img src='/vite.svg' alt='Logo' className='w-8 h-8' />
            <div className='text-sm font-semibold'>POPULAR | PICS</div>
          </div>

          {/* Right side hidden for now */}
          <div className='hidden' aria-hidden='true'>
            <div className='text-sm'>User Info ▾</div>
          </div>
        </div>

        {/* Secondary menu nav */}
        <div className='bg-blue-600'>
          <div className='max-w-7xl mx-auto px-4'>
            <nav className='flex items-center gap-6 text-sm text-white py-2'>
              <Link to='/' className='hover:underline'>
                Home
              </Link>
              <Link to='/search' className='hover:underline'>
                Search
              </Link>
              <Link to='/create-customer' className='hover:underline'>
                Create Customer
              </Link>
              <Link to='/open-account' className='hover:underline'>
                Open Account
              </Link>
              <Link to='/tools' className='hover:underline'>
                Tools
              </Link>
              <Link to='/apps' className='hover:underline'>
                Apps
              </Link>
            </nav>
          </div>
        </div>

        {/* Show search bar only on search route */}
        {window.location.pathname === '/search' && (
          <div className='bg-blue-700 border-t border-blue-600'>
            <form
              onSubmit={handleSearch}
              className='max-w-7xl mx-auto px-4 py-3 flex items-center gap-3'
            >
              <label className='sr-only'>Search Filter</label>
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className='px-2 py-1 rounded border border-blue-500 text-sm bg-blue-50 text-gray-800'
              >
                <option value='accountNumber'>Account/Card Number</option>
                <option value='ssn'>Social Security/Tax Id</option>
                <option value='name'>Name</option>
                <option value='phone'>Telephone Number</option>
                <option value='cisNumber'>Customer CIS Number</option>
              </select>

              <input
                type='text'
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder='Enter search value'
                className='flex-1 px-3 py-1 text-sm rounded border border-blue-400'
              />

              <button
                type='submit'
                className='px-3 py-1 bg-white text-blue-700 rounded text-sm font-medium'
              >
                Search
              </button>
              <button
                type='button'
                onClick={handleReset}
                className='px-3 py-1 bg-blue-600 text-white rounded text-sm'
              >
                Reset
              </button>
            </form>
          </div>
        )}
      </header>

      <main className='flex-1 overflow-auto'>
        <div className='p-6 max-w-7xl mx-auto'>
          <Outlet />
        </div>
      </main>

      {/* Toast container (center bottom) */}
      <div
        aria-live='polite'
        className='pointer-events-none fixed inset-x-0 bottom-6 flex items-end justify-center z-[999]'
      >
        <div
          className={`max-w-md w-full px-4 transition-transform duration-200 ${toast.visible ? 'translate-y-0' : 'translate-y-6 opacity-0'}`}
        >
          <div className='pointer-events-auto bg-red-600 text-white px-4 py-3 rounded-md shadow-lg'>
            {toast.message}
          </div>
        </div>
      </div>
    </div>
  );
};
