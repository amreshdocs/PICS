import type { ApiEndpoint } from '../../activity/types';

export const PAYMENTCHANNEL_ENDPOINTS: ApiEndpoint[] = [
  {
    id: 'fund-transfer',
    method: 'POST',
    path: '/api/PaymentChannel/fund-transfer',
    description: 'Initiate fund transfer',
    requestParams: [],
    requestBody: { fromAccount: 'string', toAccount: 'string', amount: 'number' },
  },
  {
    id: 'get-related-accts',
    method: 'POST',
    path: '/api/PaymentChannel/get-related-accts',
    description: 'Get related accounts',
    requestParams: [
      {
        name: 'custPermId',
        value: '',
        type: 'string',
        required: true,
        description: 'Customer Permanent ID',
      },
    ],
    requestBody: {
      xAuthType: 'SignonUIdPswdRole',
      custPermId: 'string',
      appCode: 'MIBANCO',
      bankId: '001',
      bankIdType: 'FIParty',
      accountFilter: 'TransactionAccounts',
    },
  },
  {
    id: 'daily-limit-retrieve',
    method: 'GET',
    path: '/api/PaymentChannel/daily-limit/retrieve',
    description: 'Retrieve daily limit information',
    requestParams: [],
  },
];
