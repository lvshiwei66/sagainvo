# Saga Invoice Design System

> A Polanyi-based design document for e-commerce invoice generation
> 
> "We can know more than we can tell." — Michael Polanyi
> 
> **Target**: International e-commerce sellers | **MVP**: Local-first, no auth required

---

## 目录

1. [产品定位](#1-产品定位)
2. [UI 哲学宣言](#2-ui-哲学宣言)
3. [核心交互范式](#3-核心交互范式)
4. [主工作区布局](#4-主工作区布局)
5. [关键界面组件](#5-关键界面组件)
6. [动态反馈机制](#6-动态反馈机制)
7. [Polanyi 悖论验证](#7-polanyi 悖论验证)
8. [视觉设计系统](#8-视觉设计系统)
9. [工程操作指南](#9-工程操作指南)

---

## 1. 产品定位

### 1.1 目标用户

**电商卖家** - 在 Amazon、Shopify、Etsy 等平台销售商品的中小卖家

**典型场景**：
- 给客户开具销售发票
- 为订单生成付款凭证
- 记录交易用于报税

### 1.2 核心价值主张

> 30 秒内完成一张专业发票的创建和发送

### 1.3 MVP 功能范围

| 功能 | MVP | 说明 |
|------|-----|------|
| 创建发票 | ✅ | 核心功能 |
| 本地保存 | ✅ | Browser localStorage |
| 导出 PDF | ✅ | 完整功能 |
| 导出 Excel | ✅ | 完整功能 |
| 发票模板 | ✅ | 基础模板 |
| 用户注册/登录 | ❌ | 延迟到 V2 |
| 云端同步 | ❌ | 延迟到 V2 |
| 支付集成 | ❌ | 延迟到 V2 |

### 1.4 发票格式（基于样例）

```
┌─────────────────────────────────────────────────────────────┐
│  INVOICE                                          INV-5081  │
│                                                     Date: Mar 23, 2026
│                                              Due Date: Jun 06, 2026
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  From:                        To:                           │
│  InvoiceCat LLC               John Smith                    │
│  100 Startup Lane             Acme Corp                     │
│  Austin, TX 73301             123 Business Ave              │
│  USA                          New York, NY 10001            │
│  billing@invoicecat.com       john@acme.com                 │
│  +1 (555) 000-1111            +1 (555) 123-4567             │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  Description          Quantity    Rate        Amount        │
│  ─────────────────────────────────────────────────────────  │
│  Database Design         33      ¥30.00      ¥990.00       │
│  SEO Optimization        17      ¥28.00      ¥476.00       │
│  Content Writing         29      ¥92.00     ¥2668.00       │
│  Brand Strategy          42     ¥140.00     ¥5880.00       │
│                                                             │
│                                          Subtotal: ¥12981.00
│                                          Tax (8%): ¥1038.48
│                                            Total: ¥14019.48
├─────────────────────────────────────────────────────────────┤
│  Notes:                         Terms:                      │
│  For any questions, please      Late payments subject to    │
│  contact us at the above email. 1.5% monthly service charge.│
│                                                             │
│              Powered by InvoiceCat.com                      │
└─────────────────────────────────────────────────────────────┘
```

**关键差异（相比中国发票）**：
- 无税号字段
- 无发票代码/发票号码（政府统一编码）
- 无密码区
- 无购买方/销售方标签（用 From/To）
- 税额百分比可配置（非固定 13%）
- 有到期日期（Due Date）
- 支持多行地址
- 支持添加备注和条款

---

## 2. UI 哲学宣言

### 2.1 Polanyi 视角下的工具设计

传统工具类软件的设计假设：**用户需要被教导如何操作**。

Polanyi 的假设：**用户已经知道如何操作，只需要正确的"提示物"**。

电商卖家对发票有天然的直觉认知——他们见过、收过、开过发票。我们的设计应该调用这种已有认知，而非重新发明一套交互语言。

### 2.2 四种默会设计原则

#### 原则一：默会优先 (Tacit First)

**定义**：界面上的每个元素都应该调用用户已有的商业直觉，而非创造新的交互语言。

**案例**：
- "INVOICE" 大标题在左上角 —— 这是全球通用的发票标识
- Invoice Number 和 Date 在右上角 —— 所有发票都这样排版
- From/To 分左右两栏 —— 符合商业信函格式
- 金额右对齐 —— 全球财务惯例

**反模式**：
- ❌ 用"魔法棒"图标代表"生成发票"
- ❌ 用"汉堡菜单"隐藏主要导航
- ❌ 用滑动解锁来确认保存

#### 原则二：辅助意识 → 焦点意识 (Subsidiary → Focal)

**定义**：界面本身应该退居"辅助意识"，让用户专注于"焦点意识"——发票内容和客户信息。

**案例**：
- 工具栏在不需要时自动收起
- 成功状态用绿色对勾暗示，而非弹窗告知
- 错误用红色边框标出字段，而非弹出错误列表

**反模式**：
- ❌ 每步操作后弹出"操作成功"提示框
- ❌ 向导式多步流程打断工作流
- ❌ 需要阅读说明才能理解功能

#### 原则三：不可言说性 (Ineffability)

**定义**：能用视觉传递的信息，绝不用文字说明。

**案例**：
- 可点击元素有阴影和悬停状态
- 必填字段用红色星号标记
- 已填写字段有绿色边框提示

**反模式**：
- ❌ "点击此处以上传文件"的冗长说明
- ❌ 满屏的工具提示 (tooltips)
- ❌ 需要阅读帮助文档才能上手

#### 原则四：个人承诺 (Personal Commitment)

**定义**：界面应该激发用户的专业认同感，让用户感觉自己在做"专业工作"而非"使用软件"。

**案例**：
- 专业的发票格式，符合国际惯例
- 精确到分的金额计算
- 像专业财务软件那样高效的数据录入

**反模式**：
- ❌ 过于卡通化的视觉风格
- ❌ 过于"友好"的口语化文案
- ❌ 像消费级应用那样的花哨动画

---

## 3. 核心交互范式

### 3.1 国际发票格式隐喻

**设计理念**：电商卖家对发票格式有天然认知。数字界面应该继承这种认知，而非重新发明。

**实现方式**：

```
┌─────────────────────────────────────────────────────────────┐
│  INVOICE                                          INV-001   │
│                                 Date: [Select Date  ▼]      │
│                          Due Date: [Select Date  ▼]         │
├─────────────────────────────────────────────────────────────┤
│  From (Your Business)         To (Client)                   │
│  ┌─────────────────────┐      ┌─────────────────────┐       │
│  │ [公司 Logo]         │      │ [客户名称*]         │       │
│  │ 公司名称            │      │ 客户公司            │       │
│  │ 街道地址            │      │ 街道地址            │       │
│  │ 城市，州 邮编        │      │ 城市，州 邮编         │       │
│  │ 国家                │      │ 国家                │       │
│  │ 邮箱                │      │ 邮箱                │       │
│  │ 电话                │      │ 电话                │       │
│  └─────────────────────┘      └─────────────────────┘       │
├─────────────────────────────────────────────────────────────┤
│  Item Description          Qty     Rate      Amount         │
│  ──────────────────────────────────────────────────────────  │
│  [输入商品/服务名称____]   [  ]   [     ]   [       ]  [×]  │
│  [输入商品/服务名称____]   [  ]   [     ]   [       ]  [×]  │
│  [输入商品/服务名称____]   [  ]   [     ]   [       ]  [×]  │
│                                                              │
│  [+ Add Line Item]                                          │
├─────────────────────────────────────────────────────────────┤
│  Notes:                         Terms:                      │
│  [_________________________]    [_______________________]   │
├─────────────────────────────────────────────────────────────┤
│                              Subtotal: $ [        ]         │
│                              Tax Rate: [8  % ▼]             │
│                              Tax Amount: $ [        ]       │
│                              Total: $ [        ]            │
└─────────────────────────────────────────────────────────────┘
```

**默会知识调用**：
- 左上角"INVOICE"大字 —— 一眼就知道这是发票
- 右上角的编号和日期 —— 全球发票的标准格式
- From 在左，To 在右 —— 商业信函的标准布局
- 表格状的行项目 —— 和所有商业发票一致
- 金额右对齐 —— 财务人员的本能认知

### 3.2 渐进式展开 (Progressive Disclosure)

**设计理念**：复杂功能默认隐藏，在用户需要时才出现。

**实现方式**：

```
初始状态:
┌─────────────────────────────────────┐
│  Description    Qty   Rate  Amount  │
├─────────────────────────────────────┤
│  Web Design     1     $500   $500   │
└─────────────────────────────────────┘

悬停状态 (用户鼠标移入行项目):
┌─────────────────────────────────────┐
│  Description    Qty   Rate  Amount  │
├─────────────────────────────────────┤
│  Web Design     1     $500   $500   │  [✏️] [🗑️] [⬆️] [⬇️]
│                                    ↑ 这些操作按钮默认隐藏
└─────────────────────────────────────┘
```

**默会知识调用**：
- 悬停显示操作 —— 用户已经熟悉网页交互的这一通用模式
- 编辑/删除/移动图标 —— 通用符号，无需解释
- 操作按钮出现在行内而非顶部工具栏 —— 符合"就近原则"

### 3.3 实时预览 + 即时反馈

**设计理念**：用户的每一次输入都应该立即在预览区反映出来。

**实现方式**：

```
┌─────────────── 编辑区 ───────────────┬─────────────── 预览区 ───────────────┐
│                                      │                                     │
│  Item: [Database Design______]       │   Invoice Preview                   │
│  Qty: [33___]                       │   ┌─────────────────────────────┐   │
│  Rate: [$30___]                     │   │  Database Design × 33       │   │
│                                      │   │  $30.00/hr                  │   │
│  Tax Rate: [8%  ▼]                  │   │  Subtotal: $990.00          │   │
│                                      │   │  Tax (8%): $79.20           │   │
│  [+ Add Line Item]                  │   │  Total: $1069.20              │   │
│                                      │   └─────────────────────────────┘   │
│                                      │                                     │
│                                      │   [Download PDF] [Send Email]       │
└──────────────────────────────────────┴─────────────────────────────────────┘
```

**默会知识调用**：
- 左右分栏布局 —— 左边"工作台"，右边"成品区"
- 实时计算显示 —— 像计算器一样即时反馈
- 导出按钮在预览区下方 —— 暗示"预览满意后再导出"

### 3.4 智能默认值（符合行业惯例）

**设计理念**：基于国际电商惯例，预设合理的默认值。

**默认配置**：
- 发票编号：自动递增（INV-001, INV-002...）
- 日期：当天（MM/DD/YYYY 格式）
- 到期日期：30 天后（可配置）
- 税率：8%（美国平均销售税率，可配置）
- 货币：USD $（可配置为 EUR、GBP 等）
- 金额精度：2 位小数

---

## 4. 主工作区布局

### 4.1 三栏式布局

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  ☰  Saga Invoice              Invoice Designer                    [⚙️ Settings]│
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌────────────┬─────────────────────────┬────────────────────────────┐     │
│  │            │                         │                            │     │
│  │  Sidebar   │      Editor             │       Preview              │     │
│  │  (15%)     │       (45%)             │        (40%)               │     │
│  │            │                         │                            │     │
│  │  ➕ New    │  ┌───────────────────┐  │  ┌─────────────────────┐   │     │
│  │  📋 Templates│  │ Invoice Details  │  │  │                     │   │     │
│  │  📦 Items   │  │                   │  │  │                     │   │     │
│  │  👥 Clients │  │ Invoice #: _____ │  │  │    Invoice Preview   │   │     │
│  │  📄 History │  │ Date: __________ │  │  │                     │   │     │
│  │            │  │ Due: ___________ │  │  │                     │   │     │
│  │  ────────  │  │                   │  │  │                     │   │     │
│  │            │  └───────────────────┘  │  │                     │   │     │
│  │  ⚙️ Settings│                         │  │                     │   │     │
│  │            │  ┌───────────────────┐  │  │                     │   │     │
│  │            │  │ Line Items        │  │  │                     │   │     │
│  │            │  │                   │  │  │                     │   │     │
│  │            │  │ [+ Add Item]      │  │  │                     │   │     │
│  │            │  └───────────────────┘  │  └─────────────────────┘   │     │
│  │            │                         │                            │     │
│  └────────────┴─────────────────────────┴────────────────────────────┘     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4.2 各区域职责

| 区域 | 宽度 | 职责 | 默会设计要点 |
|------|------|------|-------------|
| Sidebar | 15% | 模块切换、全局操作 | 图标 + 文字，符合常见 SaaS 模式 |
| Editor | 45% | 数据输入、配置调整 | 表单分组清晰，符合填写直觉 |
| Preview | 40% | 实时预览、导出操作 | 所见即所得，预览即最终效果 |

### 4.3 响应式断点

```
Desktop (> 1200px): Three-column layout, full features
Tablet (768-1200px): Two-column, preview collapsible
Mobile (< 768px): Single column, edit/preview toggle
```

---

## 5. 关键界面组件

### 5.1 发票编辑表单

```
┌─────────────────────────────────────────────────────────────┐
│  Invoice Details                                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Invoice Number: [INV-___]    Date: [MM/DD/YYYY ▼]          │
│  Due Date: [MM/DD/YYYY ▼]                                   │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  From (Your Business)                    To (Client)        │
│  ┌─────────────────────┐                 ┌─────────────────┐│
│  │ [Upload Logo 📷]    │                 │ Client Name *   ││
│  │                     │                 │ [_____________] ││
│  │ Business Name *     │                 │ Company         ││
│  │ [_______________]   │                 │ [_____________] ││
│  │ Street Address      │                 │ Street Address  ││
│  │ [_______________]   │                 │ [_____________] ││
│  │ City, State, ZIP    │                 │ City, State, ZIP││
│  │ [_______________]   │                 │ [_____________] ││
│  │ Country             │                 │ Country         ││
│  │ [_____________  ▼] │                 │ [_____________▼]││
│  │ Email *             │                 │ Email           ││
│  │ [_______________]   │                 │ [_____________] ││
│  │ Phone               │                 │ Phone           ││
│  │ [_______________]   │                 │ [_____________] ││
│  └─────────────────────┘                 └─────────────────┘│
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  Line Items                                                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Description              Qty    Rate     Amount      │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │ [__________________]   [__]  [_____]   [_______]  [×]│  │
│  │ [__________________]   [__]  [_____]   [_______]  [×]│  │
│  │ [__________________]   [__]  [_____]   [_______]  [×]│  │
│  ├──────────────────────────────────────────────────────┤  │
│  │ [+ Add Line Item]                                     │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  Notes: [___________________________________________]       │
│  Terms: [___________________________________________]       │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  Summary                                                    │
├─────────────────────────────────────────────────────────────┤
│  Subtotal:           $ [850.00]                             │
│  Tax Rate:           [8.00 % ▼]                             │
│  Tax Amount:         $ [68.00]                              │
│  ──────────────────────────────────                         │
│  Total:              $ [918.00]                             │
└─────────────────────────────────────────────────────────────┘
```

**设计要点**：
- From 在左，To 在右 —— 符合国际商业信函格式
- 必填字段用 `*` 标记
- 金额自动计算
- 税率可配置（非固定值）
- 支持多行地址（电商卖家常用）

### 5.2 历史发票列表

```
┌─────────────────────────────────────────────────────────────┐
│  Invoice History                           [Search 🔍]      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Filter: [All Status ▼] [2026 ▼]                            │
│                                                             │
│  ┌────────────────────────────────────────────────────────┐│
│  │ 📄 INV-001        Acme Corp        $1,250.00  ✓ Sent  ││
│  │    Mar 15, 2026                            [⋮]         ││
│  ├────────────────────────────────────────────────────────┤│
│  │ 📄 INV-002        TechStart LLC    $3,800.00  ⏳ Draft ││
│  │    Mar 10, 2026                            [⋮]         ││
│  ├────────────────────────────────────────────────────────┤│
│  │ 📄 INV-003        John Doe         $850.00    ✓ Sent  ││
│  │    Mar 05, 2026                            [⋮]         ││
│  └────────────────────────────────────────────────────────┘│
│                                                             │
│  3 invoices, 2 sent this month                              │
└─────────────────────────────────────────────────────────────┘
```

**设计要点**：
- 状态用图标 + 文字（✓ Sent, ⏳ Draft, 💵 Paid）
- 金额右对齐
- 操作菜单悬停显示

### 5.3 客户/商品库（本地存储）

```
┌─────────────────────────────────────────────────────────────┐
│  Clients                                   [+ Add Client]    │
├─────────────────────────────────────────────────────────────┤
│  [Search clients 🔍]                                        │
│                                                             │
│  ┌────────────────────────────────────────────────────────┐│
│  │ 🏢 Acme Corp                                           ││
│  │    John Smith • john@acme.com                          ││
│  │    123 Business Ave, New York, NY 10001       [✏️][🗑️]  ││
│  ├────────────────────────────────────────────────────────┤│
│  │ 🏢 TechStart LLC                                       ││
│  │    Sarah Johnson • sarah@techstart.com                 ││
│  │    456 Innovation Dr, Austin, TX 78701        [✏️][🗑️]  ││
│  └────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

### 5.4 预览与导出区

```
┌─────────────────────────────────────────────────────────────┐
│  Invoice Preview                                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │                                                       │ │
│  │                       INVOICE                         │ │
│  │                                                       │ │
│  │  Invoice #: INV-001              Date: Mar 23, 2026   │ │
│  │  Due Date: Apr 22, 2026                               │ │
│  │                                                       │ │
│  │  From:                            To:                 │ │
│  │  InvoiceCat LLC                   John Smith          │ │
│  │  100 Startup Lane                 Acme Corp           │ │
│  │  Austin, TX 73301                 123 Business Ave    │ │
│  │  USA                              New York, NY 10001  │ │
│  │  billing@invoicecat.com           john@acme.com       │ │
│  │                                                       │ │
│  │  Description          Qty    Rate      Amount         │ │
│  │  ──────────────────────────────────────────────────── │ │
│  │  Database Design       33     $30.00    $990.00      │ │
│  │  SEO Optimization      17     $28.00    $476.00      │ │
│  │                                                       │ │
│  │                                    Subtotal: $12981.00│ │
│  │                                    Tax (8%): $1038.48 │ │
│  │                                       Total: $14019.48│ │
│  │                                                       │ │
│  │  Notes:                           Terms:              │ │
│  │  For any questions, contact us.   Net 30             │ │
│  │                                                       │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│         [Download PDF]  [Download CSV]  [Print]             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**设计要点**：
- 1:1 还原真实发票样式
- 导出按钮在预览区下方
- 支持 PDF、CSV、Print 三种输出方式

---

## 6. 动态反馈机制

### 6.1 微状态设计

| 状态 | 视觉反馈 | 使用场景 |
|------|---------|---------|
| 默认 | 无特殊效果 | 初始状态 |
| 悬停 | 轻微阴影 + 颜色变深 | 按钮、链接、可点击元素 |
| 聚焦 | 蓝色边框 + 外围光晕 | 输入框、可编辑区域 |
| 输入中 | 边框高亮 + 实时计算 | 金额、数量输入 |
| 成功 | 绿色对勾 + 淡入动画 | 保存、导出成功 |
| 错误 | 红色边框 + 抖动动画 | 必填项为空、格式错误 |
| 加载中 | 骨架屏 + 脉冲动画 | 数据加载、处理中 |

### 6.2 动画原则

**持续时间**：
- 微交互（按钮悬停）：150ms
- 中等动画（面板展开）：300ms
- 复杂动画（页面切换）：500ms

**缓动函数**：
- 入场：`cubic-bezier(0.4, 0, 0.2, 1)`（ease-out）
- 退场：`cubic-bezier(0.4, 0, 1, 1)`（ease-in）
- 强调：`cubic-bezier(0.34, 1.56, 0.64, 1)`（elastic）

### 6.3 本地保存策略（延迟摩擦）

**设计理念**：MVP 阶段无需登录/注册，所有数据存储在浏览器本地。

**实现方式**：

```
用户行为                     系统响应
─────────────────────────────────────────────
输入发票内容      →    自动保存到 localStorage
关闭浏览器        →    数据保留，下次打开可恢复
清除浏览器缓存    →    数据丢失（可接受）
─────────────────────────────────────────────
```

**保存提示**（仅在首次使用时显示一次）：

```
┌─────────────────────────────────────────────────────────────┐
│  💡 Your work is auto-saved to this browser.                │
│     Clear browser data = lose your invoices.                │
│     [Got it]  [Don't show again]                            │
└─────────────────────────────────────────────────────────────┘
```

**V2 升级路径**（未来添加用户系统时）：
- 提示用户创建账户以同步数据到云端
- 提供数据导出功能，避免锁定

---

## 7. Polanyi 悖论验证

### 7.1 什么是 Polanyi 悖论

> "We can know more than we can tell."
> 
> "我们知道的东西远比我们能说出来的多。"

在 UI 设计中，这意味着：用户能够理解界面的用意，但未必能明确说出为什么理解。

### 7.2 本设计如何体现 Polanyi 悖论

| 用户"知道"但说不清的 | 设计实现 |
|---------------------|---------|
| "这是发票编号的位置" | 右上角（全球发票惯例） |
| "这里应该填客户信息" | To 标签 + 表单格式暗示 |
| "红色边框表示有问题" | 通用错误色红色 + 必填场景上下文 |
| "这张发票看起来专业" | 符合国际商业发票格式规范 |
| "我可以点这里修改" | 悬停显示编辑图标 + 光标变化 |

### 7.3 为什么有效

1. **调用已有的默会知识**：电商卖家对发票格式的理解是商业实践的内化结果，我们的设计调用这种内化知识。

2. **符合国际惯例**：所有设计选择都参考了国际商业发票规范，用户的专业直觉会认可这些选择。

3. **减少认知负担**：用户不需要思考"这个软件怎么操作"，而是专注于"这张发票怎么开"。界面本身退居幕后。

4. **MVP 专注**：只服务电商卖家，不做复杂的企业功能，让界面保持简洁直观。

---

## 8. 视觉设计系统

### 8.1 色彩系统

#### 主色调

```css
--primary: #2563EB;        /* Professional Blue - primary actions */
--primary-hover: #1D4ED8;  /* Hover state */
--primary-light: #DBEAFE;  /* Light background */
```

#### 中性色

```css
--text-primary: #111827;   /* Primary text */
--text-secondary: #6B7280; /* Secondary text */
--text-tertiary: #9CA3AF;  /* Tertiary text */
--border: #E5E7EB;         /* Borders */
--background: #FFFFFF;     /* Background */
--surface: #F9FAFB;        /* Surface */
```

#### 功能色

```css
--success: #10B981;        /* Success, completed */
--warning: #F59E0B;        /* Warning, attention */
--error: #EF4444;          /* Error, dangerous */
--info: #3B82F6;           /* Information, tips */
```

#### 语义映射

| 场景 | 颜色 | 使用 |
|------|------|------|
| 主要按钮 | `--primary` | CTA、确认操作 |
| 成功状态 | `--success` | Sent、Completed |
| 警告状态 | `--warning` | Draft、Pending |
| 错误状态 | `--error` | Required field、Validation failed |
| 链接 | `--primary` | Clickable links |

### 8.2 字体系统

#### 字体族

```css
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

#### 字体层级

| 层级 | 字号 | 字重 | 行高 | 使用场景 |
|------|------|------|------|---------|
| H1 | 32px | 600 | 1.25 | Page title |
| H2 | 24px | 600 | 1.33 | Section headers |
| H3 | 20px | 500 | 1.40 | Card titles |
| Body | 16px | 400 | 1.50 | Body text |
| Small | 14px | 400 | 1.50 | Helper text |
| Caption | 12px | 400 | 1.40 | Labels, meta |

#### 金额专用样式

```css
.amount {
  font-family: var(--font-mono);
  font-feature-settings: "tnum"; /* Tabular numbers */
  text-align: right;
}
```

### 8.3 间距系统

#### 8px 基准

```
4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px
```

#### 使用规则

- 组件内间距：`8px` 或 `12px`
- 组件间间距：`16px` 或 `24px`
- 区域间间距：`32px` 或 `48px`
- 页面边距：`64px`（桌面端）

### 8.4 阴影系统

```css
/* Level 1 - Subtle lift */
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);

/* Level 2 - Card default */
--shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

/* Level 3 - Hover/dropdown */
--shadow-md: 0 4px 8px rgba(0, 0, 0, 0.12);

/* Level 4 - Modal/popover */
--shadow-lg: 0 8px 16px rgba(0, 0, 0, 0.15);
```

### 8.5 圆角系统

```css
--radius-sm: 4px;   /* Buttons, inputs */
--radius: 6px;      /* Cards, panels */
--radius-lg: 8px;   /* Featured cards */
--radius-full: 9999px; /* Avatars, badges */
```

---

## 9. 工程操作指南

### 9.1 新增功能检查清单

在添加任何新功能或界面时，请确保：

- [ ] **默会知识调用**：新用户能否在 5 秒内理解如何操作？
- [ ] **辅助意识**：界面是否退居幕后，让用户专注任务？
- [ ] **视觉传递**：是否用视觉而非文字传递信息？
- [ ] **专业感**：是否传递出可靠、专业的感觉？
- [ ] **符合惯例**：是否遵循国际电商发票惯例？
- [ ] **MVP 聚焦**：是否是电商卖家必需的功能？

### 9.2 组件开发规范

#### 按钮组件

```tsx
<Button variant="primary">    {/* Primary action */}
<Button variant="secondary">  {/* Secondary action */}
<Button variant="ghost">      {/* Subtle action */}
<Button disabled>             {/* Disabled state */}
```

#### 输入框组件

```tsx
<Input type="text" label="Business Name" required />
<Input type="number" label="Amount" prefix="$" />
<Input type="date" label="Invoice Date" />
```

#### 表格组件

```tsx
<Table>
  <Table.Header>
    <Table.Column>Description</Table.Column>
    <Table.Column align="right">Amount</Table.Column>
  </Table.Header>
  <Table.Body>
    {/* Data rows */}
  </Table.Body>
</Table>
```

### 9.3 响应式设计

#### 断点定义

```css
--breakpoint-sm: 640px;   /* Mobile landscape */
--breakpoint-md: 768px;   /* Tablet */
--breakpoint-lg: 1024px;  /* Laptop */
--breakpoint-xl: 1280px;  /* Desktop */
--breakpoint-2xl: 1536px; /* Large screen */
```

#### 适配策略

- **Desktop**: Three-column layout, full features
- **Tablet**: Two-column, preview collapsible
- **Mobile**: Single column, bottom navigation

### 9.4 国际化支持

#### 支持的语言

- English (default)
- 简体中文 (Simplified Chinese)

#### 文案提取

所有用户可见文案必须使用国际化函数：

```tsx
// ❌ Wrong
<div>Save successful</div>

// ✅ Correct
<div>{t('invoice.save.success')}</div>
```

#### 文案文件结构

```
locales/
├── en/
│   └── common.json
├── zh-CN/
│   └── common.json
└── ...
```

#### 关键翻译项

```json
{
  "invoice": {
    "title": "Invoice",
    "number": "Invoice Number",
    "date": "Date",
    "dueDate": "Due Date",
    "from": "From",
    "to": "To",
    "items": "Line Items",
    "subtotal": "Subtotal",
    "tax": "Tax",
    "total": "Total"
  }
}
```

### 9.5 本地存储策略

#### localStorage 键值设计

```javascript
const STORAGE_KEYS = {
  INVOICES: 'sagainvo:invoices',      // Array of invoice objects
  CLIENTS: 'sagainvo:clients',        // Array of client objects
  ITEMS: 'sagainvo:items',            // Array of item templates
  SETTINGS: 'sagainvo:settings',      // User preferences
  META: 'sagainvo:meta'               // App metadata (lastInvoiceNumber, etc.)
};
```

#### 数据模型

```typescript
interface Invoice {
  id: string;              // UUID
  number: string;          // INV-001
  date: string;            // ISO date string
  dueDate: string;         // ISO date string
  from: BusinessInfo;
  to: ClientInfo;
  items: LineItem[];
  taxRate: number;         // Percentage
  notes?: string;
  terms?: string;
  status: 'draft' | 'sent' | 'paid';
  createdAt: string;
  updatedAt: string;
}
```

### 9.6 性能要求

| Metric | Target | Measurement |
|--------|--------|-------------|
| First Contentful Paint | < 1.5s | Lighthouse |
| Largest Contentful Paint | < 2.5s | Lighthouse |
| First Input Delay | < 100ms | Chrome DevTools |
| Cumulative Layout Shift | < 0.1 | Lighthouse |
| Bundle Size | < 500KB (gzipped) | Webpack Bundle Analyzer |

### 9.7 SEO 优化

#### 元标签

```html
<title>Saga Invoice - Free Online Invoice Generator for E-commerce</title>
<meta name="description" content="Create professional invoices in 30 seconds. Free, no signup required. Perfect for Amazon, Shopify, Etsy sellers." />
<meta name="keywords" content="invoice generator, free invoice maker, e-commerce invoice, Amazon seller tools" />
```

#### 结构化数据

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Saga Invoice",
  "description": "Free online invoice generator for e-commerce sellers",
  "applicationCategory": "BusinessApplication",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
}
```

#### SSR/SSG 策略

- Landing page: SSG (static generation)
- Invoice designer: CSR (client-side rendering)
- Template gallery: SSG

### 9.8 MVP 功能优先级

| Priority | Feature | Status |
|----------|---------|--------|
| P0 | Create invoice | Required |
| P0 | Auto-save to localStorage | Required |
| P0 | Export PDF | Required |
| P1 | Export CSV | Required |
| P1 | Client library | Required |
| P1 | Item library | Required |
| P2 | Invoice templates | Optional |
| P2 | Print support | Optional |
| P3 | Email sending | Future |
| P3 | Cloud sync | Future |

---

## 附录

### A. 设计灵感来源

- InvoiceCat - 样例发票来源
- Stripe Billing - 专业财务 UI 参考
- Linear - 简洁高效的工作流设计

### B. 参考资料

- Polanyi, M. (1966). *The Tacit Dimension*.
- VoltAgent awesome-design-md - DESIGN.md format reference
- International invoice format standards

### C. 更新日志

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-04-07 | Initial version based on Polanyi tacit knowledge |
| 2.0 | 2026-04-07 | Revised for international e-commerce, removed China-specific features |
