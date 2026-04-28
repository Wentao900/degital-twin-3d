import {
  AlertOutlined,
  ApartmentOutlined,
  BarChartOutlined,
  CameraOutlined,
  DesktopOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons';

import { MenuItem } from 'components';
import { ADMIN } from 'utils';

const systemManagementChildren: MenuItem[] = [
  {
    label: 'User Management',
    key: 'userManagement',
    path: 'userManagement',
    icon: <UserOutlined />,
    filepath: 'pages/systemManagement/userManagement/index.tsx',
  },
  {
    label: 'Role Management',
    key: 'roleManagement',
    path: 'roleManagement',
    icon: <SettingOutlined />,
    filepath: 'pages/systemManagement/roleManagement/index.tsx',
  },
  {
    label: 'Warehouse Management',
    key: 'warehouseManagement',
    path: 'warehouseManagement',
    icon: <ApartmentOutlined />,
    filepath: 'pages/systemManagement/warehouseManagement/index.tsx',
  },
  {
    label: 'Sensor Management',
    key: 'sensorManagement',
    path: 'sensorManagement',
    icon: <BarChartOutlined />,
    filepath: 'pages/systemManagement/sensorManagement/index.tsx',
  },
  {
    label: 'Camera Management',
    key: 'cameraManagement',
    path: 'cameraManagement',
    icon: <CameraOutlined />,
    filepath: 'pages/systemManagement/cameraManagement/index.tsx',
  },
];

export const MenuData: {
  user: MenuItem[];
  admin: MenuItem[];
} = {
  user: [
    {
      label: 'User',
      key: 'user',
      path: '/user',
      icon: <DesktopOutlined />,
      filepath: 'pages/user/index.tsx',
    },
  ],
  admin: [
    {
      label: '数字孪生',
      key: 'digital-twin',
      path: 'dashboard',
      icon: <DesktopOutlined />,
      filepath: 'pages/dashboard/index.tsx',
    },
    {
      label: '告警中心',
      key: 'alarm',
      path: 'alarm',
      icon: <AlertOutlined />,
      filepath: 'pages/alarm/index.tsx',
    },
    {
      label: '数据分析',
      key: 'analytics',
      path: 'analytics',
      icon: <BarChartOutlined />,
      filepath: 'pages/analytics/index.tsx',
    },
    {
      label: '系统管理',
      key: 'systemManagement',
      path: 'systemManagement',
      icon: <SettingOutlined />,
      filepath: 'components/OutletLayoutRouter/index.tsx',
      children: systemManagementChildren,
    },
  ],
};

const tryParseToken = (token: any) => {
  if (!token) return null;
  if (typeof token === 'string') {
    try {
      return JSON.parse(token);
    } catch (error) {
      return null;
    }
  }
  return token;
};

export const getLocalMenusByToken = (token: any) => {
  const parsedToken = tryParseToken(token);
  const isAdmin =
    parsedToken?.username === ADMIN ||
    parsedToken?.nickname === ADMIN ||
    parsedToken?.roles?.includes?.(ADMIN);

  return isAdmin ? MenuData.admin : MenuData.user;
};
