# 燃星日志 (Burning Star Journal) 🍳

**一款基于微信小程序云开发的智能菜谱与购物清单管理应用。**
专门为家庭、情侣或个人设计，支持菜谱浏览、创作分享、以及从菜谱一键生成购物清单，实现高效的厨房管理。

## ✨ 主要功能 (Key Features)

### 1. 🥘 菜谱广场 (Recipe Marketplace)
*   **海量浏览**：瀑布流展示精美菜谱。
*   **智能搜索**：支持关键词搜索（如“鸡肉”、“川菜”）。
*   **分类筛选**：按“早餐/午餐/晚餐/烘焙”快速查找。
*   **云端同步**：所有数据存储在云数据库，实时更新。

### 2. 📝 菜谱详情 & 收藏 (Recipe Detail)
*   **图文步骤**：清晰展示食材用量与制作步骤。
*   **一键加购**：支持将菜谱所需食材 **一键加入购物清单**，自动归类。
*   **收藏功能**：喜欢的菜谱一键收藏，可以在“我的”页面查看。
*   **作者管理**：支持作者删除自己发布的菜谱。

### 3. 🛒 智能购物清单 (Smart Shopping List)
*   **自动归类**：
    *   **来自菜谱**：从菜谱添加的食材会自动归类在对应菜谱名下（如“西红柿炒蛋”）。
    *   **零散采购**：手动添加的商品归类为“其他零散采购”。
*   **批量管理**：支持 **批量选择** 和 **一键删除**，操作便捷。
*   **状态同步**：支持勾选“待购/已购”状态，多人共享数据（基于云开发）。
*   **手动添加**：支持快速添加额外的采购项。

### 4. 📸 创作中心 (Create Recipe)
*   **图文上传**：支持上传封面图和步骤图（存储于云存储）。
*   **结构化发布**：便捷录入食材量、烹饪时长、难度等信息。

---

## 🛠️ 技术栈 (Tech Stack)

*   **前端**：微信小程序原生框架 (WXML, WXSS, JS)
*   **后端**：微信云开发 (WeChat Cloud Development)
    *   **云数据库 (Cloud Database)**：存储菜谱 (`recipes`) 和清单 (`shopping_list`) 数据。
    *   **云存储 (Cloud Storage)**：存储菜谱图片。
    *   **云函数 (Cloud Functions)**：(可选) 用于复杂逻辑或批量操作。
*   **样式**：自定义 CSS + 玻璃拟态 (Glassmorphism) 设计风格。

---

## 🚀 快速开始 (Setup Guide)

### 1. 环境准备
1.  下载并安装 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)。
2.  注册一个微信小程序账号，并开通 **云开发** 环境。

### 2. 项目配置
1.  将本项目导入微信开发者工具。
2.  修改 active `appid` 为你自己的小程序 AppID（在 `project.config.json` 中）。
3.  在 `app.js` 中配置你的云环境 ID：
    ```javascript
    wx.cloud.init({
      env: 'your-env-id-here', // 替换为你的云环境ID
      traceUser: true,
    })
    ```

### 3. 数据库初始化 (Cloud Database)
在微信开发者工具 -> 云开发 -> 数据库中，创建以下两个集合：

*   **recipes** (菜谱集合)
    *   权限设置：所有用户可读，仅创建者可写（或在开发阶段开启“所有用户可读写”）。
*   **shopping_list** (购物清单集合)
    *   权限设置：所有用户可读写（`read: true, write: true`），以便实现多人/家庭共享清单。

### 4. 编译运行
点击开发者工具顶部的“编译”按钮，即可在模拟器中运行。

---

## 📂 目录结构 (Directory Structure)

```
燃星日志/
├── assets/             # 静态资源（图标、默认图）
├── components/         # 公共组件
├── custom-tab-bar/     # 自定义底部导航栏
├── pages/              # 页面文件
│   ├── index/          # 启动页
│   ├── marketplace/    # 菜谱广场
│   ├── recipeDetail/   # 菜谱详情
│   ├── create/         # 发布菜谱
│   ├── shopping/       # 购物清单
│   └── profile/        # 个人中心
├── utils/              # 工具函数
├── app.js              # 全局逻辑 & 云开发初始化
├── app.json            # 全局配置 (路由、窗口等)
└── project.config.json # 项目配置文件
```

---

## 📅 更新日志 (Changelog)

### v1.0.0 (Cloud Migration)
*   ✅ 完成全站云开发迁移。
*   ✅ 重构“购物清单”，支持按菜谱分组和批量删除。
*   ✅ 优化“菜谱广场”搜索与筛选体验。
*   ✅ 全新 UI 设计，采用现代化玻璃拟态风格。

---

**Developed with ❤️ by Antigravity**
