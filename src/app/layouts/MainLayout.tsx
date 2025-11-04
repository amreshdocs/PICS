import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';

export const MainLayout: React.FC = () => {
  return (
    <div className='flex h-screen bg-gradient-to-br from-gray-50 to-gray-100'>
      <Sidebar />
      <main className='flex-1 overflow-auto'>
        <div className='p-8 max-w-7xl mx-auto'>
          <Outlet />
        </div>
      </main>
    </div>
  );
};
