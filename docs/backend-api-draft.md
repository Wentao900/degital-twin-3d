# 数字孪生仓储系统后端接口文档草案

## 1. 文档说明

本文档是面向当前项目的后端接口草案，目标是为以下能力提供统一接口约定：

- 认证与权限
- 仓储基础数据
- 设备与传感器
- 告警管理
- 数据分析与报表导出
- 视频监控与摄像头接入

接口风格建议：

- 协议：`HTTP/HTTPS`
- 数据格式：`application/json`
- 认证方式：`Bearer Token`
- 时间格式：`YYYY-MM-DD HH:mm:ss`
- 分页参数：`pageNum`、`pageSize`

## 2. 通用返回结构

建议统一返回：

```json
{
  "code": 0,
  "message": "success",
  "resultData": {},
  "traceId": "9dd8f8f8d2a24e7a"
}
```

说明：

- `code = 0` 表示成功
- `message` 为结果说明
- `resultData` 为业务数据
- `traceId` 用于排查请求链路

分页返回建议：

```json
{
  "code": 0,
  "message": "success",
  "resultData": {
    "list": [],
    "total": 0,
    "pageNum": 1,
    "pageSize": 20
  },
  "traceId": "9dd8f8f8d2a24e7a"
}
```

## 3. 认证与权限

### 3.1 登录

`POST /api/auth/login`

请求体：

```json
{
  "username": "admin",
  "password": "123456"
}
```

响应：

```json
{
  "code": 0,
  "message": "success",
  "resultData": {
    "token": "jwt-token",
    "refreshToken": "refresh-token",
    "expiresIn": 7200,
    "user": {
      "id": 1,
      "username": "admin",
      "nickname": "管理员",
      "roles": ["admin"]
    }
  }
}
```

### 3.2 登出

`POST /api/auth/logout`

### 3.3 当前用户

`GET /api/auth/me`

响应字段建议：

- `id`
- `username`
- `nickname`
- `roles`
- `permissions`
- `warehouseIds`

### 3.4 菜单

`GET /api/auth/menus`

响应示例：

```json
{
  "code": 0,
  "message": "success",
  "resultData": [
    {
      "key": "digital-twin",
      "label": "数字孪生",
      "path": "dashboard",
      "icon": "DashboardOutlined",
      "filepath": "pages/dashboard/index.tsx"
    },
    {
      "key": "analytics",
      "label": "数据分析",
      "path": "analytics",
      "icon": "BarChartOutlined",
      "filepath": "pages/analytics/index.tsx"
    }
  ]
}
```

## 4. 仓储基础数据

### 4.1 仓库列表

`GET /api/warehouses`

查询参数：

- `keyword`
- `status`

响应字段建议：

- `id`
- `warehouseCode`
- `warehouseName`
- `status`
- `address`
- `manager`

### 4.2 仓库区域列表

`GET /api/warehouses/:warehouseId/areas`

响应字段建议：

- `id`
- `areaCode`
- `areaName`
- `areaType`
- `warehouseId`

### 4.3 仓库库位列表

`GET /api/warehouses/:warehouseId/locations`

查询参数：

- `areaId`
- `status`

响应字段建议：

- `id`
- `locationCode`
- `areaId`
- `areaName`
- `status`
- `capacity`
- `usedCapacity`

### 4.4 库存汇总

`GET /api/inventory/summary`

查询参数：

- `warehouseId`
- `areaId`
- `date`

响应示例：

```json
{
  "code": 0,
  "message": "success",
  "resultData": {
    "totalLocations": 1200,
    "usedLocations": 860,
    "emptyLocations": 340,
    "utilizationRate": 0.7167,
    "inventoryTotal": 53200
  }
}
```

### 4.5 出入库流水

`GET /api/inventory/flows`

查询参数：

- `warehouseId`
- `startTime`
- `endTime`
- `flowType`
- `pageNum`
- `pageSize`

响应字段建议：

- `id`
- `flowNo`
- `flowType`
- `warehouseId`
- `areaName`
- `locationCode`
- `itemCode`
- `itemName`
- `quantity`
- `operatorName`
- `operateTime`

### 4.6 任务列表

`GET /api/tasks`

查询参数：

- `warehouseId`
- `taskStatus`
- `taskType`
- `pageNum`
- `pageSize`

## 5. 当前前端兼容接口

这部分用于兼容当前前端已有 API 封装，建议在一期优先提供。

### 5.1 日告警统计

`GET /api/SystemWarning/GetSystemWarnInfoByDay`

查询参数：

- `DateParm`

响应示例：

```json
{
  "code": 0,
  "message": "success",
  "resultData": {
    "warnCount": 16,
    "warnListByType": [
      {
        "errortype": "AGV",
        "warnRate": 0.25,
        "warnCount": 4
      }
    ],
    "warnListBylevel": [
      {
        "errorLevel": "一级",
        "warnRate": 0.5,
        "warnCount": 8
      }
    ]
  }
}
```

