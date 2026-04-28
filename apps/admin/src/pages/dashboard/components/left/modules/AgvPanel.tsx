import { useRequest } from 'ahooks';
import { ScrollBoard } from '@jiaminghi/data-view-react';
import { GetDigital_Equipment } from 'apis';

const fallbackData = [
  ['AGV1', '100%', 'A1', '1m/s'],
  ['AGV2', '100%', 'A2', '1m/s'],
  ['AGV3', '100%', 'A3', '1m/s'],
  ['AGV4', '100%', 'A4', '1m/s'],
  ['AGV5', '100%', 'A5', '1m/s'],
  ['AGV6', '100%', 'A6', '1m/s'],
  ['AGV7', '100%', 'A7', '1m/s'],
  ['AGV8', '100%', 'A8', '1m/s'],
  ['AGV9', '100%', 'A9', '1m/s'],
  ['AGV10', '100%', 'A10', '1m/s'],
  ['AGV11', '100%', 'A11', '1m/s'],
];

const normalizeAgvRows = (rows: any[]) => {
  if (!Array.isArray(rows) || !rows.length) return fallbackData;

  return rows.map((item: any, index: number) => [
    item.deviceCode || item.code || item.agvCode || item.name || `AGV${index + 1}`,
    `${item.powerPercent ?? item.battery ?? item.power ?? 100}%`,
    item.position || item.locationCode || item.areaName || item.currentLocation || '--',
    `${item.speed ?? item.velocity ?? 1}${String(item.speedUnit || '').trim() || 'm/s'}`,
  ]);
};

const AgvPanel = () => {
  const { data } = useRequest(async () => {
    try {
      const res: any = await GetDigital_Equipment({});
      return normalizeAgvRows(res?.resultData || []);
    } catch (error) {
      return fallbackData;
    }
  });

  const config = {
    header: ['编号', '电量', '位置', '速度'],
    data: data || fallbackData,
    headerBGC: '#00fff138',
    oddRowBGC: '#00000017',
    evenRowBGC: '#ededed13',
    headerHeight: 28,
    rowNum: 8,
    columnWidth: [80, 70, 60, 100],
  };
  return (
    <ScrollBoard
      config={config}
      style={{ width: '100%', height: '220px', fontSize: '12px', marginBottom: '8px' }}
    />
  );
};

export default AgvPanel;
