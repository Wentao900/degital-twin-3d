# 数字孪生仓储系统前端改造清单

## 1. 文档说明

本文档用于将前端改造工作拆分为可执行清单，直接对应当前仓库结构，便于按页面、路由、菜单、API 和组件逐步实施。

目标：

- 替换当前 mock 登录和 mock 菜单
- 新增“数据分析”入口
- 新增“视频监控”入口
- 为多仓库、多摄像头、多传感器分析提供前端骨架
- 将当前静态大屏逐步改造成真实业务驱动页面

## 2. 当前前端结构判断

当前主应用目录：

- `apps/admin/src`

当前主要模块：

- `pages/dashboard`
- `pages/alarm`
- `pages/login`
- `routes`
- `common/mock`

当前问题：

- 菜单依赖本地 `MenuData`
- 登录依赖本地 token mock
- 多个大屏组件直接写死静态数据
- 没有统一的领域页面组织方式

## 3. 菜单改造清单

### 3.1 目标菜单结构

建议一级菜单改为：

- 数字孪生
- 告警中心
- 数据分析
- 视频监控
- 系统管理

建议二级菜单示例：

- 数字孪生
  - 孪生场景
- 告警中心
  - 实时告警
  - 历史告警
- 数据分析
  - 仓库分析
  - 传感器分析
  - 设备分析
  - 报表中心
- 视频监控
  - 监控总览
  - 摄像头详情
- 系统管理
  - 用户管理
  - 角色管理
  - 仓库管理
  - 传感器管理
  - 摄像头管理

### 3.2 需要改动的现有文件

#### 文件：`apps/admin/src/common/mock/index.tsx`

当前作用：

- 本地定义菜单

改造建议：

- 短期：先扩充为新版菜单结构，便于页面骨架开发
- 中期：彻底替换为后端返回菜单

#### 文件：`apps/admin/src/app.tsx`

当前作用：

- 根据 token 判断 admin/user，再加载本地菜单

改造建议：

- 删除当前基于用户名的菜单分支逻辑
- 改为登录后请求菜单接口
- 将菜单写入 store

## 4. 路由改造清单

### 4.1 需要调整的现有文件

#### 文件：`apps/admin/src/routes/index.tsx`

当前作用：

- 默认路由
- 懒加载页面
- 基于菜单动态注入页面

改造建议：

- 保留动态注入机制
- 将默认首页仍指向 `dashboard`
- 为新增页面准备 path 和 filepath
- 保留 layout 和鉴权包装

### 4.2 目标路由建议

建议主路由：

- `/dashboard`
- `/alarm`
- `/analytics`
- `/analytics/warehouse`
- `/analytics/sensors`
- `/analytics/devices`
- `/analytics/reports`
- `/video-monitor`
- `/video-monitor/camera-detail`
- `/systemManagement/userManagement`
- `/systemManagement/roleManagement`
- `/systemManagement/warehouseManagement`
- `/systemManagement/sensorManagement`
- `/systemManagement/cameraManagement`

## 5. 登录与权限改造清单

### 5.1 需要改动的现有文件

#### 文件：`packages/hooks/module/context.ts`

当前问题：

- `signIn` 只是 `sleep + localStorage`

改造建议：

- 调用真实登录接口
- 存储后端返回 token
- 视需要同时存储 refresh token
- 登录成功后拉取当前用户和菜单

#### 文件：`apps/admin/src/pages/login/index.tsx`

当前问题：

- 表单提交后未发真实请求

改造建议：

- 接入 `POST /api/auth/login`
- 根据接口响应处理错误信息
- 登录成功后跳转首页

#### 文件：`packages/store/module/reducers/user.ts`

改造建议：

- 增加 `userInfo`
- 增加 `permissions`
- 增加 `warehouseScope`
- 保留 `token` 和 `menu`

## 6. API 层改造清单

### 6.1 需要新增的 API 模块

