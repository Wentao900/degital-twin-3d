import { useRequest } from 'ahooks';
import { GetInventoryInOutSumPeriod } from 'apis';
import { ScrollBoard } from '@jiaminghi/data-view-react';

const fallbackData = [
  ['1', '2023-06-01 12:00:00', '入库', 'A1', 'b12c3'],
  ['2', '2023-06-01 12:00:00', '出库', 'A2', 'b12c3'],
  ['3', '2023-06-01 12:00:00', '入库', 'A3', 'b12c3'],
  ['4', '2023-06-01 12:00:00', '出库', 'A4', 'b12c3'],
  ['5', '2023-06-01 12:00:00', '入库', 'A5', 'b12c3'],
  ['6', '2023-06-01 12:00:00', '出库', 'A6', 'b12c3'],
  ['7', '2023-06-01 12:00:00', '入库', 'A7', 'b12c3'],
  ['8', '2023-06-01 12:00:00', '出库', 'A8', 'b12c3'],
];

const normalizeFlowRows = (rows: any[]) => {
  if (!Array.isArray(rows) || !rows.length) return fallbackData;

  return rows.map((item: any, index: number) => [
    String(item.id || index + 1),
    item.operateTime || item.time || item.createTime || '--',
    item.flowType || item.type || '--',
    item.areaName || item.locationCode || item.areaCode || '--',
    item.flowNo || item.orderNo || item.billNo || '--',
  ]);
};

const Allerway = () => {
  const { data } = useRequest(async () => {
    try {
      const res: any = await GetInventoryInOutSumPeriod({
        startDate: '',
        endDate: '',
      });
      return normalizeFlowRows(res?.resultData?.list || res?.resultData || []);
    } catch (error) {
      return fallbackData;
    }
  });

  const config = {
    header: ['编号', '时间', '类型', '区域', '单号'],
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

export default Allerway;
