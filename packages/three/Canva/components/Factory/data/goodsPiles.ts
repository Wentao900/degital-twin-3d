export type GoodsOwner = {
  ownerId: string;
  ownerName: string;
  phone?: string;
  address?: string;
  note?: string;
};

export type GoodsPile = {
  pileId: string;
  owner: GoodsOwner;
  position: [number, number, number];
  layout: {
    rows: number;
    cols: number;
    levels: number;
    gap: number;
  };
  box: {
    size: [number, number, number];
    color?: string;
    textureUrl?: string; // e.g. '/static/goods_texture.png'
  };
};

const goodsPilesData: GoodsPile[] = [
  {
    pileId: 'pile-001',
    owner: {
      ownerId: 'OWN-001',
      ownerName: '张伟物流有限公司',
      phone: '021-88881234',
      address: '上海市浦东新区物流大道 88 号',
      note: '易碎品，轻拿轻放',
    },
    position: [-420, 0, -200],
    layout: { rows: 3, cols: 3, levels: 2, gap: 5 },
    box: { size: [50, 50, 50], color: '#4a90d9', textureUrl: '/static/goods_texture.png' },
  },
  {
    pileId: 'pile-002',
    owner: {
      ownerId: 'OWN-002',
      ownerName: '李记商贸有限公司',
      phone: '010-56789000',
      address: '北京市朝阳区工业路 12 号',
      note: '冷藏货物，请勿长时间室温存放',
    },
    position: [-200, 0, 100],
    layout: { rows: 2, cols: 4, levels: 3, gap: 5 },
    box: { size: [50, 50, 50], color: '#27ae60', textureUrl: '/static/goods_texture.png' },
  },
  {
    pileId: 'pile-003',
    owner: {
      ownerId: 'OWN-003',
      ownerName: '王氏进出口贸易',
      phone: '0755-36987456',
      address: '深圳市龙华新区仓储中心 A 区',
      note: '报关货物，需提供清关文件',
    },
    position: [100, 0, -150],
    layout: { rows: 4, cols: 2, levels: 2, gap: 5 },
    box: { size: [50, 50, 50], color: '#e67e22', textureUrl: '/static/goods_texture.png' },
  },
  {
    pileId: 'pile-004',
    owner: {
      ownerId: 'OWN-004',
      ownerName: '陈氏供应链管理',
      phone: '020-44445555',
      address: '广州市番禺区物流园 1 栋',
      note: '批量订单，优先发货',
    },
    position: [300, 0, 300],
    layout: { rows: 3, cols: 3, levels: 4, gap: 5 },
    box: { size: [50, 50, 50], color: '#8e44ad', textureUrl: '/static/goods_texture.png' },
  },
];

export default goodsPilesData;

