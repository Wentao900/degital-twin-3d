import { CameraOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { Html } from '@react-three/drei';
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type HotspotItem = {
  id: string;
  label: string;
  desc: string;
  position: [number, number, number];
  mode: 'warehouse' | 'camera';
  status?: 'ONLINE' | 'OFFLINE';
  warehouse: string;
  cameraCount?: number;
};

interface VideoMonitorHotspotProps {
  items: HotspotItem[];
}

const getContainerStyle = (mode: HotspotItem['mode'], status: HotspotItem['status']) => ({
  display: 'flex',
  alignItems: 'center',
  gap: mode === 'warehouse' ? 10 : 8,
  padding: mode === 'warehouse' ? '10px 14px' : '8px 12px',
  borderRadius: mode === 'warehouse' ? 18 : 14,
  border:
    status === 'OFFLINE'
      ? '1px solid rgba(255, 107, 107, 0.75)'
      : mode === 'warehouse'
        ? '1px solid rgba(34, 208, 209, 0.75)'
        : '1px solid rgba(90, 190, 255, 0.65)',
  background:
    status === 'OFFLINE'
      ? 'linear-gradient(135deg, rgba(54,16,19,0.94) 0%, rgba(92,28,35,0.88) 100%)'
      : mode === 'warehouse'
        ? 'linear-gradient(135deg, rgba(8,25,43,0.94) 0%, rgba(17,54,86,0.88) 100%)'
        : 'linear-gradient(135deg, rgba(10,20,36,0.90) 0%, rgba(22,38,67,0.86) 100%)',
  color: '#fff',
  cursor: 'pointer',
  boxShadow:
    status === 'OFFLINE'
      ? '0 0 16px rgba(255, 107, 107, 0.28)'
      : mode === 'warehouse'
        ? '0 0 16px rgba(34, 208, 209, 0.35)'
        : '0 0 12px rgba(69, 156, 255, 0.28)',
  whiteSpace: 'nowrap' as const,
  minWidth: mode === 'warehouse' ? 220 : 168,
});

const getPulseStyle = (status: HotspotItem['status']) => ({
  width: 10,
  height: 10,
  borderRadius: '999px',
  background: status === 'OFFLINE' ? '#ff6b6b' : '#22d0d1',
  boxShadow:
    status === 'OFFLINE'
      ? '0 0 0 6px rgba(255, 107, 107, 0.18)'
      : '0 0 0 6px rgba(34, 208, 209, 0.16)',
  flexShrink: 0,
});

function VideoMonitorHotspot({ items }: VideoMonitorHotspotProps) {
  const navigate = useNavigate();
  const [activeId, setActiveId] = useState<string | null>(null);

  const activeItem = useMemo(
    () => items.find((item) => item.id === activeId) || null,
    [activeId, items]
  );

  const relatedCameras = useMemo(
    () =>
      activeItem
        ? items.filter(
            (item) => item.mode === 'camera' && item.warehouse === activeItem.warehouse
          )
        : [],
    [activeItem, items]
  );

  return (
    <>
      {items.map((item) => (
        <Html
          key={item.id}
          position={item.position}
          distanceFactor={item.mode === 'hub' ? 220 : 180}
          transform
          sprite
        >
          <button
            onClick={() => setActiveId(item.id)}
            style={getContainerStyle(item.mode, item.status)}
          >
            <div style={getPulseStyle(item.status)} />
            <div
              style={{
                width: item.mode === 'warehouse' ? 28 : 24,
                height: item.mode === 'warehouse' ? 28 : 24,
                borderRadius: 999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background:
                  item.status === 'OFFLINE'
                    ? 'rgba(255, 107, 107, 0.16)'
                    : item.mode === 'warehouse'
                      ? 'rgba(34, 208, 209, 0.18)'
                      : 'rgba(90, 190, 255, 0.18)',
                flexShrink: 0,
              }}
            >
              {item.mode === 'warehouse' ? <VideoCameraOutlined /> : <CameraOutlined />}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <span style={{ fontSize: item.mode === 'warehouse' ? 14 : 13, fontWeight: 700 }}>
                {item.label}
              </span>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.72)' }}>{item.desc}</span>
            </div>
          </button>
        </Html>
      ))}
      {activeItem ? (
        <Html position={activeItem.position} distanceFactor={150} transform sprite>
          <div
            style={{
              transform: 'translate(175px, -24px)',
              width: 260,
              borderRadius: 16,
              border:
                activeItem.status === 'OFFLINE'
                  ? '1px solid rgba(255,107,107,0.75)'
                  : '1px solid rgba(34,208,209,0.65)',
              background: 'rgba(8, 16, 29, 0.94)',
              color: '#fff',
              boxShadow:
                activeItem.status === 'OFFLINE'
                  ? '0 0 20px rgba(255,107,107,0.22)'
                  : '0 0 20px rgba(34,208,209,0.18)',
              padding: 14,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 10,
              }}
            >
              <div style={{ fontWeight: 700 }}>{activeItem.label}</div>
              <button
                onClick={() => setActiveId(null)}
                style={{
                  background: 'transparent',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 18,
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.76)', marginBottom: 8 }}>
              {activeItem.desc}
            </div>
            <div style={{ display: 'grid', gap: 6, fontSize: 12, marginBottom: 12 }}>
              <div>所属仓库：{activeItem.warehouse}</div>
              <div>状态：{activeItem.status === 'OFFLINE' ? '离线' : '在线'}</div>
              <div>
                {activeItem.mode === 'warehouse'
                  ? `覆盖摄像头：${activeItem.cameraCount || relatedCameras.length} 路`
                  : '类型：单点摄像头'}
              </div>
            </div>
            {relatedCameras.length ? (
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 12, marginBottom: 6, color: 'rgba(255,255,255,0.86)' }}>
                  关联点位
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {relatedCameras.map((camera) => (
                    <span
                      key={camera.id}
                      style={{
                        padding: '3px 8px',
                        borderRadius: 999,
                        fontSize: 11,
                        background:
                          camera.status === 'OFFLINE'
                            ? 'rgba(255,107,107,0.16)'
                            : 'rgba(34,208,209,0.16)',
                        border:
                          camera.status === 'OFFLINE'
                            ? '1px solid rgba(255,107,107,0.5)'
                            : '1px solid rgba(34,208,209,0.45)',
                      }}
                    >
                      {camera.label}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() =>
                  navigate(
                    `/video-monitor?warehouse=${encodeURIComponent(activeItem.warehouse)}&camera=${encodeURIComponent(activeItem.id)}`
                  )
                }
                style={{
                  flex: 1,
                  padding: '8px 10px',
                  borderRadius: 10,
                  border: 'none',
                  background: activeItem.status === 'OFFLINE' ? '#9b3d46' : '#1c8df0',
                  color: '#fff',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                进入监控
              </button>
              <button
                onClick={() =>
                  navigate(`/analytics?warehouse=${encodeURIComponent(activeItem.warehouse)}`)
                }
                style={{
                  flex: 1,
                  padding: '8px 10px',
                  borderRadius: 10,
                  border: '1px solid rgba(255,255,255,0.18)',
                  background: 'transparent',
                  color: '#fff',
                  cursor: 'pointer',
                }}
              >
                查看分析
              </button>
            </div>
          </div>
        </Html>
      ) : null}
    </>
  );
}

export default VideoMonitorHotspot;
