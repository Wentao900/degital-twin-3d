import { CameraOutlined, PlayCircleOutlined, WarningOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Card, Col, List, Row, Space, Tag } from 'antd';
import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const cameras = [
  {
    id: 'CAM-01',
    hotspotId: 'cam-east-gate-w1',
    name: '一号仓东门',
    status: 'ONLINE',
    warehouse: '一号仓',
    desc: '出入口通行画面',
  },
  {
    id: 'CAM-02',
    hotspotId: 'cam-main-aisle-w1',
    name: '一号仓主通道',
    status: 'ONLINE',
    warehouse: '一号仓',
    desc: 'AGV 与叉车主通道',
  },
  {
    id: 'CAM-03',
    hotspotId: 'cam-loading-zone-w2',
    name: '二号仓装卸区',
    status: 'ONLINE',
    warehouse: '二号仓',
    desc: '装卸作业区',
  },
  {
    id: 'CAM-04',
    hotspotId: 'cam-middle-yard-w2',
    name: '二号仓中段',
    status: 'ONLINE',
    warehouse: '二号仓',
    desc: '货物摆放与转运区',
  },
  {
    id: 'CAM-05',
    hotspotId: 'cam-back-yard-w3',
    name: '三号仓后区',
    status: 'OFFLINE',
    warehouse: '三号仓',
    desc: '后区货物摆放区',
  },
  {
    id: 'CAM-06',
    hotspotId: 'cam-transfer-w3',
    name: '三号仓转运区',
    status: 'ONLINE',
    warehouse: '三号仓',
    desc: '转运车辆作业面',
  },
];

const warehouseEvents: Record<
  string,
  Array<{ id: string; level: 'INFO' | 'WARN' | 'CRITICAL'; text: string; time: string }>
> = {
  一号仓: [
    { id: 'E-101', level: 'INFO', text: '东门摄像头连续在线 48h', time: '09:15' },
    { id: 'E-102', level: 'WARN', text: '主通道车流量偏高', time: '10:20' },
  ],
  二号仓: [
    { id: 'E-201', level: 'INFO', text: '装卸区画面正常', time: '08:50' },
    { id: 'E-202', level: 'WARN', text: '装卸区有短时拥堵', time: '11:05' },
  ],
  三号仓: [
    { id: 'E-301', level: 'CRITICAL', text: '后区摄像头离线', time: '07:42' },
    { id: 'E-302', level: 'WARN', text: '后区需人工巡检', time: '09:30' },
  ],
};

