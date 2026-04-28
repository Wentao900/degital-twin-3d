/**
 * @file index.tsx
 * @description 存放仓库模型
 */

import React from 'react';
import House from './components/house';

import VideoMonitorHotspot from './components/VideoMonitorHotspot';
import WarehouseMap from './components/WarehouseMap';
import type { GoodsPile } from './data/goodsPiles';

const createPile = (
  pileId: string,
  ownerName: string,
  position: [number, number, number],
  color: string,
  layout: GoodsPile['layout'],
  note: string
): GoodsPile => ({
  pileId,
  owner: {
    ownerId: pileId.toUpperCase(),
    ownerName,
    note,
  },
  position,
  layout,
  box: {
    size: [50, 50, 50],
    color,
    textureUrl: '/static/goods_texture.png',
  },
});

const warehouseScenes = [
  {
    warehouse: '一号仓',
    offset: [-3600, 0, -1200] as [number, number, number],
    status: 'ONLINE' as const,
    goodsPiles: [
      createPile('w1-pile-01', '华东快运', [-520, 0, -240], '#4a90d9', { rows: 3, cols: 3, levels: 2, gap: 5 }, '入口附近快进快出货物'),
      createPile('w1-pile-02', '顺达供应链', [-140, 0, 110], '#2dbf7f', { rows: 2, cols: 4, levels: 2, gap: 5 }, '中转电商件'),
      createPile('w1-pile-03', '恒联商贸', [260, 0, 260], '#f0a23b', { rows: 3, cols: 2, levels: 2, gap: 5 }, '临时待发货'),
    ],
    areas: [
      {
        x: -620,
        y: -430,
        width: 760,
        height: 860,
        name: 'warehouse-1-zone',
        type: 'area',
        strokeColor: 'rgb(0, 194, 255)',
        areaNumber: '一号仓',
        textHeight: 420,
      },
    ],
    cameras: [
      {
        id: 'cam-east-gate-w1',
        label: '东门摄像头',
        desc: '东门出入口与收货口',
        position: [-3280, 210, -520] as [number, number, number],
        status: 'ONLINE' as const,
      },
      {
        id: 'cam-main-aisle-w1',
        label: '主通道摄像头',
        desc: 'AGV 与叉车主通道',
        position: [-3680, 160, -1020] as [number, number, number],
        status: 'ONLINE' as const,
      },
    ],
  },
  {
    warehouse: '二号仓',
    offset: [200, 0, 0] as [number, number, number],
    status: 'ONLINE' as const,
    goodsPiles: [
      createPile('w2-pile-01', '中仓物流', [-420, 0, -200], '#7a7fff', { rows: 4, cols: 3, levels: 2, gap: 5 }, '大件周转区'),
      createPile('w2-pile-02', '北辰商配', [-40, 0, 200], '#25b08a', { rows: 3, cols: 3, levels: 3, gap: 5 }, '日配货物'),
      createPile('w2-pile-03', '运通贸易', [360, 0, -60], '#d988ff', { rows: 2, cols: 5, levels: 2, gap: 5 }, '待分拨货物'),
      createPile('w2-pile-04', '盛和仓配', [480, 0, 320], '#e67e22', { rows: 3, cols: 2, levels: 3, gap: 5 }, '装车前货物'),
    ],
    areas: [
      {
        x: -580,
        y: -420,
        width: 820,
        height: 840,
        name: 'warehouse-2-zone',
        type: 'area',
        strokeColor: 'rgb(34, 208, 209)',
        areaNumber: '二号仓',
        textHeight: 420,
      },
    ],
    cameras: [
      {
        id: 'cam-loading-zone-w2',
        label: '装卸区摄像头',
        desc: '装卸作业区',
        position: [520, 210, 680] as [number, number, number],
        status: 'ONLINE' as const,
      },
      {
        id: 'cam-middle-yard-w2',
        label: '中段摄像头',
        desc: '货物摆放与转运区',
        position: [120, 160, 180] as [number, number, number],
        status: 'ONLINE' as const,
      },
    ],
  },
  {
    warehouse: '三号仓',
    offset: [3600, 0, 1200] as [number, number, number],
    status: 'OFFLINE' as const,
    goodsPiles: [
      createPile('w3-pile-01', '西南仓储', [-500, 0, -120], '#ff8a5b', { rows: 3, cols: 4, levels: 2, gap: 5 }, '待清点货物'),
      createPile('w3-pile-02', '山海供应链', [80, 0, -260], '#5bc0eb', { rows: 2, cols: 3, levels: 4, gap: 5 }, '外贸拼箱货物'),
      createPile('w3-pile-03', '宏信物流', [420, 0, 180], '#9b59b6', { rows: 4, cols: 2, levels: 2, gap: 5 }, '转运待发货'),
    ],
    areas: [
      {
        x: -640,
        y: -400,
        width: 780,
        height: 820,
        name: 'warehouse-3-zone',
        type: 'area',
        strokeColor: 'rgb(255, 107, 107)',
        areaNumber: '三号仓',
        textHeight: 420,
      },
    ],
    cameras: [
      {
        id: 'cam-back-yard-w3',
        label: '后区摄像头',
        desc: '后区货物摆放区',
        position: [3920, 210, 1880] as [number, number, number],
        status: 'OFFLINE' as const,
      },
      {
        id: 'cam-transfer-w3',
        label: '转运区摄像头',
        desc: '转运车辆作业面',
        position: [3520, 160, 1380] as [number, number, number],
        status: 'ONLINE' as const,
      },
    ],
  },
];

const hotspotItems = warehouseScenes.flatMap((scene, index) => [
  {
    id: `warehouse-${index + 1}`,
    label: `${scene.warehouse}监控`,
    desc:
      scene.status === 'OFFLINE' ? '当前离线，请优先检查链路状态' : '查看仓内摄像头与监控事件',
    position: [scene.offset[0] + 220, 260, scene.offset[2] + 710] as [number, number, number],
    mode: 'warehouse' as const,
    status: scene.status,
    warehouse: scene.warehouse,
    cameraCount: scene.cameras.length,
  },
  ...scene.cameras.map((camera) => ({
    ...camera,
    mode: 'camera' as const,
    warehouse: scene.warehouse,
  })),
]);

const Factory = () => {
  return (
    <>
      {warehouseScenes.map((scene) => (
        <React.Fragment key={scene.warehouse}>
          <House position={scene.offset as any} />
          <WarehouseMap offset={scene.offset} goodsPiles={scene.goodsPiles} areas={scene.areas} />
        </React.Fragment>
      ))}
      <VideoMonitorHotspot items={hotspotItems} />
    </>
  );
};

export default Factory;
