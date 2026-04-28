import React, { Dispatch } from 'react';
import { setMenu, setPermissions, setUserInfo, setUserToken, setWarehouseScope } from 'store';

import { getStorage, removeStorage, setStorage, sleep, TOKEN } from 'utils';

interface AuthContextType {
  signIn: (dispatch: Dispatch<any>, values: Record<string, any>) => Promise<unknown>;
  signOut: (dispatch: Dispatch<any>) => Promise<unknown>;
}

export const signIn = async (dispatch: any, values: Record<string, any>) => {
  await sleep(300);

  const token =
    values.token || values.accessToken || values.access_token || values.authToken || JSON.stringify(values);
  const userInfo = values.userInfo ||
    values.user || {
      username: values.username,
      nickname: values.username,
      roles: values.username === 'admin' ? ['admin'] : ['user'],
    };

  setStorage(TOKEN, token, 1000 * 60 * 24);
  if (typeof window !== 'undefined') {
    (window as any).__APP_AUTH_TOKEN__ = token;
  }
  dispatch(setUserToken(getStorage(TOKEN)));
  dispatch(setUserInfo(userInfo));
  dispatch(setPermissions(values.permissions || userInfo.permissions || []));
  dispatch(setWarehouseScope(values.warehouseIds || userInfo.warehouseIds || []));

  if (Array.isArray(values.menu)) {
    dispatch(setMenu(values.menu));
  }

  return { token: getStorage(TOKEN) };
};

export const signOut = (dispatch: any) => {
  return new Promise((resolve) => {
    try {
      removeStorage(TOKEN);
      if (typeof window !== 'undefined') {
        (window as any).__APP_AUTH_TOKEN__ = '';
      }
      dispatch(setUserToken(''));
      dispatch(setUserInfo(null));
      dispatch(setPermissions([]));
      dispatch(setWarehouseScope([]));
      dispatch(setMenu([]));
    } finally {
      resolve('');
    }
  });
};

export const AuthContext = React.createContext<AuthContextType>({
  signIn,
  signOut,
});
