# 部署说明

## 部署到 Cloudflare Pages

### 步骤 1: 准备文件
确保你的项目目录包含以下文件：
- `index.html` - 主页面文件
- `worker.js` - Cloudflare Worker 后端 API
- `_headers` - Cloudflare Pages 响应头配置

### 步骤 2: 登录 Cloudflare
1. 访问 [Cloudflare 控制台](https://dash.cloudflare.com/)
2. 登录你的 Cloudflare 账号

### 步骤 3: 创建 Cloudflare Pages 项目
1. 在左侧导航栏中，点击 "Pages"
2. 点击 "Create a project"
3. 选择 "Connect to Git"
4. 选择你的代码仓库（如果没有，你可以创建一个新的 GitHub 或 GitLab 仓库，将项目文件上传上去）
5. 点击 "Begin setup"

### 步骤 4: 配置构建设置
- **Project name**: 输入你的项目名称
- **Production branch**: 选择你的主分支（通常是 `main` 或 `master`）
- **Build settings**:
  - **Framework preset**: 选择 "None"
  - **Build command**: 留空（因为我们的项目是静态的）
  - **Build output directory**: 留空（默认是根目录）
- **Environment variables** (可选):
  - 如果你使用了 Cloudflare KV 或 D1，需要添加相应的环境变量

### 步骤 5: 部署项目
1. 点击 "Save and Deploy"
2. Cloudflare Pages 会开始构建和部署你的项目
3. 等待部署完成，你会看到部署状态变为 "Active"

### 步骤 6: 验证部署
1. 部署完成后，Cloudflare Pages 会提供一个默认的 `.pages.dev` 域名
2. 访问该域名，确认网站正常运行
3. 测试所有功能，包括日记列表、编辑器、详情页、地图和个人中心

## 重要配置说明

### 关于 _headers 文件
我们在项目中添加了 `_headers` 文件，用于设置 Cloudflare Pages 的响应头：

```
/*.js
  Content-Type: application/javascript; charset=utf-8
```

这个配置告诉 Cloudflare："所有 JS 文件，请正确标注为 JavaScript"，告诉浏览器"这是一个 JS 文件"。这样才能在 Cloudflare 部署完成后正常打开。

### 关于 Cloudflare Worker
我们的 `worker.js` 文件包含了后端 API 的实现，用于处理认证、日记、评论、地图标记和同步等功能。在 Cloudflare Pages 中，你需要：

1. 在 Cloudflare 控制台中，点击 "Workers & Pages"
2. 点击 "Create Worker"
3. 将 `worker.js` 的内容复制到 Worker 编辑器中
4. 点击 "Deploy"
5. 配置 Worker 路由，将 `/api/*` 路径指向你的 Worker

### 关于数据同步
我们使用 IndexedDB 作为本地存储，配合 Cloudflare Workers KV 或 D1 数据库实现后端 API，确保在不同设备登录同一账号后，数据能完全同步。

## 故障排除

### 问题：JS 文件不执行
**解决方法**：确保 `_headers` 文件正确配置，并且 Cloudflare Pages 已经部署了该文件。

### 问题：API 调用失败
**解决方法**：检查 Worker 是否正确部署，并且路由配置正确。

### 问题：地图不显示
**解决方法**：确保 Leaflet.js 库正确加载，并且网络连接正常。

## 总结

通过以上步骤，你可以成功将个人日记与旅行记录分享网站部署到 Cloudflare Pages，享受 Cloudflare 的全球 CDN 加速和边缘计算能力，为用户提供流畅的访问体验。