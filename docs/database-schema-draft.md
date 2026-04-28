# 数字孪生仓储系统数据库设计草案

## 1. 文档说明

本文档用于给当前数字孪生仓储系统提供数据库结构设计草案，目标是支撑以下业务域：

- 认证与权限
- 仓库与区域管理
- 库位与库存管理
- 设备与传感器
- 告警管理
- 摄像头与视频事件
- 报表与导出任务

本文档以关系型数据库为基础进行设计，推荐优先使用 `PostgreSQL` 或 `MySQL 8+`。

## 2. 设计原则

- 主键统一使用 `bigint` 或 `uuid`
- 公共审计字段统一保留
- 状态字段统一标准化
- 实时数据和历史数据分层存储
- 查询高频表预留组合索引
- 时序型数据支持后续迁移到时序数据库

推荐公共字段：

- `id`
- `created_at`
- `created_by`
- `updated_at`
- `updated_by`
- `is_deleted`

## 3. 逻辑分域

建议拆分为以下数据域：

- 用户权限域
- 仓储基础域
- 设备传感域
- 告警事件域
- 视频监控域
- 报表任务域

## 4. 用户权限域

### 4.1 用户表 `sys_user`

字段建议：

- `id`
- `username`
- `password_hash`
- `nickname`
- `phone`
- `email`
- `status`
- `last_login_at`
- `remark`
- `created_at`
- `updated_at`
- `is_deleted`

索引建议：

- `uk_username`
- `idx_status`

### 4.2 角色表 `sys_role`

字段建议：

- `id`
- `role_code`
- `role_name`
- `status`
- `remark`
- `created_at`
- `updated_at`
- `is_deleted`

### 4.3 权限表 `sys_permission`

字段建议：

- `id`
- `permission_code`
- `permission_name`
- `permission_type`
- `status`
- `remark`

### 4.4 菜单表 `sys_menu`

字段建议：

- `id`
- `parent_id`
- `menu_code`
- `menu_name`
- `path`
- `icon`
- `filepath`
- `sort_no`
- `visible`
- `status`

### 4.5 用户角色关系表 `sys_user_role`

字段建议：

- `id`
- `user_id`
- `role_id`

唯一约束建议：

- `uk_user_role(user_id, role_id)`

### 4.6 角色权限关系表 `sys_role_permission`

字段建议：

- `id`
- `role_id`
- `permission_id`

### 4.7 角色菜单关系表 `sys_role_menu`

字段建议：

- `id`
- `role_id`
- `menu_id`

### 4.8 用户仓库权限表 `sys_user_warehouse_scope`

用于控制不同用户可见的仓库范围。

字段建议：

- `id`
- `user_id`
- `warehouse_id`

## 5. 仓储基础域

### 5.1 仓库表 `wh_warehouse`

字段建议：

- `id`
- `warehouse_code`
- `warehouse_name`
- `warehouse_type`
- `status`
- `address`
- `longitude`
- `latitude`
- `manager_name`
- `manager_phone`
- `description`

索引建议：

- `uk_warehouse_code`
- `idx_status`

### 5.2 区域表 `wh_area`

字段建议：

- `id`
- `warehouse_id`
- `area_code`
- `area_name`
- `area_type`
- `floor_no`
- `status`
- `description`

索引建议：

- `idx_warehouse_id`
- `uk_area_code_warehouse`

### 5.3 库位表 `wh_location`

字段建议：

- `id`
- `warehouse_id`
- `area_id`
- `location_code`
- `location_type`
- `capacity`
- `used_capacity`
- `location_status`
- `x_coord`
- `y_coord`
- `z_coord`

说明：

- `x_coord/y_coord/z_coord` 用于后续和 2D/3D 场景做空间映射

索引建议：

- `idx_warehouse_area`
- `uk_location_code`
- `idx_location_status`

### 5.4 物料表 `inv_item`

字段建议：

- `id`
- `item_code`
- `item_name`
- `item_category`
- `item_spec`
- `unit`
- `status`

### 5.5 库存快照表 `inv_snapshot`

按时间记录库存快照，可用于报表和趋势统计。

字段建议：

- `id`
- `warehouse_id`
- `area_id`
- `location_id`
- `item_id`
- `quantity`
- `snapshot_date`
- `snapshot_time`

索引建议：

- `idx_snapshot_date`
- `idx_snapshot_wh_area`
- `idx_snapshot_item`

### 5.6 出入库流水表 `inv_flow`

字段建议：

- `id`
- `flow_no`
- `warehouse_id`
- `area_id`
- `location_id`
- `item_id`
- `flow_type`
- `quantity`
- `operator_id`
- `task_id`
- `operate_time`
- `remark`

说明：

- `flow_type` 建议枚举：`INBOUND`、`OUTBOUND`、`MOVE`

索引建议：

