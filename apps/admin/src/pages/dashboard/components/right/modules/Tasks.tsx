import React from 'react';
import ReactECharts from 'echarts-for-react';
import { useRequest } from 'ahooks';
import { config } from '../../config';
import { CurrentTaskSummary, GetAreaLocationAlarmsSummary } from 'apis';

const fallbackSeriesData = [
  { name: 'A1', data: [120, 132, 101, 134, 90, 230, 210] },
  { name: 'C3', data: [220, 182, 191, 234, 290, 330, 310] },
  { name: 'Y2', data: [150, 232, 201, 154, 190, 330, 410] },
  { name: 'A3', data: [320, 332, 301, 334, 390, 330, 320] },
];

const fallbackXAxis = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

const normalizeTaskSeries = (taskRows: any[], alarmRows: any[]) => {
  const mergedRows = [...(Array.isArray(taskRows) ? taskRows : []), ...(Array.isArray(alarmRows) ? alarmRows : [])];

  if (!mergedRows.length) {
    return {
      xAxis: fallbackXAxis,
      seriesData: fallbackSeriesData,
    };
  }

  const dayMap = new Map<string, Map<string, number>>();
  const xAxis = fallbackXAxis;

  mergedRows.forEach((item: any, index: number) => {
    const seriesName =
      item.areaCode || item.areaName || item.taskType || item.typeName || item.name || `S${index + 1}`;
    const rawSeries =
      item.data ||
      item.values ||
      item.trend ||
      item.series ||
      item.countList ||
      item.valueList ||
      [];

    const normalized = Array.isArray(rawSeries)
      ? rawSeries.slice(0, 7).map((val: any) => Number(val || 0))
      : [];

    if (normalized.length) {
      dayMap.set(
        seriesName,
        new Map(normalized.map((value: number, dayIndex: number) => [xAxis[dayIndex], value]))
      );
      return;
    }

    const dayKey = item.day || item.weekDay || item.label;
    const dayName =
      typeof dayKey === 'number'
        ? xAxis[Math.max(0, Math.min(xAxis.length - 1, dayKey - 1))]
        : dayKey || xAxis[index % xAxis.length];
    const value = Number(item.taskCount || item.count || item.total || item.value || 0);
    const currentSeries = dayMap.get(seriesName) || new Map<string, number>();
    currentSeries.set(dayName, value);
    dayMap.set(seriesName, currentSeries);
  });

  const seriesData = Array.from(dayMap.entries())
    .slice(0, 4)
    .map(([name, values]) => ({
      name,
      data: xAxis.map((day) => values.get(day) || 0),
    }));

  return {
    xAxis,
    seriesData: seriesData.length ? seriesData : fallbackSeriesData,
  };
};

const Tasks: React.FC = () => {
  const { data } = useRequest(async () => {
    try {
      const [taskRes, alarmRes] = await Promise.allSettled([
        CurrentTaskSummary({}),
        GetAreaLocationAlarmsSummary({}),
      ]);

      const taskRows =
        taskRes.status === 'fulfilled'
          ? taskRes.value?.resultData?.list || taskRes.value?.resultData || []
          : [];
      const alarmRows =
        alarmRes.status === 'fulfilled'
          ? alarmRes.value?.resultData?.list || alarmRes.value?.resultData || []
          : [];

      return normalizeTaskSeries(taskRows, alarmRows);
    } catch (error) {
      return {
        xAxis: fallbackXAxis,
        seriesData: fallbackSeriesData,
      };
    }
  }, config);

  const backgroundColor = '#101736';
  const color = ['#EAEA26', '#906BF9', '#FE5656', '#01E17E', '#3DD1F9', '#FFAD05']; //2个以上的series就需要用到color数组
  const legend = {
    //data，就是取得每个series里面的name属性。
    orient: 'horizontal',
    icon: 'circle', //图例形状
    //圆点大小
    padding: 0,
    top: 15,
    right: 10,
    itemWidth: 6, //小圆点宽度
    itemHeight: 6, // 小圆点高度
    itemGap: 6, // 图例每项之间的间隔。[ default: 10 ]横向布局时为水平间隔，纵向布局时为纵向间隔。
    textStyle: {
      fontSize: 12,
      color: '#ffffff',
    },
  };
  const tooltip = {
    show: true,
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
    },
  };
  let seriesData = data?.seriesData || fallbackSeriesData;
  const commonConfigFn = (index) => {
    return {
      type: 'line',
      smooth: true,
      symbol: 'emptyCircle', //空心小圆点。线条小圆点形状
      symbolSize: 6, //小圆点大小
      itemStyle: {
        //还是小圆点设置
      },

      label: {
        show: false, //不显示小圆点上的label文字
      },
      lineStyle: {
        width: 1, //线条设置
      },

      areaStyle: {
        //填充线条下面的面积区域颜色。（areaStyle只是锦上添花）
        opacity: 0.4,
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: color[index], // 上处的颜色
            },
            {
              offset: 1,
              color: 'transparent', // 下处的颜色
            },
          ],
          global: false, // 缺省为 false
        },
      },
    };
  };

  seriesData = seriesData.map((item, index) => ({ ...item, ...commonConfigFn(index) }));
  const option = {
    color,
    tooltip,
    legend,
    grid: {
      top: '15%',
      left: '3%',
      right: '4%',
      bottom: '5%',
      containLabel: true,
    },

    xAxis: {
      show: true, //显示x轴+x轴label文字
      type: 'category',
      boundaryGap: false, //从Y轴出发，这个false很好的
      axisLine: {
        show: true, //显示x坐标轴轴线
        lineStyle: {
          color: 'rgba(255,255,255,.4)',
        },
      },
      axisTick: {
        show: false, //不显示x坐标1cm刻度
      },
      axisLabel: {
        color: '#ffffff', //x轴label文字颜色
      },
      splitLine: {
        show: false, //不显示grid竖向分割线
      },

      data: data?.xAxis || fallbackXAxis,
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: '#ffffff',
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: 'rgba(255,255,255,.4)',
        },
      },
      splitLine: {
        show: false, //不显示grid水平分割线
      },
    },

    series: seriesData,
  };

  return (
    <div>
      <ReactECharts style={{ height: '250px' }} option={option} />
    </div>
  );
};

export default Tasks;
