import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { SearchCustomerPage } from '../../features/customer/pages/SearchCustomerPage';

export const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path='/' element={<SearchCustomerPage />} />
          <Route path='/customer' element={<SearchCustomerPage />} />
          <Route path='/customer/search' element={<SearchCustomerPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