- `uk_flow_no`
- `idx_operate_time`
- `idx_wh_flow_type`

### 5.7 作业任务表 `biz_task_order`

字段建议：

- `id`
- `task_no`
- `warehouse_id`
- `task_type`
- `task_status`
- `source_area_id`
- `source_location_id`
- `target_area_id`
- `target_location_id`
- `priority`
- `start_time`
- `end_time`
- `duration_seconds`
- `remark`

索引建议：

- `uk_task_no`
- `idx_task_status`
- `idx_warehouse_id`

## 6. 设备传感域

### 6.1 设备表 `iot_device`

字段建议：

- `id`
- `device_code`
- `device_name`
- `device_type`
- `warehouse_id`
- `area_id`
- `location_id`
- `manufacturer`
- `model_no`
- `install_time`
- `status`
- `description`

说明：

- `device_type` 可包括 `AGV`、`FORKLIFT`、`CONVEYOR`、`PLC`、`CAMERA_GATEWAY`

索引建议：

- `uk_device_code`
- `idx_device_type`
- `idx_wh_area`

### 6.2 设备实时状态表 `iot_device_status`

字段建议：

- `id`
- `device_id`
- `online_status`
- `run_status`
- `power_percent`
- `speed`
- `position_x`
- `position_y`
- `position_z`
- `temperature`
- `last_report_time`

说明：

- 这张表保留设备最新状态，用于数字孪生主场景和监控页面快速查询

索引建议：

- `uk_device_id`
- `idx_online_status`

### 6.3 设备历史状态表 `iot_device_status_log`

字段建议：

- `id`
- `device_id`
- `online_status`
- `run_status`
- `power_percent`
- `speed`
- `position_x`
- `position_y`
- `position_z`
- `report_time`

说明：

- 用于做历史轨迹、利用率、时长分析

索引建议：

- `idx_device_report_time(device_id, report_time)`

### 6.4 传感器表 `iot_sensor`

字段建议：

- `id`
- `sensor_code`
- `sensor_name`
- `sensor_type`
- `warehouse_id`
- `area_id`
- `location_id`
- `device_id`
- `unit`
- `min_threshold`
- `max_threshold`
- `status`

说明：

- `sensor_type` 可包括：`temperature`、`humidity`、`dust`、`light`、`smoke`、`vibration`

索引建议：

- `uk_sensor_code`
- `idx_sensor_type`
- `idx_wh_area`

### 6.5 传感器实时值表 `iot_sensor_latest`

字段建议：

- `id`
- `sensor_id`
- `value`
- `collect_time`
- `quality_flag`

说明：

- 保留每个传感器的当前最新值

索引建议：

- `uk_sensor_id`

### 6.6 传感器历史值表 `iot_sensor_reading`

字段建议：

- `id`
- `sensor_id`
- `value`
- `collect_time`
- `quality_flag`

说明：

- 高频时序数据，后期可迁移至时序库

索引建议：

- `idx_sensor_collect_time(sensor_id, collect_time)`

## 7. 告警事件域

### 7.1 告警规则表 `alarm_rule`

字段建议：

- `id`
- `rule_code`
- `rule_name`
- `source_type`
- `source_ref_id`
- `alarm_type`
- `alarm_level`
- `rule_expression`
- `enabled`

说明：

- `source_type` 可包括 `SENSOR`、`DEVICE`、`CAMERA_EVENT`

### 7.2 告警事件表 `alarm_event`

字段建议：

- `id`
- `alarm_no`
- `warehouse_id`
- `area_id`
- `location_id`
- `source_type`
- `source_ref_id`
- `alarm_type`
- `alarm_level`
- `alarm_title`
- `alarm_content`
- `alarm_status`
- `first_occur_time`
- `last_occur_time`
- `close_time`

说明：

- `alarm_status` 建议枚举：`NEW`、`ACKED`、`PROCESSING`、`CLOSED`

索引建议：

- `uk_alarm_no`
- `idx_alarm_status`
- `idx_alarm_time`
- `idx_wh_area_level`

### 7.3 告警处理记录表 `alarm_process_log`

字段建议：

- `id`
- `alarm_id`
- `action_type`
- `operator_id`
- `remark`
- `operate_time`

说明：

- `action_type` 可包括：`ACK`、`ASSIGN`、`CLOSE`

### 7.4 告警统计日表 `alarm_daily_stat`

字段建议：

- `id`
- `stat_date`
- `warehouse_id`
- `area_id`
- `alarm_type`
- `alarm_level`
- `alarm_count`

说明：

- 用于支持日、周、月图表快速查询

索引建议：

- `idx_stat_date`
- `idx_wh_area_type_level`

## 8. 视频监控域

### 8.1 摄像头表 `video_camera`

字段建议：

- `id`
- `camera_code`
- `camera_name`
- `warehouse_id`
- `area_id`
- `location_id`
- `camera_type`
- `manufacturer`
- `model_no`
- `install_time`
- `online_status`
- `status`
- `remark`

