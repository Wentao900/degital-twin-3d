import { createSlice } from '@reduxjs/toolkit';

import { TOKEN } from 'utils';
import { getStorage } from 'utils';
// import { MenuItem } from "@/components/Layout/layout";

export interface IUserInitialState {
  role: string[];
  token: string;
  menu: any[];
  userInfo: Record<string, any> | null;
  permissions: string[];
  warehouseScope: Array<string | number>;
  [key: string]: any;
}

export interface Type {
  type: string;
}
// 默认状态
const initialState: IUserInitialState = {
  role: [],
  token: getStorage(TOKEN) ?? '',
  menu: [],
  userInfo: null,
  permissions: [],
  warehouseScope: [],
};

export const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    setUserToken: (state, action) => {
      state.token = action.payload;
    },
    setMenu: (state, action) => {
      state.menu = action.payload;
    },
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
    setPermissions: (state, action) => {
      state.permissions = action.payload;
    },
    setWarehouseScope: (state, action) => {
      state.warehouseScope = action.payload;
    },
  },
});

export const { setUserToken, setMenu, setUserInfo, setPermissions, setWarehouseScope } =
  userSlice.actions;

export default userSlice.reducer;
