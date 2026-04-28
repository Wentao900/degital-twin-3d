import { BarChartOutlined, FileTextOutlined, RadarChartOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { useRequest } from 'ahooks';
import { GetAreaLocationWeekSummary, GetCurrentLocationSummary, GetDigital_Equipment, GetSystemWarnInfoByDay } from 'apis';
import ReactECharts from 'echarts-for-react';
import { Button, Card, Col, Progress, Row, Space, Statistic, Table, Tag } from 'antd';
import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

const warehouseSummary = [
  {
    key: '1',
    name: '一号仓',
    utilization: 78,
    sensors: 128,
    alarms: 4,
    exports: 2,
    status: '运行中',
    trend: [72, 73, 75, 76, 78],
    env: [26, 27, 27, 28, 28],
  },
  {
    key: '2',
    name: '二号仓',
    utilization: 66,
    sensors: 96,
    alarms: 2,
    exports: 1,
    status: '运行中',
    trend: [61, 63, 64, 65, 66],
    env: [24, 24, 25, 25, 26],
  },
  {
    key: '3',
    name: '三号仓',
    utilization: 84,
    sensors: 144,
    alarms: 7,
    exports: 2,
    status: '关注中',
    trend: [79, 80, 81, 83, 84],
    env: [29, 29, 30, 31, 31],
  },
];

const fallbackMap = Object.fromEntries(warehouseSummary.map((item) => [item.name, item]));

const normalizeAnalytics = (
  warehouseName: string,
  summaryRes: any,
  trendRes: any,
  equipmentRes: any,
  alarmRes: any
) => {
  const fallback = fallbackMap[warehouseName] || warehouseSummary[0];
  const summaryData = summaryRes?.resultData || {};
  const trendRows = trendRes?.resultData || [];
  const equipmentRows = equipmentRes?.resultData || [];
  const alarmData = alarmRes?.resultData || {};

  const trend = Array.isArray(trendRows) && trendRows.length
    ? trendRows.slice(0, 5).map((item: any) => Number(item.usedLocationTotal || item.emptyLocationTotal || item.total || 0))
    : fallback.trend;

  const env = Array.isArray(trendRows) && trendRows.length
    ? trendRows.slice(0, 5).map((item: any) => Number(item.temperature || item.envValue || item.emptyLocationTotal || 0))
    : fallback.env;

  return {
    ...fallback,
    utilization:
      Number(summaryData.utilizationRate || summaryData.usedRate || summaryData.occupancyRate || 0) > 0
        ? Number((Number(summaryData.utilizationRate || summaryData.usedRate || summaryData.occupancyRate) * 100).toFixed(0))
        : fallback.utilization,
    sensors: Array.isArray(equipmentRows) && equipmentRows.length ? equipmentRows.length : fallback.sensors,
    alarms: Number(alarmData.warnCount || alarmData.alarmCount || 0) || fallback.alarms,
    trend,
    env,
  };
};

function Analytics() {
  const [searchParams] = useSearchParams();
  const selectedWarehouse = searchParams.get('warehouse') || '';
  const requestedWarehouse = selectedWarehouse || warehouseSummary[0].name;

  const { data } = useRequest(async () => {
    try {
      const [summaryRes, trendRes, equipmentRes, alarmRes] = await Promise.allSettled([
        GetCurrentLocationSummary({ warehouseName: requestedWarehouse }),
        GetAreaLocationWeekSummary({ warehouseName: requestedWarehouse }),
        GetDigital_Equipment({ warehouseName: requestedWarehouse }),
        GetSystemWarnInfoByDay({ warehouseName: requestedWarehouse }),
      ]);

      return normalizeAnalytics(
        requestedWarehouse,
        summaryRes.status === 'fulfilled' ? summaryRes.value : null,
        trendRes.status === 'fulfilled' ? trendRes.value : null,
        equipmentRes.status === 'fulfilled' ? equipmentRes.value : null,
        alarmRes.status === 'fulfilled' ? alarmRes.value : null
      );
    } catch (error) {
      return fallbackMap[requestedWarehouse] || warehouseSummary[0];
    }
  }, {
    refreshDeps: [requestedWarehouse],
  });

  const activeWarehouse = data || fallbackMap[requestedWarehouse] || warehouseSummary[0];

  const utilizationOption = useMemo(
    () => ({
      tooltip: {
        trigger: 'axis',
      },
      xAxis: {
        type: 'category',
        data: ['周一', '周二', '周三', '周四', '周五'],
        axisLabel: { color: '#d9e2f2' },
      },
      yAxis: {
        type: 'value',
        axisLabel: { color: '#d9e2f2' },
        splitLine: {
          lineStyle: {
            color: 'rgba(255,255,255,0.12)',
          },
        },
      },
      grid: {
        left: 35,
        right: 20,
        top: 30,
        bottom: 30,
      },
      series: [
        {
          name: '库位利用率',
          type: 'line',
          smooth: true,
          data: activeWarehouse.trend,
          lineStyle: {
            color: '#22d0d1',
          },
          areaStyle: {
            color: 'rgba(34, 208, 209, 0.20)',
          },
        },
      ],
    }),
    [activeWarehouse]
  );

  const environmentOption = useMemo(
    () => ({
      tooltip: {
        trigger: 'axis',
      },
      xAxis: {
        type: 'category',
        data: ['08:00', '10:00', '12:00', '14:00', '16:00'],
        axisLabel: { color: '#d9e2f2' },
      },
      yAxis: {
        type: 'value',
        axisLabel: { color: '#d9e2f2' },
        splitLine: {
          lineStyle: {
            color: 'rgba(255,255,255,0.12)',
          },
        },
      },
      grid: {
        left: 35,
        right: 20,
        top: 30,
        bottom: 30,
      },
      series: [
        {
          name: '温度',
          type: 'bar',
          data: activeWarehouse.env,
          itemStyle: {
            color: '#4e9bff',
            borderRadius: [6, 6, 0, 0],
          },
        },
      ],
    }),
    [activeWarehouse]
  );

  return (
    <PageContainer
      header={{
        title: '数据分析',
        subTitle: selectedWarehouse
          ? `当前聚焦：${selectedWarehouse}`
          : '仓库运营、传感器与报表导出的统一入口',
      }}
    >
      <Space direction="vertical" size={16} style={{ display: 'flex' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Card>
              <Statistic title="仓库总数" value={3} prefix={<BarChartOutlined />} />
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card>
              <Statistic
                title={`在线传感器${selectedWarehouse ? ` · ${activeWarehouse.name}` : ''}`}
                value={activeWarehouse.sensors}
                prefix={<RadarChartOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card>
              <Statistic
                title={`待导出报表${selectedWarehouse ? ` · ${activeWarehouse.name}` : ''}`}
                value={activeWarehouse.exports}
                prefix={<FileTextOutlined />}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} xl={16}>
            <Card
              title="仓库分析概览"
              extra={
                <Space>
                  {selectedWarehouse ? <Tag color="processing">{selectedWarehouse}</Tag> : null}
                  <Button type="primary">进入详细分析</Button>
                </Space>
              }
            >
              <Table
                pagination={false}
                dataSource={warehouseSummary}
                rowClassName={(record) => (record.name === activeWarehouse.name ? 'ant-table-row-selected' : '')}
                columns={[
                  { title: '仓库', dataIndex: 'name', key: 'name' },
                  {
                    title: '库位利用率',
                    dataIndex: 'utilization',
                    key: 'utilization',
                    render: (value: number) => <Progress percent={value} size="small" />,
                  },
                  { title: '传感器数', dataIndex: 'sensors', key: 'sensors' },
                  { title: '活跃告警', dataIndex: 'alarms', key: 'alarms' },
                  {
                    title: '状态',
                    dataIndex: 'status',
                    key: 'status',
                    render: (value: string) => (
                      <Tag color={value === '运行中' ? 'success' : 'warning'}>{value}</Tag>
                    ),
                  },
                ]}
              />
            </Card>
          </Col>
          <Col xs={24} xl={8}>
            <Card title={`${activeWarehouse.name} 当前概况`}>
              <Space direction="vertical" size={12} style={{ display: 'flex' }}>
                <Tag color="blue">库位利用率 {activeWarehouse.utilization}%</Tag>
                <Tag color="cyan">在线传感器 {activeWarehouse.sensors}</Tag>
                <Tag color={activeWarehouse.alarms > 5 ? 'red' : 'green'}>
                  活跃告警 {activeWarehouse.alarms}
                </Tag>
                <Tag color="purple">待导出报表 {activeWarehouse.exports}</Tag>
              </Space>
            </Card>
            <Card title="第一阶段已落位能力" style={{ marginTop: 16 }}>
              <Space direction="vertical" size={12} style={{ display: 'flex' }}>
                <Tag color="blue">登录与菜单支持真实后端接入</Tag>
                <Tag color="cyan">数字孪生主场景作为系统入口</Tag>
                <Tag color="green">数据分析入口已接入路由</Tag>
                <Tag color="purple">后端接口文档已整理到 docs/</Tag>
                <Tag color="orange">视频监控通过仓库内交互图标进入</Tag>
              </Space>
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} xl={12}>
            <Card title={`${activeWarehouse.name} 库位利用率趋势`}>
              <ReactECharts option={utilizationOption} style={{ height: 260 }} />
            </Card>
          </Col>
          <Col xs={24} xl={12}>
            <Card title={`${activeWarehouse.name} 温度巡检趋势`}>
              <ReactECharts option={environmentOption} style={{ height: 260 }} />
            </Card>
          </Col>
        </Row>
      </Space>
    </PageContainer>
  );
}

export default Analytics;
