# AGENT.md

给 AI 编码代理（以及新加入的人类协作者）的项目说明书。修改任何文件前请先读完本文。

---

## 1. 项目是什么

**CSS Codelab** 是一个纯静态的 CSS 实验室站点，用于演示和验证 CSS 技巧与特性。站点按**板块**（`pages/` 下的一级目录）组织内容，每个板块是围绕一个专题的一组演示。

当前只有 **CSS Secrets** 一个板块，内容就是《CSS 揭秘》这本书的示例，按书中章节编号。**它只是其中一个板块，不要把全站的东西（页面模板、通用样式、全局脚本）塞进它的目录。**

核心特征：

- **零构建**：没有 `package.json`、没有打包器、没有预处理器。改完文件刷新浏览器即可生效。
- **零后端**：纯 HTML + CSS，JavaScript 只承担主题切换等少量交互。
- **单页自包含**：每个演示的样式优先写在自己的页面里，不追求跨页复用。
- **中文内容**：页面文案、注释、提交信息一律中文。

## 2. 技术栈

| 项 | 说明 |
|---|---|
| HTML/CSS | 原生，无框架、无预处理 |
| UI 基础 | Bootstrap 5.3.2（jsDelivr CDN，仅用容器 / 栅格 / 卡片 / 表格 / 导航等基础类） |
| 图标 | Bootstrap Icons 1.11.1（CDN） |
| 字体 | JetBrains Mono（标题与标注）+ IBM Plex Sans（正文），由 `common.css` 顶部 `@import` 统一加载 |
| 脚本 | 原生 JS，全局仅 `assets/js/theme.js` 一个文件 |
| 部署 | GitHub Pages + 自定义域名 |

引入顺序固定（板块内的页面）：

```html
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" rel="stylesheet">
<link href="[相对路径]/assets/css/common.css" rel="stylesheet">
...
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
<script src="[相对路径]/assets/js/theme.js"></script>
```

根 `index.html` 不引 Bootstrap（首页是自绘版式），只引 `common.css` + `theme.js`。

## 3. 目录分类

### 3.1 分类原则

全站只有三层语义，新增文件时先判断它属于哪一层，不要混放：

| 层级 | 位置 | 放什么 | 判断标准 |
|---|---|---|---|
| 站点层 | 仓库根目录 | 入口页、错误页、SEO、PWA、模板、文档 | 全站唯一一份，不专属于某个演示 |
| 资源层 | `assets/` | 样式、脚本、图片 | 被 2 个以上页面共用 |
| 内容层 | `pages/` | 板块目录页 + 演示页 | 用户在浏览器里直接访问的内容 |

### 3.2 目录树

```
css-codelab/
├── index.html                    # 站点首页：板块列表（自绘版式，只引 common.css + theme.js）
├── 404.html                      # 错误页（独立样式，渐变背景）
├── manifest.json                 # PWA 清单
├── robots.txt / sitemap.xml      # SEO（sitemap 只登记首页与板块首页，不逐页登记）
├── .nojekyll                     # 关闭 GitHub Pages 的 Jekyll 处理
├── favicon.ico
├── template.html                 # 通用页面模板（站点层，不绑定板块）
├── assets/                       # 资源层
│   ├── css/common.css            # 全站共享样式：主题变量、导航、卡片、demo 容器
│   ├── js/theme.js               # 全站主题切换
│   ├── favicon.png
│   └── images/                   # 跨演示复用的图片素材
├── pages/                        # 内容层：一级子目录 = 板块
│   └── css-secrets/              # 板块：《CSS 揭秘》一书的实验
├── AGENT.md
└── README.md
```

### 3.3 板块（`pages/` 的一级子目录）

- **一个板块 = 一个可独立成目录页的专题**。目前只有 `css-secrets`，对应《CSS 揭秘》一本书的技巧实现；以后新增 CSS 新特性实验、布局实验等，各开一个新板块，例如 `pages/modern-css/`、`pages/layout-lab/`。
- **板块边界按"专题来源"划，不按单个 CSS 属性划**。不要建 `pages/flexbox/`、`pages/grid/` 这种碎目录——那属于某个专题内部的演示，不是板块。
- **板块目录名用英文 kebab-case**，语义可读；目录名同时决定 URL（`/pages/<板块>/`）。
- 每个板块必须有 `index.html` 作为入口，且必须被根 `index.html` 的 `.project-list` 用 `.project-card` 链接到——否则用户进不去。
- **编号在板块内独立**，跨板块不连续。新演示的编号在所属板块内取最大值加一。

