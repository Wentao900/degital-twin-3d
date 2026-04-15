# Claude 修改需求（数字孪生 3D 仓库 / Factory 场景）

请你以“资深 React + TypeScript + Three.js + @react-three/fiber（R3F）工程师”的身份，在本仓库代码中完成以下功能改动。要求：**尽量最小改动、复用现有组件与数据结构、保持项目可运行**，并在输出中给出你改动/新增的文件清单与验证步骤。

> 仓库为 pnpm workspace / turbo monorepo。3D 场景主要在：`packages/three/Canva/components/Factory`。

---

## 0. 你需要先做的定位（必须先回答再开始改）

请先快速扫描代码并用要点回答：

1) **货架（rack/shelf）目前由哪些组件渲染？**（文件路径 + 组件名 + 在哪里被引用）
2) **货物箱子（goods/box）目前由哪些组件渲染？**（例如是否已有 `Goods` / `GoodsItem`，文件路径 + 组件名）
3) `packages/three/Canva/components/Factory/index.tsx` 的场景树结构概览（哪些子组件构成场景）
4) 当前点击事件/交互方式是否已经存在（例如 onPointerDown/onClick、Raycaster、Selection 状态）？如果有，指出位置。

完成以上定位后，再开始实现下列目标。

---

## 1) 目标一：移除三维模型“货架”

### 需求
- **货架在 3D 场景中不再显示**（不论它是模型、Mesh、InstancedMesh、还是由几何体拼出来）。
- 不要影响其他对象：地面、房屋/墙体、车辆、箱子、环境模型等仍然显示。

### 注意事项
- 如果当前箱子位置依赖“货架组”的坐标/层级（例如箱子是 rack 的子节点或用 rack 计算坐标），请改为**用纯数据坐标摆放箱子**，不要再依赖 rack 对象层级。

### 验收
- 运行后货架完全消失，但场景仍能正常渲染。
- 控制台无新的报错（除非原本就有）。

---

## 2) 目标二：箱子改为“多堆货物”（clusters/piles），每堆对应一个货主

### 需求（数据结构）
请在 `packages/three/Canva/components/Factory/data` 附近新增或改造数据（不要把硬编码散落在组件里），形成类似结构（字段可增减，但要表达清楚）：

```ts
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
  position: [number, number, number]; // 堆的世界坐标
  layout: {
    rows: number;   // 每层行数
    cols: number;   // 每层列数
    levels: number; // 层数（高度）
    gap: number;    // 箱子间距
  };
  box: {
    size: [number, number, number];   // 单箱尺寸
    color?: string;                  // 默认颜色（用于区分货主/堆）
    textureUrl?: string;             // 可选：复用现有贴图逻辑
  };
};
```

### 需求（3D 表现）
- 场景中出现**多堆箱子**，每一堆是一个 `group`。
- 一堆内由多个箱子（box mesh）组成，按照 `layout` 做规则摆放：
  - 默认：x/z 平面网格排列，y 轴叠高（levels）。
  - 箱子之间留 `gap`，避免重叠。
- 每堆的坐标由数据驱动（`position`），不要依赖货架。

### 实现建议
- 尽量复用现有 `Goods`/`GoodsItem`（如果已有），或在其基础上抽象出可重复摆放的 `GoodsPile` 组件。
- 如果现有箱子材质使用贴图（例如 `goods_texture.png`），可继续使用，但要确保 URL 兼容 base。

### 验收
- 至少 3 堆货物可见（每堆数量明显不同更好，便于验证）。
- 每堆对应不同货主信息（ownerId/ownerName 不同）。

---

## 3) 目标三：交互点击某一堆货物，展示对应货主信息

### 需求（交互）
- 点击某一堆中的任意箱子，都算点击该堆。
- 点击后需要：
  1) **高亮选中的堆**（尽量轻量实现：改材质颜色/透明度/描边其一即可）。
  2) **展示该堆的货主信息 UI**（弹窗/侧边栏/浮层均可，选择最贴合现有 UI 的方式）。
- 再次点击其他堆：切换选中与信息展示。
- 点击空白处：取消选中并关闭信息展示（如果实现成本很低就做；否则给出明确 TODO 与原因）。

### 状态管理约束
- 优先使用 `useState` 在 Factory 场景组件内管理：
  - `selectedPileId: string | null`
  - `selectedOwner: GoodsOwner | null`（或通过 pileId 反查）
- **不要引入新的全局状态库**；不要把这个需求升级成 MobX/Redux 重构。

### R3F 事件建议
- 使用 R3F 的事件系统：`onPointerDown` / `onClick`。
- 在箱子 mesh 或 pile group 上加 `onPointerDown={(e) => { e.stopPropagation(); ... }}`，避免事件穿透。
- 在 Canvas 或场景根 group 上加 `onPointerMissed`（或等价方案）用于点击空白处取消选中。

### UI 展示建议
- 如果项目已使用 antd：可用 `Modal` / `Drawer` / `Card`。
- 信息最少展示：`ownerName`、`ownerId`、`phone`、`address`、`note`。

### 验收
- 点击不同堆，UI 显示对应货主信息且可关闭。
- 选中堆在 3D 中有明显高亮反馈。

---

## 4) 资源路径（重要约束：base path）

本项目 dev/base 可能为 `/degital-twin-3d/`，因此**不要直接写死** `/static/...` 去加载资源。

仓库已提供工具函数（请复用，不要另造轮子）：
- `packages/three/Canva/utils/assetUrl.ts`：`assetUrl('/static/...')` 会基于 `import.meta.env.BASE_URL` 拼接正确路径。

如果你新增任何贴图/模型/JSON 字体等资源路径，请统一写成：
- `assetUrl('/static/xxx')`

---

## 5) 交付内容（你最终输出需要包含）

1) 你修改/新增的文件清单（逐条列出文件路径）。
2) 关键实现点说明：
   - 货架如何被移除
   - 货物堆数据如何组织
   - 点击选中/取消选中的事件如何实现
   - 高亮策略
   - UI 展示策略
3) 验证步骤（命令 + 预期现象）：
   - `pnpm -C apps/admin dev -- --port 9001 --host 127.0.0.1`（或项目实际 dev 命令）
   - 打开页面后应该看到：无货架、多堆箱子、点击显示货主信息

---

## 6) 非目标（不要做）

- 不要做大型重构（例如重写场景架构/替换渲染方案）。
- 不要引入新依赖（除非是项目内已存在且必要的）。
- 不要改变与本需求无关的 UI/路由/权限逻辑。
- 不要把所有 warning 都当成必须修复（除非阻塞构建/运行）。

