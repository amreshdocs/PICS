import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Customer } from '@/features/customers/types/customer.types';

interface CustomersState {
  selected: Customer | null;
}

const initialState: CustomersState = {
  selected: null,
};

const customersSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    setSelectedCustomer: (state, action: PayloadAction<Customer>) => {
      state.selected = action.payload;
    },
    clearSelectedCustomer: (state) => {
      state.selected = null;
    },
  },
});

export const { setSelectedCustomer, clearSelectedCustomer } = customersSlice.actions;
export default customersSlice.reducer;