### 3.4 资源归属

- 样式：**只有全站通用的才进 `assets/css/common.css`**；演示专属样式写在该演示页内部的 `<style>` 或 `style=""`（见第 4 节），不新建 CSS 文件。
- 图片：目前集中在 `assets/images/`，供多个演示复用。新增图片若会被 2 个以上演示用到，放 `assets/images/`；若只服务一个演示且体积较大，放进该演示目录，用相对路径引用。
- 脚本：除 `theme.js` 外不新增全局 JS 文件，演示内联即可。

### 3.5 层级与相对路径

| 文件位置 | 距根层数 | 引用资源的写法 |
|---|---|---|
| `template.html`、根 `index.html` | 0 | `assets/...` |
| `pages/<板块>/index.html` | 2 | `../../assets/...` |
| `pages/<板块>/<演示目录>/index.html` | 3 | `../../../assets/...` |

路径一律相对，禁止 `/` 开头的绝对路径（原因见第 8 节）。

## 4. 页面骨架

演示页统一结构，全站强约定，不要自创布局。

**模板文件：根目录 `template.html`**。它是板块无关的通用骨架——任何新演示、新板块都从它出发，不要直接抄某个既有演示页，也不要把它放进某个板块的目录里。模板本身放在根目录，路径按根深度写（`assets/...`），所以直接打开就能看到正确样式。

复制到板块下（3 层深度）时，按深度调一次相对路径：

```bash
BOARD=modern-css        # 板块目录名
DEMO=01-container-queries

mkdir -p pages/$BOARD/$DEMO
sed -e 's|="assets/|="../../../assets/|g' \
    -e 's|href="index.html"|href="../index.html"|g' \
    template.html > pages/$BOARD/$DEMO/index.html
```

（板块越深就多加一层 `../`。）也可以手工改：3 处 `assets/` → `../../../assets/`，2 处 `index.html` → `../index.html`。改完再把导航里的 `CSS Codelab` 换成板块名、`页面标题` 换成演示名。

约定细节：

- 页面结构固定四段：顶栏（品牌 + 三个主题按钮）→ 返回链接 → `.card` > `.demo-container` > `.demo-head`（`.demo-kicker` / `.demo-title` / `.demo-description`）→ 一个或多个 `.demo-box`。
- 主题切换按钮组必须原样保留（三个 `data-theme` 按钮），它是 `theme.js` 的绑定目标。
- `<title>` 格式固定：`NN - 中文标题 | <板块名>`，编号补零两位。
- `.demo-kicker` 写「板块名 / 编号」，是标题上方的等宽小标，不写说明文字。
- 一个概念有多个写法/对比时，用多个 `.demo-box` 纵向排列。每个块用 `<figure class="demo-box">` 包住，第一行写 `<figcaption class="demo-label">变体 A · 区别</figcaption>` 再放演示元素；老页面写的是裸 `<p>` 也能被 `.demo-box > p:first-child` 认成标签，新页面统一用 `.demo-label`。
- 关键 CSS 若值得单独看，在最后一个块之后贴一个 `<pre class="code-block"><code>…</code></pre>`；不需要就整段不加，别为了凑版式硬贴。
- 演示页与首页同宽（`≥1200px` 时都被 `common.css` 限到 1180px），不要在页面里另设 `max-width` 或改用 `.container-fluid`。
- 页面专属样式两种放法：
  - 简单到一两行 → 元素 `style=""` 属性（如 `01-translucent-borders`）。
  - 有一套规则、伪元素、`@keyframes` → 在 `.demo-container` 内部（演示内容之后）写 `<style>` 块（如 `18-frosted-glass`、`35-interactive-image-comparison`）。**不要新建独立 CSS 文件**。
- 演示需要少量脚本时，直接写在页面里（内联事件或局部 `<script>`），不要新增全局 JS 文件。

## 5. 共享样式 `assets/css/common.css`

