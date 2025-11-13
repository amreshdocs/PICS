export interface CustomerDemographics {
  name: string;
  address: string;
  birthDateOrBusinessSince: string;
  ssn: string;
  phone: string;
  email: string;
  cisNumber: string;

  // Optional additional fields
  customerSince?: string;
  secondaryPhone?: string;
  businessPhone?: string;
  maritalStatus?: string;
  gender?: string;
  occupation?: string;
  employer?: string;
}

export interface Customer {
  demographics: CustomerDemographics;
  raw: Record<string, unknown>;
}
