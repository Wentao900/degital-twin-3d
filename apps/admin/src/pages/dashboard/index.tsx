import { BarChartOutlined, WarningOutlined } from '@ant-design/icons';
import { Button, Space, Spin, Tag } from 'antd';
import { FC, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';

import Panel from '@/components/Panel';
import Left from './components/left';
import Right from './components/right';
import Bottom from './components/bottom';

import styles from './style.module.scss';
import { Canvas } from 'threejs';
import { ThreeMobx, observer } from 'mobx-threejs-store';

const Workplace: FC = () => {
  const navigate = useNavigate();

  return (
    <ThreeMobx>
      <Suspense fallback={<Spin size="small" />}>
        <Canvas />
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 w-[520px] max-w-[calc(100vw-40px)]">
          <Panel
            title="数字孪生主场景"
            right={<Tag color="processing">保留原场景布局，叠加分析与监控入口</Tag>}
            scale={180}
          >
            <div className="py-3 px-2 text-white">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <Space wrap>
                  <Tag color="blue">场景在线设备 128</Tag>
                  <Tag color="green">在线传感器 368</Tag>
                  <Tag color="orange">待处理告警 12</Tag>
                </Space>
                <Space wrap>
                  <Button
                    size="small"
                    type="primary"
                    icon={<BarChartOutlined />}
                    onClick={() => navigate('/analytics')}
                  >
                    数据分析
                  </Button>
                  <Button
                    size="small"
                    icon={<WarningOutlined />}
                    onClick={() => navigate('/alarm')}
                  >
                    告警中心
                  </Button>
                </Space>
              </div>
            </div>
          </Panel>
        </div>
        <Left />
        <Right />
        {/* <Bottom /> */}
      </Suspense>
    </ThreeMobx>
  );
};
export default observer(Workplace);