提供的能力，优先复用，不要重写：

| 类名 | 用途 |
|---|---|
| `.demo-container` | 演示区容器 |
| `.demo-head` | 标题区（编号 / 标题 / 说明），底部一条发丝线收口 |
| `.demo-kicker` | 标题上方的等宽小标，强调色，写「板块名 / 编号」 |
| `.demo-title` / `.demo-description` | 演示页标题（等宽粗体）与说明 |
| `.demo-box` | 单个演示变体块，内嵌面 + 发丝边框 + 左上角强调色刻度 |
| `.demo-label` | 块内变体标签，等宽小字 + 强调色方块，写「变体 A · 区别」 |
| `.code-block` | 等宽字体代码块 |
| `.back-link` | 返回目录链接（等宽小字，悬停箭头左移） |
| `.mono` | 等宽 + 等宽数字，给编号、路径、标签用 |
| `.card` / `.navbar` / `.btn-group .btn` | 覆盖 Bootstrap 默认外观，接入主题变量 |
| `@keyframes fadeInUp` | 卡片入场动画，可复用 |

### 视觉规范

- **两套配色，一套骨架**：暗色 = 深色终端（近黑底 `#0b0c0e` + 荧光绿 `#4ade80`，冷灰发丝线）；亮色 = 冷白电蓝（纯白底 + 电蓝 `#2d5bff`，浅灰分割线）。两种主题的字体、字号、间距、圆角完全一致，**只换颜色**；不要为某个主题单独发明一套版式。
- **字体三件套**：`--font-display`（JetBrains Mono，标题与数字）、`--font-body`（IBM Plex Sans + 苹方/微软雅黑，正文）、`--font-mono`（JetBrains Mono，编号与路径）。三者都由 `common.css` 顶部 `@import` 统一加载，页面里不要各自引字体，也不要切主题换字体。
- **强调色随主题变**：`--accent` 暗色是荧光绿、亮色是电蓝，只给编号、当前状态、关键链接和悬停标记。压在强调色上的文字用 `--on-accent`（绿底近黑、蓝底白），不要写死。
- **几何**：圆角统一 `--radius: 3px`，靠发丝线（`--line` / `--line-soft`）而不是阴影分层。
- **焦点可见**：全局 `:focus-visible` 已有 2px 描边 + 2px 偏移，新增交互元素不要覆盖掉。
- **动效降级**：所有动画都受 `prefers-reduced-motion` 保护，新增动效要沿用这条规则。

### 主题变量

挂在 `:root`（深色，默认值）与 `[data-theme="light"]`（亮色，覆盖同名变量）上。`theme.js` 始终把 `light` 或 `dark` 写到 `<body>` 的 `data-theme`，所以不存在「无主题」的中间态：

- 表面：`--bg-primary`（页面）、`--bg-surface`（卡片）、`--bg-secondary`（演示块）、`--bg-header`（代码块 / 表头）
- 文字：`--text-primary`、`--text-secondary`、`--text-link`、`--text-link-hover`、`--text-chapter`
- 线条：`--border-color`、`--line`、`--line-soft`、`--shadow-color`
- 强调：`--accent`、`--accent-soft`、`--on-accent`（压在强调色上的文字）、`--row-highlight`、`--chapter-gradient`
- 排版与几何：`--font-display`、`--font-body`、`--font-mono`、`--radius`、`--ease`

**硬要求**：组件里不写死色值，一律走变量，否则暗色模式会瞎。演示本身要展示特定颜色的（讲 HSLA、混色之类的）除外——那种情况写死是合理的，但要确保它在深色底上仍可辨认。

全局还处理了：`box-sizing: border-box`、`prefers-color-scheme` 跟随、`prefers-reduced-motion` 降级。

## 6. 主题切换 `assets/js/theme.js`

