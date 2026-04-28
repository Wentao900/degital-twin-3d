import { request } from '../request';

export interface LoginParams {
  username: string;
  password: string;
}

export const loginByPassword = <T>(data: LoginParams) => request.post<T>('/api/auth/login', { data });

export const getCurrentUser = <T>() => request.get<T>('/api/auth/me');

export const getMenus = <T>() => request.get<T>('/api/auth/menus');