建议在 `packages/apis/module/admin/` 下新增：

- `auth.ts`
- `analytics.ts`
- `camera.ts`
- `warehouse.ts`
- `sensor.ts`
- `device.ts`
- `report.ts`

### 6.2 现有 API 文件调整建议

#### 文件：`packages/apis/module/admin/dashboard.ts`

改造建议：

- 保留当前兼容接口
- 后续把真正的分析接口拆到 `analytics.ts`

#### 文件：`packages/apis/module/admin/alarm.ts`

改造建议：

- 保留当前兼容接口
- 后续补充通用告警接口：
  - 当前告警
  - 历史告警
  - 告警确认
  - 告警关闭

### 6.3 统一请求层建议

#### 文件：`packages/apis/module/request.ts`

当前问题：

- 仅导出 `umi-request`，无统一拦截器

改造建议：

- 增加 token 注入
- 增加统一错误处理
- 增加 401 跳转登录
- 增加后端统一返回结构适配

## 7. 页面改造清单

### 7.1 数字孪生主场景 `dashboard`

#### 现有目录

- `apps/admin/src/pages/dashboard`

#### 改造目标

- 保留 3D 主场景
- 将统计型内容逐步外迁到“数据分析”
- 增加跳转到分析页和视频页的联动入口

#### 需要替换的静态模块

- `left/modules/AgvPanel.tsx`
- `right/modules/Allerway.tsx`
- `right/modules/Statistics.tsx`
- `right/modules/Tasks.tsx`
- `left/modules/Task.tsx`
- `left/modules/Buffer.tsx`

#### 改造建议

- `Buffer.tsx`
  改为真实仓位利用率或区域占用排行
- `AgvPanel.tsx`
  改为真实 AGV 状态列表
- `Allerway.tsx`
  改为真实出入库流水
- `Statistics.tsx`
  改为真实出入库趋势
- `Tasks.tsx`
  改为真实任务分布或任务量趋势

### 7.2 告警中心 `alarm`

#### 现有目录

- `apps/admin/src/pages/alarm`

#### 改造目标

- 保留当前日/周/月分析
- 新增历史告警与处理能力

#### 改造建议

- 在当前页面增加筛选栏
- 增加“历史告警列表”模块
- 增加“告警处理状态”统计
- 为告警项增加联动视频入口

## 8. 新增页面清单

### 8.1 数据分析模块

建议新增目录：

- `apps/admin/src/pages/analytics/index.tsx`
- `apps/admin/src/pages/analytics/warehouse.tsx`
- `apps/admin/src/pages/analytics/sensors.tsx`
- `apps/admin/src/pages/analytics/devices.tsx`
- `apps/admin/src/pages/analytics/reports.tsx`

#### 页面职责建议

`index.tsx`

- 作为分析模块入口页
- 放置筛选器、概览卡片、导航 tab

`warehouse.tsx`

- 库位利用率
- 库存结构
- 吞吐趋势
- 区域热力

`sensors.tsx`

- 温湿度
- 粉尘
- 光照
- 烟感
- 异常时间段

`devices.tsx`

- AGV 在线率
- 电量分布
- 故障排行
- 运行时长

`reports.tsx`

- 报表筛选
- 导出任务列表
- 下载记录

### 8.2 视频监控模块

建议新增目录：

- `apps/admin/src/pages/video-monitor/index.tsx`
- `apps/admin/src/pages/video-monitor/camera-detail.tsx`

#### 页面职责建议

`index.tsx`

- 仓库树
- 摄像头列表
- 视频宫格
- 事件列表

`camera-detail.tsx`

- 摄像头信息
- 在线状态
- 流地址信息
- 快照
- 最近事件

### 8.3 系统管理扩展模块

建议新增目录：

- `apps/admin/src/pages/systemManagement/warehouseManagement/index.tsx`
- `apps/admin/src/pages/systemManagement/sensorManagement/index.tsx`
- `apps/admin/src/pages/systemManagement/cameraManagement/index.tsx`