- 存储键：`localStorage.themeMode`，取值 `auto` / `light` / `dark`，默认 `auto`。
- 生效方式：给 `<body>` 同时设置 `data-theme` 和 `data-bs-theme`（后者让 Bootstrap 组件跟着变色）。
- `auto` 模式监听 `matchMedia('(prefers-color-scheme: dark)')` 的 `change` 事件实时跟随系统。
- **已知怪癖**：`auto` 模式下 `theme.js` 会把解析后的结果（`light`/`dark`）写到 `data-theme` 上，因此 body 上永远不会出现 `data-theme="auto"`，`common.css` 里 `[data-theme="auto"]` 的选择器实际不会被命中。别基于 `auto` 写选择器，也别"顺手重构"这段逻辑去改变现有行为。
- 按钮的 `active` 状态由 `updateButtons()` 直接用 localStorage 里的模式值维护，与 body 上的实际值可能不同，这是有意为之。

## 7. 新增一个演示的完整流程

1. **建目录**：`pages/<板块>/<演示目录>/index.html`（如 `pages/modern-css/01-container-queries/index.html`）。目录名用两位编号 + 英文短名，编号在板块内现有最大值上加一（补零两位），短名用 kebab-case。新板块直接建一层新目录。
2. **生成页面**：从根目录 `template.html` 按第 4 节的命令转成目标页，再改 `<title>`、`demo-title`、`demo-description` 和导航里的板块名。
3. **写演示**：用 `.demo-box` 组织，样式按第 4 节的规则放置，颜色用主题变量。
4. **登记目录**：在 `pages/<板块>/index.html` 的表格里加一行（`css-secrets` 板块是章节分组表格，新章节先加 `<tr class="chapter">` 分组行）。编号列写两位数字，链接列写 `<a href="<演示目录>/index.html">中文标题</a>`。
5. **新增板块时**：还要在根 `index.html` 的 `.project-list` 里加一张 `.project-card`，并考虑是否更新 `README.md` 的章节表格。
6. **自查**：亮/暗/跟随系统三态下都看一遍；窄屏（≤576px）不溢出；`prefers-reduced-motion` 下动画能停。

## 8. 路径与部署规则

- 站点部署在 **GitHub Pages**（仓库 `github.com/6iedog/css-codelab`，自定义域名 `https://github.6iedog.com/css-codelab/`），站点根路径是 `/css-codelab/` 而不是 `/`。
- **所有内部链接与资源引用一律用相对路径**。不要写 `/css-codelab/...` 这类以 `/` 开头的路径——本地双击打开会失效，换域名部署也会断。
- 目录 URL 依赖 `index.html` 作为默认文档（`01-xxx/index.html` 可直接用 `01-xxx/` 访问）。
- `.nojekyll` 必须保留，否则 GitHub Pages 的 Jekyll 会忽略部分文件。
- `.gitignore` 已忽略：`.idea`、`*.iml`、`out`、`gen`、`.vscode`、`.log`、`.claude/**/*.local.*`、`.workbuddy`。

## 9. 代码风格

- 缩进：**HTML 用 4 空格，`common.css` 用 2 空格**，与现有文件保持一致。
- 类名 `kebab-case`，语义化，避免单字母。
- 注释用中文；`common.css` 用 `/* 分区名 */` 做分区。
- 提交信息用中文，说明"加了什么、演示什么"，例如：`添加表格列宽控制示例及样式，展示不同布局下的表格宽度行为`。
- 不引入新依赖、不引入构建步骤、不引入 CSS 预处理器、不引入 JS 框架。

## 10. 不要做的事

- ❌ 不要为了"统一"而重写既有演示的内联样式——它们是刻意保持单文件自包含的。
- ❌ 不要把演示样式抽到 `common.css` 或新建共享 CSS 文件。
- ❌ 不要用 JS 实现纯 CSS 能做到的视觉效果（交互控件如 `<input type="range">`、`<dialog>` 除外）。
- ❌ 不要改成绝对路径，不要删 `.nojekyll`。
- ❌ 不要在演示页里覆盖 `.navbar`、`.card`、`body` 的全局外观（`18-frosted-glass` 这类需要整页背景的例外，它用了局部 `<style>` 且明知会影响外层，属于有意的权衡）。
- ❌ 不要把 `.workbuddy/`、`.idea/` 等本地目录提交进仓库。

## 11. 参考

- `README.md`：面向访客的项目介绍与章节统计。
- `.claude/skills/frontend-design.md`：项目自带的前端设计取向说明（CSS 优先、语义化 HTML、渐进增强、性能优先）。写演示时与本文件冲突的，以本文件为准。
