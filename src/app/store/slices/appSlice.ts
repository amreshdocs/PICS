import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AppState {
  sidebarOpen: boolean;
  activeMenu: string | null;
}

const initialState: AppState = {
  sidebarOpen: true,
  activeMenu: 'activity',
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    setActiveMenu: (state, action: PayloadAction<string>) => {
      state.activeMenu = action.payload;
    },
  },
});

export const { toggleSidebar, setSidebarOpen, setActiveMenu } = appSlice.actions;
export default appSlice.reducer;