### 5.2 当前告警列表

`GET /api/SystemWarning/GetCurrentWarns`

响应字段建议：

- `id`
- `errorType`
- `errorLevel`
- `errorArea`
- `errorMsg`
- `errorTime`
- `errorState`

### 5.3 周告警统计

`GET /api/SystemWarning/GetSystemWarnInfoByWeek`

查询参数：

- `StartDate`
- `Enddate`

响应字段建议：

- `warnDate`
- `warnCount`
- `errorType`

### 5.4 月告警统计

`GET /api/SystemWarning/GetSystemWarnInfoByMonth`

查询参数：

- `DateParm`

### 5.5 当前库位汇总

`GET /api/Summary/GetCurrentLocationSummary`

响应字段建议：

- `totalLocationCount`
- `usedLocationCount`
- `emptyLocationCount`
- `locationDetails`

### 5.6 一周库位统计

`GET /api/Area/GetAreaLocationWeekSummary`

响应示例：

```json
{
  "code": 0,
  "message": "success",
  "resultData": [
    {
      "reportDate": "2026-04-28 00:00:00",
      "emptyLocationTotal": 210
    }
  ]
}
```

## 6. 设备与传感器

### 6.1 设备列表

`GET /api/devices`

查询参数：

- `warehouseId`
- `deviceType`
- `status`

响应字段建议：

- `id`
- `deviceCode`
- `deviceName`
- `deviceType`
- `warehouseId`
- `areaId`
- `status`

### 6.2 设备实时状态

`GET /api/devices/status`

查询参数：

- `warehouseId`
- `deviceType`

响应字段建议：

- `deviceId`
- `deviceCode`
- `onlineStatus`
- `runStatus`
- `power`
- `speed`
- `position`
- `lastReportTime`

### 6.3 传感器列表

`GET /api/sensors`

响应字段建议：

- `id`
- `sensorCode`
- `sensorName`
- `sensorType`
- `warehouseId`
- `areaId`
- `deviceId`
- `unit`
- `status`

### 6.4 传感器实时值

`GET /api/sensors/latest`

查询参数：

- `warehouseId`
- `areaId`
- `sensorType`

响应示例：

```json
{
  "code": 0,
  "message": "success",
  "resultData": [
    {
      "sensorId": 101,
      "sensorCode": "TMP-001",
      "sensorType": "temperature",
      "value": 28.3,
      "unit": "C",
      "collectTime": "2026-04-28 14:00:00"
    }
  ]
}
```

### 6.5 传感器趋势

`GET /api/sensors/trend`

查询参数：

- `sensorId`
- `startTime`
- `endTime`
- `interval`

响应字段建议：

- `collectTime`
- `value`

### 6.6 传感器异常

`GET /api/sensors/anomalies`

查询参数：

- `warehouseId`
- `sensorType`
- `startTime`
- `endTime`

## 7. 告警域

### 7.1 当前告警

`GET /api/alarms/current`

查询参数：

- `warehouseId`
- `areaId`
- `alarmLevel`
- `alarmType`

### 7.2 历史告警

`GET /api/alarms/history`

查询参数：

- `warehouseId`
- `areaId`
- `alarmLevel`
- `alarmType`
- `status`
- `startTime`
- `endTime`
- `pageNum`
- `pageSize`

### 7.3 告警统计

`GET /api/alarms/statistics`

查询参数：

- `warehouseId`
- `startTime`
- `endTime`
- `groupBy`

响应字段建议：

- `totalCount`
- `byLevel`
- `byType`
- `byArea`
- `trend`

### 7.4 告警确认

`POST /api/alarms/:alarmId/ack`

请求体：

```json
{
  "remark": "已确认，待现场处理"
}
```

### 7.5 告警关闭

`POST /api/alarms/:alarmId/close`

请求体：

```json
{
  "remark": "已处理完成"
}
```

## 8. 数据分析

### 8.1 仓库分析汇总

`GET /api/analytics/warehouse/summary`

查询参数：

- `warehouseId`
- `date`

响应字段建议：

- `totalLocations`
- `usedLocations`
- `emptyLocations`
- `utilizationRate`
- `inventoryTotal`
- `inboundCount`
- `outboundCount`

### 8.2 仓库趋势分析

`GET /api/analytics/warehouse/trend`

查询参数：

- `warehouseId`
- `startDate`
- `endDate`
- `dimension`

响应字段建议：

- `date`
- `emptyLocationTotal`
- `usedLocationTotal`
- `utilizationRate`
- `inventoryTotal`

### 8.3 库存结构分析

`GET /api/analytics/inventory/structure`

查询参数：

- `warehouseId`
- `date`

响应字段建议：

- `categoryName`
- `quantity`
- `ratio`

### 8.4 任务分析

`GET /api/analytics/task/summary`

