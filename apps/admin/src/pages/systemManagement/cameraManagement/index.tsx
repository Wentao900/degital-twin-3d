import { PageContainer } from '@ant-design/pro-layout';
import { Button, Card, Space, Table, Tag } from 'antd';

const dataSource = [
  { key: '1', code: 'CAM-01', name: '一号仓东门', protocol: 'WebRTC', status: 'ONLINE' },
  { key: '2', code: 'CAM-02', name: '一号仓主通道', protocol: 'HLS', status: 'ONLINE' },
  { key: '3', code: 'CAM-03', name: '二号仓装卸区', protocol: 'WebRTC', status: 'OFFLINE' },
];

function CameraManagement() {
  return (
    <PageContainer title="Camera Management">
      <Card
        title="摄像头管理"
        extra={
          <Space>
            <Button>批量导入</Button>
            <Button type="primary">新增摄像头</Button>
          </Space>
        }
      >
        <Table
          dataSource={dataSource}
          pagination={false}
          columns={[
            { title: '编码', dataIndex: 'code', key: 'code' },
            { title: '名称', dataIndex: 'name', key: 'name' },
            { title: '播放协议', dataIndex: 'protocol', key: 'protocol' },
            {
              title: '状态',
              dataIndex: 'status',
              key: 'status',
              render: (value: string) => (
                <Tag color={value === 'ONLINE' ? 'success' : 'error'}>{value}</Tag>
              ),
            },
          ]}
        />
      </Card>
    </PageContainer>
  );
}

export default CameraManagement;