## 9. 组件层改造建议

### 9.1 建议新增的通用组件

建议在 `apps/admin/src/components` 或共享组件包中补充：

- `FilterBar`
  通用筛选栏
- `StatCard`
  数据卡片
- `TrendChart`
  通用趋势图封装
- `DataTablePanel`
  表格面板
- `VideoPlayerPanel`
  视频播放器封装
- `CameraTree`
  摄像头树
- `ExportTaskTable`
  导出任务列表

### 9.2 建议补充的 3D 联动组件

- `EntityDetailDrawer`
  点选设备/区域后展示详情
- `SceneToolbar`
  场景联动工具栏
- `SceneLinkButton`
  跳转到分析页或视频页

## 10. 状态管理改造建议

### 10.1 Redux store 建议新增状态

建议在当前 store 中增加：

- `auth`
  - `token`
  - `userInfo`
  - `permissions`
- `menu`
  - `menuTree`
- `warehouse`
  - `currentWarehouseId`
  - `warehouseList`
- `video`
  - `selectedCameraIds`
  - `cameraLayout`

### 10.2 MobX 与 Redux 边界建议

当前项目中：

- Redux 更适合业务数据
- MobX 更适合 3D 场景交互状态

建议边界：

- 业务鉴权、菜单、仓库选择、分析筛选使用 Redux
- 场景相机状态、场景控制器状态继续保留在 MobX

## 11. UI 层设计建议

### 11.1 数据分析模块

设计建议：

- 使用顶部筛选栏
- 用多个图表卡片分区
- 支持大屏模式和普通后台模式兼容

交互建议：

- 所有图表支持切换时间粒度
- 支持点击图表跳详情
- 支持导出当前筛选条件结果

### 11.2 视频监控模块

设计建议：

- 左侧树 + 中间宫格 + 右侧详情
- 顶部可切换 1/4/9 宫格
- 支持打开单路全屏

交互建议：

- 告警点击后自动联动摄像头
- 区域点击后过滤摄像头
- 摄像头离线状态显式提示

## 12. 分阶段前端实施顺序

### 第一阶段

- 替换登录 mock
- 替换菜单 mock
- 补请求拦截器
- 补用户信息和菜单加载流程

### 第二阶段

- 新增“数据分析”菜单和页面骨架
- 新增分析 API 模块
- 接入仓库分析和传感器分析

### 第三阶段

- 新增“视频监控”菜单和页面骨架
- 新增视频 API 模块
- 接入摄像头列表和播放地址

### 第四阶段

- 驾驶舱静态卡片替换为真实接口
- 告警与视频联动
- 3D 场景与分析/视频联动

## 13. 建议的开发任务拆分

### 任务组 A：鉴权与菜单

- 登录接口接入
- 当前用户接口接入
- 菜单接口接入
- 请求拦截器

### 任务组 B：数据分析模块

- 分析模块页面骨架
- 图表组件封装
- 分析接口接入
- 导出任务接入

### 任务组 C：视频监控模块

- 视频模块页面骨架
- 摄像头树组件
- 播放器封装
- 摄像头接口接入

### 任务组 D：数字孪生主场景升级

- AGV 数据接入
- 出入库流水接入
- 仓库统计接入
- 任务图表接入

## 14. 一期最小可视化范围建议

如果需要快速给出新版本 UI，建议一期前端最小范围为：

- 登录与菜单真实化
- 新增“数据分析”一级入口
- 新增“视频监控”一级入口
- 数据分析先完成：
  - 仓库分析
  - 传感器趋势
  - 报表导出入口
- 视频监控先完成：
  - 摄像头列表
  - 单路 / 四路播放
  - 在线状态展示

## 15. 下一步建议

在本清单基础上，后续建议继续生成：

- 实施任务分解表
- 页面字段映射表
- 前端 API 对接清单
