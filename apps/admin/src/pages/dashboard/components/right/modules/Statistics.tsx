import React from 'react';
import ReactECharts from 'echarts-for-react';
import { useRequest } from 'ahooks';
import { config } from '../../config';
import * as echarts from 'echarts/core';
import { GetDailyTaskSummary, GetInventoryInOutSumPeriod } from 'apis';

const fallbackChartData = {
  xdata: ['01/01', '01/02', '01/03', '01/04', '01/05'],
  currentYearList: [10, 20, 30, 40, 50],
  lastYearList: [20, 10, 30, 40, 20],
  rateDataOne: [10, 40, 20, 30, 50],
};

const normalizeStatistics = (flowRows: any[], summaryRows: any[]) => {
  if (!Array.isArray(flowRows) && !Array.isArray(summaryRows)) {
    return fallbackChartData;
  }

  const map = new Map<string, { current: number; last: number }>();

  (Array.isArray(flowRows) ? flowRows : []).forEach((item: any) => {
    const dateKey =
      (item.operateTime || item.time || item.createTime || '').toString().slice(5, 10) || '--/--';
    const current = Number(item.quantity || item.count || item.total || 0);
    const previous = Number(item.previousQuantity || item.lastQuantity || item.lastTotal || 0);

    map.set(dateKey, {
      current: (map.get(dateKey)?.current || 0) + current,
      last: (map.get(dateKey)?.last || 0) + previous,
    });
  });

  (Array.isArray(summaryRows) ? summaryRows : []).forEach((item: any) => {
    const dateKey =
      (item.reportDate || item.date || item.statDate || '').toString().slice(5, 10) || '--/--';
    const current = Number(item.currentTotal || item.taskTotal || item.inboundTotal || 0);
    const previous = Number(item.previousTotal || item.lastTotal || item.outboundTotal || 0);

    map.set(dateKey, {
      current: (map.get(dateKey)?.current || 0) + current,
      last: (map.get(dateKey)?.last || 0) + previous,
    });
  });

  const xdata = Array.from(map.keys());
  if (!xdata.length) return fallbackChartData;

  const currentYearList = xdata.map((key) => map.get(key)?.current || 0);
  const lastYearList = xdata.map((key) => map.get(key)?.last || 0);
  const rateDataOne = xdata.map((key) => {
    const current = map.get(key)?.current || 0;
    const last = map.get(key)?.last || 0;
    if (!last) return current ? 100 : 0;
    return Number((((current - last) / last) * 100).toFixed(0));
  });

  return {
    xdata,
    currentYearList,
    lastYearList,
    rateDataOne,
  };
};

const Statistics: React.FC = () => {
  const { data } = useRequest(async () => {
    try {
      const [flowRes, summaryRes] = await Promise.allSettled([
        GetInventoryInOutSumPeriod({
          startDate: '',
          endDate: '',
        }),
        GetDailyTaskSummary(),
      ]);

      const flowRows =
        flowRes.status === 'fulfilled'
          ? flowRes.value?.resultData?.list || flowRes.value?.resultData || []
          : [];
      const summaryRows =
        summaryRes.status === 'fulfilled'
          ? summaryRes.value?.resultData?.list || summaryRes.value?.resultData || []
          : [];

      return normalizeStatistics(flowRows, summaryRows);
    } catch (error) {
      return fallbackChartData;
    }
  }, config);

  const chartData = data || fallbackChartData;
  let dataZoomFlag = false;
  let zoomEnd = 100;
  if (chartData.xdata.length > 6) {
    dataZoomFlag = true;
    zoomEnd = 60;
  }
  let option = {
    grid: {
      top: '10%',
      left: '3%',
      right: '10%',
      bottom: '13%',
    },
    barWidth: 6,
    tooltip: {
      show: true,
      trigger: 'axis',
      formatter: (params) => {
        return (
          params[0].name +
          '<br/>' +
          params[0].seriesName +
          ':' +
          params[0].value +
          '<br/>' +
          params[1].seriesName +
          ':' +
          params[1].value +
          '<br/>' +
          params[2].seriesName +
          ':' +
          params[2].value +
          '%'
        );
      },
    },
    dataZoom: [
      {
        show: dataZoomFlag,
        realtime: true,
        height: 8,
        start: 0,
        textStyle: {
          show: false,
        },
        end: zoomEnd,
        borderColor: 'rgba(255,255,255,0.20)',
        backgroundColor: 'rgba(255,255,255,0.10)',
        bottom: '1%',
      },
      {
        type: 'inside',
        realtime: true,
        start: 0,
        end: 100,
      },
    ],
    xAxis: [
      {
        type: 'category',
        data: chartData.xdata,
        splitLine: {
          lineStyle: {
            color: 'rgba(255,255,255,0.2)',
          },
        },
        axisTick: {
          show: false,
        },
        axisLine: {
          //  改变x轴颜色
          lineStyle: {
            color: 'rgba(255,255,255,0.2)',
            type: 'solid',
          },
        },
        axisLabel: {
          //  改变x轴字体颜色和大小
          show: true,
          textStyle: {
            color: 'rgba(250,250,250,1)',
            fontSize: 12,
          },
        },
      },
    ],
    yAxis: [
      {
        name: '',
        nameTextStyle: {
          color: 'rgb(250,250,250,.7)',
          fontSize: 12,
          padding: [0, 25, 0, 0],
        },
        type: 'value',
        splitLine: {
          show: true,
          lineStyle: {
            color: 'rgba(255,255,255,0.1)',
            type: 'dotted',
          },
        },
        axisTick: {
          show: false,
        },
        axisLine: {
          //  改变y轴颜色
          show: false,
          lineStyle: {
            color: 'rgba(255,255,255,0.2)',
            type: 'solid',
          },
        },
        axisLabel: {
          //  改变y轴字体颜色和大小
          textStyle: {
            color: 'rgba(250,250,250,0.6)',
            fontSize: 12,
          },
        },
      },
      {
        name: '',
        nameTextStyle: {
          color: 'rgb(250,250,250,.7)',
          fontSize: 12,
          padding: [0, 0, 0, 40],
        },
        show: true,
        splitLine: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          textStyle: {
            fontSize: 12,
            color: 'rgba(255,255,255, .7)',
          },
        },
      },
    ],
    series: [
      {
        type: 'bar',
        barMinHeight: 0,
        name: '今年',
        itemStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: '#1AA0FF',
              },
              {
                offset: 1,
                color: 'rgba(3,14,55,0.6)',
              },
            ]),
            borderWidth: 2,
          },
        },
        data: chartData.currentYearList,
      },
      {
        type: 'bar',
        barMinHeight: 0,
        name: '去年',
        itemStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: '#FFBD46',
              },
              {
                offset: 1,
                color: 'rgba(3,14,55,0.6)',
              },
            ]),
            borderWidth: 2,
          },
        },
        data: chartData.lastYearList,
        barCategoryGap: '40%',
      },
      {
        z: 9,
        yAxisIndex: 1,
        name: '增幅',
        type: 'line',
        showAllSymbol: true,
        symbol: 'rect',
        symbolSize: 5,
        itemStyle: {
          color: '#fff',
          width: 1,
          shadowColor: '#fff',
          borderColor: '#44E5BE',
          shadowBlur: 2,
        },
        lineStyle: {
          width: 1,
          color: '#44E5BE',
        },
        data: chartData.rateDataOne,
      },
    ],
  };

  return (
    <>
      <div>
        <ReactECharts style={{ height: '200px' }} option={option} />
      </div>
    </>
  );
};

export default Statistics;
