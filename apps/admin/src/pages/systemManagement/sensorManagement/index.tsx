import { PageContainer } from '@ant-design/pro-layout';
import { Card, Progress, Table, Tag } from 'antd';

const dataSource = [
  { key: '1', code: 'TMP-001', type: '温度', warehouse: '一号仓', online: true, quality: 98 },
  { key: '2', code: 'HUM-003', type: '湿度', warehouse: '二号仓', online: true, quality: 95 },
  { key: '3', code: 'DUST-004', type: '粉尘', warehouse: '三号仓', online: false, quality: 60 },
];

function SensorManagement() {
  return (
    <PageContainer title="Sensor Management">
      <Card title="传感器管理">
        <Table
          dataSource={dataSource}
          pagination={false}
          columns={[
            { title: '编码', dataIndex: 'code', key: 'code' },
            { title: '类型', dataIndex: 'type', key: 'type' },
            { title: '所属仓库', dataIndex: 'warehouse', key: 'warehouse' },
            {
              title: '在线状态',
              dataIndex: 'online',
              key: 'online',
              render: (value: boolean) => (
                <Tag color={value ? 'success' : 'error'}>{value ? 'ONLINE' : 'OFFLINE'}</Tag>
              ),
            },
            {
              title: '数据质量',
              dataIndex: 'quality',
              key: 'quality',
              render: (value: number) => <Progress percent={value} size="small" />,
            },
          ]}
        />
      </Card>
    </PageContainer>
  );
}

export default SensorManagement;
