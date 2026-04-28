import './App.scss';

import { cloneDeep } from 'lodash';
import { useEffect } from 'react';
import { useRoutes } from 'react-router-dom';

import {
  AuthContext,
  signIn,
  signOut,
  useAppDispatch,
  useAppSelector,
  useLocationListen,
} from 'hooks';
import { getLocalMenusByToken } from '@/common/mock';
import { Settings } from 'utils';
import { setMenu } from 'store';

import { defaultRoutes, filepathToElement } from './routes';

function App() {
  const dispatch = useAppDispatch();
  const {
    user: { token, menu },
  } = useAppSelector((state) => state);
  const cloneDefaultRoutes = cloneDeep(defaultRoutes);
  cloneDefaultRoutes[0].children = [...filepathToElement(menu), ...cloneDefaultRoutes[0].children];

  useLocationListen((r) => {
    document.title = `${Settings.title}: ${r.pathname.replace('/', '')}`;
  });
  const element = useRoutes(cloneDefaultRoutes);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).__APP_AUTH_TOKEN__ =
        typeof token === 'string' ? token : token?.token || token?.accessToken || '';
    }

    if (!token) {
      dispatch(setMenu([]));
      return;
    }

    if (!menu.length) {
      dispatch(setMenu(getLocalMenusByToken(token)));
    }
  }, [dispatch, menu.length, token]);

  return <AuthContext.Provider value={{ signIn, signOut }}>{element}</AuthContext.Provider>;
}

export default App;