function VideoMonitor() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedWarehouse = searchParams.get('warehouse') || '';
  const selectedCamera = searchParams.get('camera') || '';

  const filteredCameras = useMemo(() => {
    if (!selectedWarehouse) return cameras;
    return cameras.filter((item) => item.warehouse === selectedWarehouse);
  }, [selectedWarehouse]);

  const activeCamera = useMemo(
    () =>
      cameras.find((item) => item.hotspotId === selectedCamera || item.id === selectedCamera) ||
      filteredCameras[0] ||
      cameras[0],
    [filteredCameras, selectedCamera]
  );

  const [focusedCameraId, setFocusedCameraId] = useState(activeCamera?.id || cameras[0]?.id);

  const focusedCamera = useMemo(
    () => filteredCameras.find((item) => item.id === focusedCameraId) || activeCamera,
    [activeCamera, filteredCameras, focusedCameraId]
  );

  const activeWarehouseEvents = useMemo(
    () => warehouseEvents[selectedWarehouse || focusedCamera?.warehouse || '一号仓'] || [],
    [focusedCamera?.warehouse, selectedWarehouse]
  );

  return (
    <PageContainer
      header={{
        title: '视频监控',
        subTitle: selectedWarehouse
          ? `当前聚焦：${selectedWarehouse}`
          : '多仓库、多摄像头与视频流接入入口',
      }}
    >
      <Row gutter={[16, 16]}>
        <Col xs={24} xl={8}>
          <Card
            title="摄像头列表"
            extra={
              <Space>
                {selectedWarehouse ? <Tag color="blue">{selectedWarehouse}</Tag> : null}
                <Button type="primary">新增摄像头</Button>
              </Space>
            }
          >
            <List
              dataSource={filteredCameras}
              renderItem={(item) => (
                <List.Item
                  style={{
                    borderRadius: 8,
                    paddingInline: 10,
                    background:
                      activeCamera?.id === item.id
                        ? 'rgba(24, 144, 255, 0.08)'
                        : 'transparent',
                    border:
                      activeCamera?.id === item.id
                        ? '1px solid rgba(24, 144, 255, 0.35)'
                        : '1px solid transparent',
                  }}
                  onClick={() => {
                    setFocusedCameraId(item.id);
                    navigate(
                      `/video-monitor?warehouse=${encodeURIComponent(item.warehouse)}&camera=${encodeURIComponent(item.hotspotId || item.id)}`
                    );
                  }}
                  actions={[
                    <Button
                      key="play"
                      type="link"
                      icon={<PlayCircleOutlined />}
                      onClick={() => {
                        setFocusedCameraId(item.id);
                        navigate(
                          `/video-monitor?warehouse=${encodeURIComponent(item.warehouse)}&camera=${encodeURIComponent(item.hotspotId || item.id)}`
                        );
                      }}
                    >
                      预览
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={<CameraOutlined />}
                    title={
                      <Space>
                        <span>{item.name}</span>
                        <Tag color={item.status === 'ONLINE' ? 'success' : 'error'}>
                          {item.status}
                        </Tag>
                        {activeCamera?.id === item.id ? <Tag color="processing">当前点位</Tag> : null}
                      </Space>
                    }
                    description={`${item.id} | ${item.warehouse} | ${item.desc}`}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col xs={24} xl={16}>
          <Card
            title={focusedCamera ? `视频区域占位 · ${focusedCamera.name}` : '视频区域占位'}
            extra={<Tag color="processing">待接入 WebRTC / HLS</Tag>}
          >
            <Row gutter={[16, 16]}>
              {Array.from({ length: 4 }).map((_, index) => (
                <Col xs={24} md={12} key={index}>
                  <div
                    style={{
                      height: 220,
                      borderRadius: 8,
                      background:
                        index === 0
                          ? focusedCamera?.status === 'OFFLINE'
                            ? 'linear-gradient(135deg, #3d1620 0%, #6a2430 100%)'
                            : 'linear-gradient(135deg, #0d2748 0%, #1f5f96 100%)'
                          : 'linear-gradient(135deg, #10233f 0%, #1f3d63 100%)',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border:
                        index === 0
                          ? focusedCamera?.status === 'OFFLINE'
                            ? '1px solid rgba(255,107,107,0.55)'
                            : '1px solid rgba(34,208,209,0.55)'
                          : '1px solid rgba(255,255,255,0.08)',
                      boxShadow:
                        index === 0
                          ? focusedCamera?.status === 'OFFLINE'
                            ? '0 0 18px rgba(255,107,107,0.28)'
                            : '0 0 18px rgba(34,208,209,0.22)'
                          : 'none',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    {index === 0 && focusedCamera ? (
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          padding: 14,
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          background:
                            focusedCamera.status === 'OFFLINE'
                              ? 'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(70,10,10,0.35) 100%)'
                              : 'linear-gradient(180deg, rgba(0,0,0,0.10) 0%, rgba(4,29,49,0.35) 100%)',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Tag color={focusedCamera.status === 'ONLINE' ? 'success' : 'error'}>
                            {focusedCamera.status}
                          </Tag>
                          <Tag color="blue">{focusedCamera.warehouse}</Tag>
                        </div>
                        <div>
                          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>
                            {focusedCamera.name}
                          </div>
                          <div style={{ color: 'rgba(255,255,255,0.76)', fontSize: 12 }}>
                            {focusedCamera.desc}
                          </div>
                        </div>
                      </div>
                    ) : null}
                    <Space direction="vertical" align="center">
                      <PlayCircleOutlined style={{ fontSize: 28 }} />
                      <span>{index === 0 && focusedCamera ? focusedCamera.name : `视频窗口 ${index + 1}`}</span>
                      {index === 0 && focusedCamera ? (
                        <Tag color={focusedCamera.status === 'ONLINE' ? 'success' : 'error'}>
                          {focusedCamera.warehouse} / {focusedCamera.status}
                        </Tag>
                      ) : null}
                    </Space>
                  </div>
                </Col>
              ))}
            </Row>
          </Card>
          <Card
            title={`${selectedWarehouse || activeCamera?.warehouse || '当前仓库'} 事件摘要`}
            style={{ marginTop: 16 }}
          >
            <Space direction="vertical" size={8} style={{ display: 'flex' }}>
              {activeWarehouseEvents.map((event) => (
                <div
                  key={event.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 10px',
                    borderRadius: 8,
                    background: 'rgba(6, 24, 44, 0.65)',
                  }}
                >
                  <Space>
                    <Tag
                      color={
                        event.level === 'CRITICAL'
                          ? 'error'
                          : event.level === 'WARN'
                            ? 'warning'
                            : 'processing'
                      }
                    >
                      {event.level}
                    </Tag>
                    <span style={{ color: '#d9e2f2' }}>{event.text}</span>
                  </Space>
                  <span style={{ color: 'rgba(255,255,255,0.62)' }}>{event.time}</span>
                </div>
              ))}
            </Space>
          </Card>
          <Card title="接入提醒" style={{ marginTop: 16 }}>
            <Space direction="vertical" size={8} style={{ display: 'flex' }}>
              <Tag icon={<WarningOutlined />} color="orange">
                浏览器侧建议消费 WebRTC 或 HLS，不要直接暴露 RTSP
              </Tag>
              <Tag color="blue">后端需提供摄像头列表、播放地址、快照和事件接口</Tag>
              {activeCamera ? (
                <Tag color={focusedCamera?.status === 'ONLINE' ? 'green' : 'red'}>
                  当前高亮摄像头：{focusedCamera?.name}
                </Tag>
              ) : null}
              <Tag color="purple">后续可联动当前告警中心与 3D 场景</Tag>
            </Space>
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
}

export default VideoMonitor;
