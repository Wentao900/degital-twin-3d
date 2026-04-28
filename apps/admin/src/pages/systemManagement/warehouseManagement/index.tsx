import { PageContainer } from '@ant-design/pro-layout';
import { Button, Card, Space, Table, Tag } from 'antd';

const dataSource = [
  { key: '1', code: 'WH-01', name: '一号仓', status: '启用', manager: '张工' },
  { key: '2', code: 'WH-02', name: '二号仓', status: '启用', manager: '李工' },
];

function WarehouseManagement() {
  return (
    <PageContainer title="Warehouse Management">
      <Card
        title="仓库管理"
        extra={
          <Space>
            <Button>导入</Button>
            <Button type="primary">新增仓库</Button>
          </Space>
        }
      >
        <Table
          dataSource={dataSource}
          pagination={false}
          columns={[
            { title: '编码', dataIndex: 'code', key: 'code' },
            { title: '仓库名称', dataIndex: 'name', key: 'name' },
            { title: '负责人', dataIndex: 'manager', key: 'manager' },
            {
              title: '状态',
              dataIndex: 'status',
              key: 'status',
              render: (value: string) => <Tag color="success">{value}</Tag>,
            },
          ]}
        />
      </Card>
    </PageContainer>
  );
}

export default WarehouseManagement;