查询参数：

- `warehouseId`
- `startDate`
- `endDate`

响应字段建议：

- `taskTotal`
- `completedTotal`
- `timeoutTotal`
- `completionRate`
- `avgDuration`

### 8.5 传感器分析汇总

`GET /api/analytics/sensors/latest`

查询参数：

- `warehouseId`
- `sensorType`

### 8.6 传感器趋势分析

`GET /api/analytics/sensors/trend`

查询参数：

- `warehouseId`
- `sensorType`
- `startTime`
- `endTime`
- `interval`

### 8.7 设备分析

`GET /api/analytics/devices/summary`

查询参数：

- `warehouseId`
- `deviceType`
- `startTime`
- `endTime`

响应字段建议：

- `onlineRate`
- `faultCount`
- `avgRunTime`
- `avgPower`

## 9. 报表导出

### 9.1 创建导出任务

`POST /api/reports/export`

请求体示例：

```json
{
  "reportType": "warehouse-summary",
  "fileType": "xlsx",
  "warehouseId": 1,
  "startDate": "2026-04-01",
  "endDate": "2026-04-28"
}
```

响应示例：

```json
{
  "code": 0,
  "message": "success",
  "resultData": {
    "taskId": "report_20260428_001",
    "status": "PENDING"
  }
}
```

### 9.2 查询导出任务状态

`GET /api/reports/tasks/:taskId`

响应字段建议：

- `taskId`
- `status`
- `progress`
- `downloadUrl`
- `expireTime`

### 9.3 下载报表文件

`GET /api/reports/files/:fileId/download`

## 10. 视频监控

### 10.1 摄像头列表

`GET /api/cameras`

查询参数：

- `warehouseId`
- `areaId`
- `onlineStatus`
- `cameraType`
- `keyword`

响应字段建议：

- `id`
- `cameraCode`
- `cameraName`
- `warehouseId`
- `areaId`
- `cameraType`
- `onlineStatus`
- `streamProtocol`
- `lastHeartbeatTime`

### 10.2 摄像头详情

`GET /api/cameras/:cameraId`

### 10.3 摄像头播放地址

`GET /api/cameras/:cameraId/stream`

响应示例：

```json
{
  "code": 0,
  "message": "success",
  "resultData": {
    "cameraId": 10,
    "playProtocol": "webrtc",
    "playUrl": "https://media.example.com/webrtc/camera10?token=abc",
    "expireTime": "2026-04-28 16:00:00"
  }
}
```

说明：

- 浏览器端建议消费 `WebRTC` 或 `HLS`
- 不建议直接向前端暴露 RTSP 原始地址

### 10.4 摄像头快照

`GET /api/cameras/:cameraId/snapshot`

### 10.5 摄像头事件

`GET /api/cameras/:cameraId/events`

查询参数：

- `startTime`
- `endTime`
- `eventType`
- `pageNum`
- `pageSize`

响应字段建议：

- `id`
- `eventType`
- `eventLevel`
- `eventTime`
- `snapshotUrl`
- `description`

### 10.6 新增摄像头

`POST /api/cameras`

请求体字段建议：

- `cameraCode`
- `cameraName`
- `warehouseId`
- `areaId`
- `cameraType`
- `streamSource`
- `username`
- `password`
- `manufacturer`

### 10.7 修改摄像头

`PUT /api/cameras/:cameraId`

### 10.8 删除摄像头

`DELETE /api/cameras/:cameraId`

## 11. 实时推送建议

为了支撑数字孪生主场景、告警中心和视频联动，建议后续增加实时推送能力。

建议通道：

- `WebSocket`
- `SSE`

事件类型建议：

- `alarm.created`
- `alarm.updated`
- `sensor.updated`
- `device.updated`
- `camera.offline`
- `camera.event.created`

示例：

```json
{
  "eventType": "alarm.created",
  "eventTime": "2026-04-28 14:10:00",
  "payload": {
    "alarmId": 123,
    "alarmLevel": "一级",
    "alarmType": "temperature",
    "warehouseId": 1,
    "areaId": 12
  }
}
```

## 12. 错误码建议

建议保留统一错误码：

- `0` 成功
- `4001` 参数错误
- `4003` 未授权
- `4004` 资源不存在
- `4090` 资源冲突
- `5000` 系统内部错误

## 13. 一期最小可交付范围

如果要尽快支撑当前前端和新增模块，建议后端一期最小交付范围为：

- 登录、当前用户、菜单
- 当前前端兼容告警接口
- 当前前端兼容仓储统计接口
- 仓库列表、区域列表
- 传感器实时值和趋势
- 数据分析汇总和趋势接口
- 导出任务接口
- 摄像头列表和播放地址接口

## 14. 后续文档建议

建议继续补充以下配套文档：

- 数据库表结构设计
- 菜单与权限设计
- 视频流接入设计
- 前端页面字段映射表