说明：

- `camera_type` 可包括：`fixed`、`ptz`、`thermal`

索引建议：

- `uk_camera_code`
- `idx_wh_area`
- `idx_online_status`

### 8.2 摄像头流配置表 `video_camera_stream`

字段建议：

- `id`
- `camera_id`
- `source_protocol`
- `source_url`
- `play_protocol`
- `play_url`
- `stream_status`
- `last_heartbeat_time`

说明：

- `source_protocol` 可为 `RTSP`、`GB28181`
- `play_protocol` 可为 `HLS`、`WebRTC`

索引建议：

- `uk_camera_id`

### 8.3 摄像头快照表 `video_camera_snapshot`

字段建议：

- `id`
- `camera_id`
- `snapshot_url`
- `snapshot_time`
- `event_id`

### 8.4 视频事件表 `video_camera_event`

字段建议：

- `id`
- `camera_id`
- `warehouse_id`
- `area_id`
- `event_type`
- `event_level`
- `event_title`
- `event_desc`
- `snapshot_url`
- `video_clip_url`
- `event_time`

说明：

- `event_type` 可包括：`intrusion`、`smoke`、`blockage`、`offline`

索引建议：

- `idx_camera_event_time`
- `idx_wh_area_event`

## 9. 报表任务域

### 9.1 报表任务表 `report_task`

字段建议：

- `id`
- `task_no`
- `report_type`
- `file_type`
- `params_json`
- `status`
- `progress`
- `created_by`
- `start_time`
- `finish_time`
- `error_message`

说明：

- `status` 建议枚举：`PENDING`、`RUNNING`、`SUCCESS`、`FAILED`

索引建议：

- `uk_task_no`
- `idx_status`
- `idx_created_by`

### 9.2 报表文件表 `report_file`

字段建议：

- `id`
- `task_id`
- `file_name`
- `file_path`
- `file_url`
- `file_size`
- `expire_time`

## 10. 场景映射扩展建议

为了让后续 3D 场景和业务实体联动，建议为需要在场景中定位的实体保留空间映射字段。

可选做法：

### 10.1 直接在业务表保留坐标

适用于：

- `wh_location`
- `iot_device_status`
- `video_camera`

优点：

- 简单直接

缺点：

- 当同一实体存在多套场景坐标时扩展性差

### 10.2 独立场景映射表 `scene_entity_mapping`

字段建议：

- `id`
- `scene_code`
- `entity_type`
- `entity_id`
- `x_coord`
- `y_coord`
- `z_coord`
- `rotation_x`
- `rotation_y`
- `rotation_z`
- `scale_value`

说明：

- 更适合后续切换不同场景、不同模型版本

## 11. 推荐枚举

### 11.1 通用状态

- `ENABLED`
- `DISABLED`

### 11.2 在线状态

- `ONLINE`
- `OFFLINE`

### 11.3 作业任务状态

- `PENDING`
- `RUNNING`
- `DONE`
- `FAILED`
- `CANCELED`

### 11.4 告警等级

- `INFO`
- `WARN`
- `LEVEL1`
- `LEVEL2`
- `LEVEL3`

### 11.5 告警状态

- `NEW`
- `ACKED`
- `PROCESSING`
- `CLOSED`

## 12. 索引策略建议

重点表索引建议如下：

- `alarm_event`
  按 `warehouse_id + area_id + alarm_status + last_occur_time`
- `iot_sensor_reading`
  按 `sensor_id + collect_time`
- `iot_device_status_log`
  按 `device_id + report_time`
- `inv_flow`
  按 `warehouse_id + flow_type + operate_time`
- `video_camera_event`
  按 `camera_id + event_time`

## 13. 分库分表与冷热分离建议

当数据量增长后，建议优先考虑以下演进：

- `iot_sensor_reading` 做月分表或按时间分区
- `iot_device_status_log` 做时间分区
- `alarm_event` 历史归档
- `video_camera_event` 历史归档
- `report_task` 保留近 3-6 个月在线数据

## 14. 一期最小表范围

如果要快速支撑一期交付，建议先建以下最小集合：

- `sys_user`
- `sys_role`
- `sys_menu`
- `sys_user_role`
- `sys_role_menu`
- `wh_warehouse`
- `wh_area`
- `wh_location`
- `iot_sensor`
- `iot_sensor_latest`
- `iot_sensor_reading`
- `iot_device`
- `iot_device_status`
- `alarm_event`
- `alarm_daily_stat`
- `video_camera`
- `video_camera_stream`
- `report_task`
- `report_file`

## 15. 下一步建议

基于本设计草案，建议后续继续补充：

- 实体 ER 图
- SQL 建表初稿
- 字段字典与枚举清单
- 前后端字段映射表
