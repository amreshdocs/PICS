import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { ActivityPage } from '../../features/activity/pages/ActivityPage';
import { CreateActivityPage } from '../../features/activity/pages/CreateActivityPage';
import { GetActivityPage } from '../../features/activity/pages/GetActivityPage';
import { UpdateActivityPage } from '../../features/activity/pages/UpdateActivityPage';
import { GetActivityWorkflowPage } from '../../features/activity/pages/GetActivityWorkflowPage';
import { GetLatestActivityPage } from '../../features/activity/pages/GetLatestActivityPage';
import { EventBridgePage } from '../../features/eventbridge/pages/EventBridgePage';
import { PaymentPage } from '../../features/payment/pages/PaymentPage';
import { SearchCustomerPage } from '../../features/customer/pages/SearchCustomerPage';
import { PaymentChannelPage } from '../../features/paymentchannel/pages/PaymentChannelPage';
import { GetRelatedAcctsPage } from '../../features/paymentchannel/pages/GetRelatedAcctsPage';
import { PaymentWorkflowPage } from '../../features/paymentworkflow/pages/PaymentWorkflowPage';
import { PolWebApiPage } from '../../features/polwebapi/pages/PolWebApiPage';
import { ScheduledTaskPage } from '../../features/scheduledtask/pages/ScheduledTaskPage';
import { SubscriptionPage } from '../../features/subscription/pages/SubscriptionPage';
import { WorkflowPage } from '../../features/workflow/pages/WorkflowPage';

export const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          {/* Activity Routes */}
          <Route path='/activity' element={<ActivityPage />} />
          <Route path='/activity/create' element={<CreateActivityPage />} />
          <Route path='/activity/get' element={<GetActivityPage />} />
          <Route path='/activity/update' element={<UpdateActivityPage />} />
          <Route path='/activity/workflow' element={<GetActivityWorkflowPage />} />
          <Route path='/activity/latest' element={<GetLatestActivityPage />} />

          {/* EventBridge Routes */}
          <Route path='/eventbridge' element={<EventBridgePage />} />
          <Route path='/eventbridge/scheduled-payment-trigger' element={<EventBridgePage />} />
          <Route path='/eventbridge/health' element={<EventBridgePage />} />
          <Route path='/eventbridge/metrics-daily' element={<EventBridgePage />} />
          <Route path='/eventbridge/summary-date' element={<EventBridgePage />} />

          {/* Payment Routes */}
          <Route path='/payment' element={<PaymentPage />} />
          <Route path='/payment/create' element={<PaymentPage />} />
          <Route path='/payment/get' element={<PaymentPage />} />
          <Route path='/payment/update' element={<PaymentPage />} />
          <Route path='/payment/workflow' element={<PaymentPage />} />
          <Route path='/payment/customer' element={<PaymentPage />} />

          {/* Customer Routes */}
          <Route path='/customer' element={<SearchCustomerPage />} />
          <Route path='/customer/search' element={<SearchCustomerPage />} />

          {/* PaymentChannel Routes */}
          <Route path='/payment-channel' element={<PaymentChannelPage />} />
          <Route path='/payment-channel/fund-transfer' element={<PaymentChannelPage />} />
          <Route path='/payment-channel/get-related-accts' element={<GetRelatedAcctsPage />} />
          <Route path='/payment-channel/daily-limit-retrieve' element={<PaymentChannelPage />} />

          {/* PaymentWorkflow Routes */}
          <Route path='/payment-workflow' element={<PaymentWorkflowPage />} />
          <Route path='/payment-workflow/create' element={<PaymentWorkflowPage />} />
          <Route path='/payment-workflow/status' element={<PaymentWorkflowPage />} />
          <Route path='/payment-workflow/trigger' element={<PaymentWorkflowPage />} />
          <Route path='/payment-workflow/debit-transfer' element={<PaymentWorkflowPage />} />
          <Route path='/payment-workflow/manual-review-resume' element={<PaymentWorkflowPage />} />
          <Route
            path='/payment-workflow/batch-transaction-complete'
            element={<PaymentWorkflowPage />}
          />
          <Route path='/payment-workflow/activities' element={<PaymentWorkflowPage />} />
          <Route path='/payment-workflow/customer' element={<PaymentWorkflowPage />} />
          <Route path='/payment-workflow/manual-review-queue' element={<PaymentWorkflowPage />} />

          {/* PolWebApi Routes */}
          <Route path='/pol-web-api' element={<PolWebApiPage />} />
          <Route path='/pol-web-api/health' element={<PolWebApiPage />} />

          {/* ScheduledTask Routes */}
          <Route path='/scheduled-task' element={<ScheduledTaskPage />} />
          <Route path='/scheduled-task/create' element={<ScheduledTaskPage />} />
          <Route path='/scheduled-task/get' element={<ScheduledTaskPage />} />
          <Route path='/scheduled-task/update' element={<ScheduledTaskPage />} />
          <Route path='/scheduled-task/subscription' element={<ScheduledTaskPage />} />
          <Route path='/scheduled-task/workflow' element={<ScheduledTaskPage />} />
          <Route path='/scheduled-task/date' element={<ScheduledTaskPage />} />

          {/* Subscription Routes */}
          <Route path='/subscription' element={<SubscriptionPage />} />
          <Route path='/subscription/create' element={<SubscriptionPage />} />
          <Route path='/subscription/get' element={<SubscriptionPage />} />
          <Route path='/subscription/update' element={<SubscriptionPage />} />
          <Route path='/subscription/customer' element={<SubscriptionPage />} />

          {/* Workflow Routes */}
          <Route path='/workflow' element={<WorkflowPage />} />
          <Route path='/workflow/create' element={<WorkflowPage />} />
          <Route path='/workflow/get' element={<WorkflowPage />} />
          <Route path='/workflow/update' element={<WorkflowPage />} />
          <Route path='/workflow/status' element={<WorkflowPage />} />

          <Route path='/' element={<ActivityPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
