import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { HomePage } from '@/features/home/pages/HomePage';
import { SearchPage } from '@/features/search/pages/SearchPage';
import { CreateCustomerPage } from '@/features/createCustomer/pages/CreateCustomerPage';
import { OpenAccountPage } from '@/features/openAccount/pages/OpenAccountPage';
import { ToolsPage } from '@/features/tools/pages/ToolsPage';
import { AppsPage } from '@/features/apps/pages/AppsPage';
import { CustomerDetailPage } from '@/features/customers/pages/CustomerDetailPage';
import { AccountListPage } from '@/features/accounts/pages/AccountListPage';

export const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path='/' element={<HomePage />} />
          <Route path='/search' element={<SearchPage />} />
          <Route path='/create-customer' element={<CreateCustomerPage />} />
          <Route path='/open-account' element={<OpenAccountPage />} />
          <Route path='/tools' element={<ToolsPage />} />
          <Route path='/apps' element={<AppsPage />} />
          <Route path='/customers/:cisNumber' element={<CustomerDetailPage />} />
          <Route path='/accounts' element={<AccountListPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
