import type {
  CustomerSearchResponse,
  SearchType,
} from '@/features/search/services/customersApi';

// Simplified mock dataset derived from provided payload
const MOCK_CUSTOMERS: Record<string, any>[] = [
  {
    CustPermId: '00000002707',
    TaxId: '312526985',
    FirstName: 'ROBERT',
    LastName: 'TURTLE',
    Addr1: '123 RIVER ST # 405',
    Addr2: 'DES PLAINES IL 60016',
    City: 'DES PLAINES',
    StateProv: 'IL',
    PostalCode: '60016',
    EmailAddr: 'EULISA.RIVERA@POPULAR.COM',
    PrimaryPhoneNum: '7276677498',
    MobilePhoneNum: '7872057660',
    BirthDt: '1980-09-01',
    RawPayload: {
      Exceptions: { Errors: [] },
      Customer: {
        PersonInfo: {
          TaxId: '312526985',
          FirstName: 'ROBERT',
          LastName: 'TURTLE',
          Addr1: '123 RIVER ST # 405',
          Addr2: 'DES PLAINES IL 60016',
          City: 'DES PLAINES',
          StateProv: 'IL',
          PostalCode: '60016',
          EmailAddr: 'EULISA.RIVERA@POPULAR.COM',
          PrimaryPhoneNum: '7276677498',
          MobilePhoneNum: '7872057660',
          PrimaryOfficerPhoneNum: 55711,
          SecondaryOfficerPhoneNum: 90838,
          BirthDt: '1980-09-01',
          ResidencyStatus: 'U.S. CITIZEN',
          CountryOfCitizenship: 'USA',
          IdDetails: [
            {
              IdType: '003',
              IdNum: '12457845112',
              IdIssueDt: '2023-01-02',
              IdExpDt: '2023-10-13',
              IdIssuingEntity: 'GOVERNMENT',
              IdIssuingLocation: 'UNITED STATES',
            },
          ],
        },
        CustPermId: '00000002707',
        CostCenterNum: 50551,
        IsProspect: 'False',
        BranchId: '50255',
        IsCustCodeValid: true,
        SecretQuestion: "DOG'S NAME",
        SecretAnswer: 'WOOF WOOF',
        CustCodes: {
          CustCode1: '0',
          CustCode2: '0',
          CustCode3: '0',
          CustCode4: '0',
          CustCode5: '0',
          CustCode6: '0',
          CustCode7: '0',
          CustCode8: '0',
          CustCode9: '0',
          CustCode10: '0',
          CustCode11: '0',
          CustCode12: '0',
          CustCode13: '0',
          CustCode14: '0',
          CustCode15: '0',
        },
      },
      RelatedAccounts: [
        // (trimmed for brevity in the mock) include representative accounts
        {
          AcctType: 'DP',
          DepAcct: {
            AcctId: '310805353',
            LastStmtBal: 4900,
            CashAvail: 4900,
            DepositRelationCode: '0',
            Category: 'D',
            StmtMktName: 'OAC POPULAR CHECKING',
          },
        },
        {
          AcctType: 'DP',
          DepAcct: {
            AcctId: '517201701',
            LastStmtBal: 874.74,
            CashAvail: 874.74,
            DepositRelationCode: '0',
            Category: 'N',
            StmtMktName: 'POPULAR PRESTIGE CHECKING',
          },
        },
        { AcctType: 'CBM', CardAcct: { CardNum: '9991380900005008' } },
        { AcctType: 'LN', LoanAcct: { AcctId: '3058', LastPmtAmt: '0' } },
      ],
    },
  },
  {
    CustPermId: '00000012345',
    TaxId: '123456789',
    FirstName: 'JANE',
    LastName: 'DOE',
    Addr1: '500 MAIN ST',
    Addr2: 'ANYTOWN NY 10001',
    City: 'ANYTOWN',
    StateProv: 'NY',
    PostalCode: '10001',
    EmailAddr: 'JANE.DOE@EXAMPLE.COM',
    PrimaryPhoneNum: '2125551212',
    BirthDt: '1975-05-15',
    RawPayload: {},
  },
];

export const mockCustomerApi = {
  search: async (
    searchValue: string,
    searchType: SearchType,
    page = 1,
    pageSize = 10
  ): Promise<CustomerSearchResponse> => {
    const q = String(searchValue || '')
      .trim()
      .toLowerCase();

    const filtered = MOCK_CUSTOMERS.filter((c) => {
      if (!q) return true;
      switch (searchType) {
        case 'cisNumber':
          return String(c.CustPermId || '')
            .toLowerCase()
            .includes(q);
        case 'ssn':
        case 'taxId':
          return String(c.TaxId || '')
            .toLowerCase()
            .includes(q);
        case 'name':
          return `${c.FirstName || ''} ${c.LastName || ''}`.toLowerCase().includes(q);
        case 'phone':
          return (
            String(c.PrimaryPhoneNum || '')
              .toLowerCase()
              .includes(q) ||
            String(c.MobilePhoneNum || '')
              .toLowerCase()
              .includes(q)
          );
        case 'accountNumber':
        default:
          return (
            String(c.CustPermId || '')
              .toLowerCase()
              .includes(q) ||
            String(c.TaxId || '')
              .toLowerCase()
              .includes(q) ||
            `${c.FirstName || ''} ${c.LastName || ''}`.toLowerCase().includes(q)
          );
      }
    });

    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const start = (page - 1) * pageSize;
    const pageData = filtered.slice(start, start + pageSize);

    // Normalize to shape expected by SearchPage
    const data = pageData.map((c) => ({
      CustPermId: c.CustPermId,
      TaxId: c.TaxId,
      FirstName: c.FirstName,
      LastName: c.LastName,
      Addr1: c.Addr1,
      Addr2: c.Addr2,
      BirthDt: c.BirthDt,
      EmailAddr: c.EmailAddr,
      PrimaryPhoneNum: c.PrimaryPhoneNum,
      MobilePhoneNum: c.MobilePhoneNum,
      // expose helpful nested payloads at top-level so consumers can read them directly
      CustCodes: c.RawPayload?.Customer?.CustCodes ?? c.RawPayload?.CustCodes,
      RelatedAccounts: c.RawPayload?.RelatedAccounts,
      raw: c.RawPayload,
    }));

    const response: CustomerSearchResponse = {
      data: data as any,
      total,
      page,
      pageSize,
      totalPages,
    };

    // Simulate async
    await new Promise((r) => setTimeout(r, 150));
    return response;
  },
};

export default mockCustomerApi;
