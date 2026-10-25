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
| UI 基础 | Bootstrap 5.3.2（jsDelivr CDN，演示页用容器 / 卡片等基础类；首页与板块目录页是自绘版式，不引 Bootstrap） |
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

根 `index.html` 和板块目录页（`pages/<板块>/index.html`）不引 Bootstrap，只引 `common.css` + `theme.js`；只有演示页还留着上面这套引入。

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
│   ├── css/common.css            # 全站共享样式：主题变量、站点外壳、目录页、演示容器
│   ├── js/theme.js               # 全站主题切换
│   ├── favicon.png
│   └── images/                   # 跨演示复用的图片素材
├── pages/                        # 内容层：一级子目录 = 板块
│   ├── css-secrets/              # 板块：《CSS 揭秘》一书的实验
│   └── modern-css/               # 板块：不在书里的新特性
├── AGENT.md
└── README.md
```

### 3.3 板块（`pages/` 的一级子目录）

- **一个板块 = 一个可独立成目录页的专题**。当前有两个：`css-secrets`（《CSS 揭秘》一本书的技巧实现）和 `modern-css`（书里没有的新特性）。以后新增专题各开一个新板块，例如 `pages/layout-lab/`。
- **板块边界按"专题来源"划，不按单个 CSS 属性划**。不要建 `pages/flexbox/`、`pages/grid/` 这种碎目录——那属于某个专题内部的演示，不是板块。
- **板块目录名用英文 kebab-case**，语义可读；目录名同时决定 URL（`/pages/<板块>/`）。
- 每个板块必须有 `index.html` 作为入口，且必须被根 `index.html` 的 `.project-list` 用 `.project-card` 链接到——否则用户进不去。
- **编号在板块内独立**，跨板块不连续，且**只写在目录页**的 `.demo-num` 里，不进目录名、不进 URL。新演示的编号在所属板块内取最大值加一；以后插入、重排、甚至改目录名，都不会让旧链接失效。

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

路径一律相对，禁止 `/` 开头的绝对路径（原因见第 9 节）。

## 4. 页面骨架

两级页面：**板块目录页**列演示，**演示页**放内容。两者共用同一套外壳（顶栏 / 版心 / 页脚），差别只在中间那段。

### 4.1 演示页

演示页统一结构，强约定，不要自创布局。

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

（板块越深就多加一层 `../`。）步骤名 `DEMO` 用英文短名、**不带编号**。也可以手工改：2 处 `assets/` → `../../../assets/`，2 处 `index.html` → `../index.html`。改完再把导航里的 `CSS Codelab` 换成板块名、`页面标题` 换成演示名。

约定细节：

- 页面结构固定为 **左侧目录 + 正文流**：顶栏（品牌 + 三个主题按钮）→ `.doc`（grid：`.doc-toc` + `.doc-main`）→ 返回链接 → `.doc-head`（`.demo-kicker` / `.doc-title` / `.doc-lead`）→ 若干 `.doc-sec`。
- **正文不要一层层套卡片**。只有真正可动手的实践案例才用 `<div class="demo-case">` 包成卡片；说明、结论、代码、表格全部走正常文档流，用 `.doc-p` / `.doc-hint` / `.snippet` / `.doc-table`。
- 每一节 = 一个 `<section class="doc-sec" id="…">` + 一个 `<h2 class="doc-h2">`，`id` 与左侧目录的 `href` 一一对应。节内再分层用 `<h3 class="doc-h3">`。
- 左侧目录 `.doc-toc` 是强制的：每条 `<a class="toc-item" href="#id">`，二级条目加 `.is-sub`（窄屏自动隐藏，只留一级）。目录条目文案可以和标题不同，但要能认出来是哪一节。
- 主题切换按钮组必须原样保留（三个 `data-theme` 按钮），它是 `theme.js` 的绑定目标。
- 页面底部那段目录高亮脚本（给 `.toc-item` 切 `is-active`）原样保留，它负责滚动时高亮当前小节。
- `<title>` 格式固定：`中文标题 | <板块名>`。**标题里不写编号**，编号只出现在目录页的 `.demo-num`。
- `<head>` 末尾固定带一段 GA4 统计代码（`G-KFVQMWKFHB`，`gtag.js`），模板里已经有了，复制页面即自动带上。全站 53 个页面（含首页、目录页、`404.html`）都已插入，**不要再补充第二份，也不要改这八行**。
- `.demo-kicker` 写「板块名 / 演示名」，是标题上方的等宽小标，不写编号、不写说明文字。
- 关键 CSS 放在每个 `.demo-case` 之后，用 `<div class="snippet"><span class="snippet-cap">关键 CSS</span><pre class="code-block">…</pre></div>`；页面级共用的机制放在第一节，具体怎么写见第 5.2 节。不需要就不加，别为了凑版式硬贴。
- 演示页与首页同宽（`≥1200px` 时都被 `common.css` 限到 1180px），不要在页面里另设 `max-width` 或改用 `.container-fluid`。
- 页面专属样式两种放法：
  - 简单到一两行 → 元素 `style=""` 属性（如 `01-translucent-borders`）。
  - 有一套规则、伪元素、`@keyframes` → 在 `.doc-main` 内部（内容之后）写 `<style>` 块（如 `18-frosted-glass`、`containment`）。**不要新建独立 CSS 文件**。
- 演示需要少量脚本时，直接写在页面里（内联事件或局部 `<script>`），不要新增全局 JS 文件。
- 旧页面（`css-secrets` 里的）仍是 `.card` > `.demo-container` > `.demo-box` 的老骨架，**不要为了统一去改它们**；新页面一律用上面的 `.doc` 版式。

### 4.2 板块目录页

外壳和首页一模一样，**不要再引 Bootstrap 的 `navbar` / `container` / `table`**——那套骨架和自绘版式混在一起会错位：

```html
<header class="top"><div class="shell top-inner">…</div></header>
<main class="shell">
    <section class="board-hero">
        <div class="board-main"><p class="kicker">~/pages/<板块></p><h1>中文名 <em>English</em></h1></div>
        <div class="board-aside">
            <p class="lead">一句话说清这个板块装什么</p>
            <dl class="stats">…章节 / 演示…</dl>
        </div>
    </section>
    <div class="board-body">
        <section class="sec">
            <h2 class="sec-label">第 N 章 · 章名</h2>
            <ul class="demo-list">
                <li><a class="demo-row" href="slug/index.html">
                    <span class="demo-num">NN</span>
                    <span class="demo-name">中文标题</span>
                    <span class="demo-go" aria-hidden="true">→</span>
                </a></li>
            </ul>
        </section>
    </div>
</main>
<footer class="shell foot">…</footer>
```

要点：

- **章节用 `h2.sec-label` 分组**，一个章节一个 `.sec`，不要把章节做成表格里的整行。
- **加一个演示 = 在对应章节的 `.demo-list` 里加一个 `<li>`**，`demo-num` 编号补零两位（纯展示），链接写 `slug/index.html` 这样的相对路径——目录名不带编号。
- 顶栏 `.wordmark` 的 `href` 指回 `../../index.html`，它同时承担「回首页」。
- `h1` 用 `中文名 <em>English</em>`，`em` 里的词走强调色；板块标题比首页 `h1` 小一级，演示页 `.demo-title` 再小一级。
- 页面没有专属 `<style>`，目录页不写任何内联样式。

## 5. 演示内容怎么写

演示页不是"能跑就算完"的样例集合。每个演示至少要回答三件事：**它在做什么（原理）**、**哪几行 CSS 在起作用**、**它和相邻特性差在哪**。三条讲不清，说明这个演示自己还没想明白，别提交。

### 5.1 先讲原理，能用图就别只用文字

- **机制在前，效果在后**。`.doc-lead` 一句话点明「这个特性切断了什么 / 改变了什么」；`.doc-sec` 里先给原理段落 `.doc-p`，再给可动手的 `.demo-case`，最后一条 `.doc-hint` 解释「为什么会这样」。
- 说明段落只有两个位置：案例之前的一段导语（`.doc-p`），和案例之后的一条提示（`.doc-hint`，左侧一道强调色竖线）。两者都在 `common.css` 里，直接引用，不要自己在页内重新定义排版。
- **空间关系优先画出来**：作用域边界、包含块换成谁、盒子如何塌缩、两个取值的差异，这类内容用**纯 HTML + CSS 画示意图**，不要拿一张截图了事。
  - 参考 `pages/modern-css/containment/` 里的 `.scope-fig`：状态标记 / 编号链 / 结论三层 grid，两行对照。
  - 示意图必须吃主题变量（`--line`、`--bg-secondary`、`--font-mono`）；确实需要一个额外颜色时，用**局部变量** + `[data-theme="light"]` 覆盖（如 `--leak`），不要往全局令牌里塞一次性颜色。
  - 示意图是静态示意，**不跟演示开关联动**，但要配一句图注说明它画的是什么。
  - 窄屏（≤620px）自动堆成单列，不横向溢出。
- 一个概念拆成几块讲时，一块只讲一个点，块的顺序就是讲解顺序；不要把所有结论堆在第一块里。

### 5.2 贴关键 CSS，不贴全量源码

- 每块演示之后用 `.snippet` 包一段：`<div class="snippet"><span class="snippet-cap">关键 CSS</span><pre class="code-block"><code>…</code></pre></div>`，只放**属于这段演示的那几行**，不贴整页 CSS，也不要为了凑版式硬贴。`.snippet` 只有一封说明行，外壳交给 `.code-block`，别再套第二层卡片。
- **共用的机制单独讲一次**（如「所有演示共用的开关机制」），放在第一节，避免每节重复同一段 checkbox 选择器。
- 两个内联标记负责抓重点：`<span class="hl">` 标**真正起作用的那一条声明**（走 `--accent`），`<span class="cm">` 标行内注释（走 `--text-secondary`）。每段通常只高亮一行。这两个类在 `common.css` 里，直接用。
- 演示里为了让效果可见而写的"临时值"（比如会塌成 0 的高度）必须补一句正确写法，别让读者照抄。
- 代码里的 `<` `>` 一律转义成 `&lt;` `&gt;`，否则会被当成标签吞掉；`code-block` 的行尾注释按对齐写，中文注释会让列不齐，宁可少写注释也别错位。

### 5.3 讲清关联与对比

单个特性孤立地看记不住，**和相邻的东西比着讲**才有效：

- **和"长得像"的特性比**：如四种隐藏方式（`display: none` / `visibility: hidden` / `opacity: 0` / `content-visibility: hidden`）按布局、绘制与合成、交互、语义与输出、性能五个层次逐项列，而不是只说"能不能看见"。
- **和"差一个词"的值比**：如 `strict` 与 `content` 只差一个 `size`，就要把差异和后果（高度塌成 0）写出来。
- **给结论表**：对比完补一张「什么场景用哪个」的表，第三列写各自的坑，不要只写"推荐 X"。
- **口径是取舍不是优劣**：写「代价是什么」，不写「哪个更好」。

对比表分两种：

- **普通三五行的表**直接用共享的 `.doc-table`（`.doc-table-wrap` + `.doc-table`，只有横线，不做成卡片）。
- **多列、要分组的对照表**（如四种隐藏方式逐项比）沿用 `containment` 页的 `.cmp` 一组样式（页面内 `<style>`，不进 `common.css`）：

| 类名 | 作用 |
|---|---|
| `.cmp-title` | 表格区小标题（等宽强调色），一张表一个 |
| `.cmp-scroll` | 外层 `overflow-x: auto`，窄屏横向滚动，不撑破卡片 |
| `.cmp-hint` | 720px 以下出现的「左右滑动可看全部列」提示，宽屏隐藏 |
| `.cmp-table` / `.cmp-plan` | 对比表 / 三列结论表，两种列宽分配 |
| `.cmp-grp` | 分组行（布局 / 绘制 / 交互 / 语义 / 性能等），`colspan` 铺满 |
| `.cmp-table .no` | 「无 / 不支持」的符号，压到 0.55 透明度仍可辨 |
| `.cmp-note` | 表格下方的脚注，写易误解的点 |

表格必须能塞进卡片：靠外层滚动容器兜底，不靠缩字号硬塞。

### 5.4 属性名给 MDN 跳转链接

这个站是给人「查一下就能去读权威文档」用的。**正文里第一次提到某个 CSS 属性时，用 `.mdn` 链接代替裸 `<code>`**：

```html
<code>contain</code>                        <!-- ❌ 读者还得自己搜 -->
<a class="mdn" href="https://developer.mozilla.org/zh-CN/docs/Web/CSS/contain" target="_blank" rel="noopener">contain</a>   <!-- ✅ -->
```

约定：

- **同一个属性在本页只链第一次**，后面继续用 `<code>`。每处都加链会让整页全是下划线和箭头，反而看不出重点。
- **地址规则**：优先中文页 `https://developer.mozilla.org/zh-CN/docs/Web/CSS/<属性名>`；中文页没翻译的（目前是 `container-type`、`container-name`）退回 `en-US`。**加之前先打开确认不是 404**，MDN 的路径大小写敏感、页面会迁移。
- **带值的写法可以整段做链接文字**：`container-type: inline-size`、`content-visibility: hidden` 比只链一个 `hidden` 更清楚——单独一个 `hidden` 读者不知道属于哪个属性。
- **概念不是属性时，链指南页而不是属性页**：

| 概念 | 链接 |
|---|---|
| 包含块 | `/zh-CN/docs/Web/CSS/Containing_block` |
| 块格式化上下文 BFC | `/zh-CN/docs/Web/CSS/CSS_display/Block_formatting_context` |
| 层叠上下文 | `/zh-CN/docs/Web/CSS/CSS_positioned_layout/Stacking_context` |
| containment 全貌 | `/zh-CN/docs/Web/CSS/CSS_containment` |
| 容器查询 | `/zh-CN/docs/Web/CSS/CSS_containment/Container_queries` |

- **`.mdn` 的观感由 `common.css` 决定**：行内代码的 chip 底 + 底边虚线 + 右上角箭头（箭头用 `border-top`/`border-right` 画，不依赖字体里的 `↗`，等宽字体那个字形太细看不出来）。不要在页内重写这套样式，也不要自己加 `↗` 字符。
- 外链统一 `target="_blank" rel="noopener"`：读者是边读边查，别让人一点就丢掉当前页面的滚动位置。
- 表格表头里的 `.mdn` 会自动去掉箭头（列窄），值那一列不受影响；**代码块里不放链接**，`<pre>` 内保持纯文本。
- 速查表/对比表第一列如果是属性名或取值，同样链到对应 MDN 页，让表格本身就能当索引用。

## 6. 共享样式 `assets/css/common.css`

提供的能力，优先复用，不要重写：

| 类名 | 用途 |
|---|---|
| **站点外壳** | |
| `.shell` | 版心容器：`max-width: --measure` + 左右 `--pad`，全站页面都用它 |
| `.top` / `.top-inner` | 自绘顶栏（粘性 + 毛玻璃），首页与板块目录页用 |
| `.wordmark` | 顶栏品牌字，`<em>` 部分走强调色 |
| `.kicker` | 行内小标：`$` 提示符 + 路径，右侧接发丝线 |
| `.sec` / `.sec-label` | 区块标题：`/` 标签 + 横线收口 |
| `.foot` | 页脚，只设上下内边距，左右留给 `.shell` |
| `.rev` | 入场动画，用 `style="--d: .11s"` 错峰 |
| **板块目录页** | |
| `.board-hero` / `.board-aside` | 目录页标题区（左标题、右说明与统计） |
| `.lead` / `.stats` / `.stat` | 导语与两格数字 |
| `.demo-list` / `.demo-row` | 演示列表与整行可点的行 |
| `.demo-num` / `.demo-name` / `.demo-go` | 行内三栏：编号 / 标题 / 箭头 |
| **演示页（新骨架：左侧目录 + 正文流）** | |
| `.doc` | 外层 grid：目录列 + 正文列，窄屏自动堆叠 |
| `.doc-toc` / `.toc-cap` / `.toc-nav` | 左侧粘性目录、小标与竖线条目列 |
| `.toc-item` / `.is-sub` / `.is-active` | 目录条目、二级缩进、滚动时的高亮态（由页内脚本切换） |
| `.doc-main` | 正文列（`min-width: 0`，防止代码块撑宽） |
| `.doc-head` / `.doc-title` / `.doc-lead` | 标题区：kicker + 大标题 + 导语 |
| `.doc-sec` / `.doc-h2` / `.doc-h3` | 一节与两级标题（`/` 与 `#` 前缀区分层级），带锚点偏移 |
| `.doc-p` / `.doc-hint` | 正文段落 / 结论提示（左侧强调色竖线） |
| `.demo-case` | **实践案例卡片**，只有可动手的演示才用它 |
| `.doc-table-wrap` / `.doc-table` | 文档流里的表格（只有横线，不做成卡片） |
| `.snippet` / `.snippet-cap` | 「关键 CSS」小标题 + 代码块 |
| `.mdn` | 属性名的 MDN 外链：chip 底 + 虚线底边 + 右上角箭头，见 5.4 |
| `.code-block` | 等宽字体代码块；`.hl` 高亮关键行，`.cm` 弱化注释 |
| `.back-link` | 返回目录链接（等宽小字，悬停箭头左移） |
| **演示页（旧骨架：仍在 css-secrets 用）** | |
| `.demo-container` / `.demo-head` | 老演示页的容器与标题区 |
| `.demo-kicker` | 标题上方的等宽小标，强调色，写「板块名 / 演示名」，新老骨架共用 |
| `.demo-title` / `.demo-description` | 老骨架的标题与说明 |
| `.demo-box` / `.demo-label` | 老骨架的演示块与块内变体标签 |
| `.index-table` | 通用两列表格（老页面在用，目录页已不用它） |
| **通用** | |
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
- 排版与几何：`--font-display`、`--font-body`、`--font-mono`、`--radius`、`--ease`、`--pad`（左右留白）、`--measure`（内容最大宽度 1180px）

**硬要求**：组件里不写死色值，一律走变量，否则暗色模式会瞎。演示本身要展示特定颜色的（讲 HSLA、混色之类的）除外——那种情况写死是合理的，但要确保它在深色底上仍可辨认。

全局还处理了：`box-sizing: border-box`、`prefers-color-scheme` 跟随、`prefers-reduced-motion` 降级。

## 7. 主题切换 `assets/js/theme.js`

- 存储键：`localStorage.themeMode`，取值 `auto` / `light` / `dark`，默认 `auto`。
- 生效方式：给 `<body>` 同时设置 `data-theme` 和 `data-bs-theme`（后者让 Bootstrap 组件跟着变色）。
- `auto` 模式监听 `matchMedia('(prefers-color-scheme: dark)')` 的 `change` 事件实时跟随系统。
- **已知怪癖**：`auto` 模式下 `theme.js` 会把解析后的结果（`light`/`dark`）写到 `data-theme` 上，因此 body 上永远不会出现 `data-theme="auto"`，`common.css` 里 `[data-theme="auto"]` 的选择器实际不会被命中。别基于 `auto` 写选择器，也别"顺手重构"这段逻辑去改变现有行为。
- 按钮的 `active` 状态由 `updateButtons()` 直接用 localStorage 里的模式值维护，与 body 上的实际值可能不同，这是有意为之。

## 8. 新增一个演示的完整流程

1. **建目录**：`pages/<板块>/<演示目录>/index.html`（如 `pages/modern-css/container-queries/index.html`）。目录名只用英文 kebab-case 短名，**不带编号**——编号只作为目录页的 `.demo-num` 展示，写进目录名会让以后重排、插入都变成改链接。新板块直接建一层新目录。
2. **生成页面**：从根目录 `template.html` 按第 4 节的命令转成目标页，再改 `<title>`、`doc-title`、`doc-lead`、导航里的板块名，以及左侧目录的条目。
3. **写演示**：按 `.doc-sec`（一节一个 h2）组织，`id` 与目录锚点对齐；只有可动手的案例才包 `.demo-case`，其余走 `.doc-p` / `.doc-hint` / `.snippet`。样式按第 4 节的规则放置，颜色用主题变量。内容按第 5 节的三件套补齐——原理（尽量配示意图）、关键 CSS、与相邻特性的对比。
4. **登记目录**：在 `pages/<板块>/index.html` 对应章节的 `.demo-list` 里加一个 `<li>`，内含 `.demo-row`（`demo-num` 编号、`demo-name` 中文标题、`demo-go` 箭头）。若是新章节，先加 `<section class="sec">` 与 `<h2 class="sec-label">第 N 章 · 章名</h2>`。
5. **新增板块时**：还要在根 `index.html` 的 `.project-list` 里加一张 `.project-card`，并考虑是否更新 `README.md` 的章节表格。
6. **自查**：亮/暗/跟随系统三态下都看一遍；窄屏（≤576px）不溢出；`prefers-reduced-motion` 下动画能停；目录每条都能跳到对应小节、滚动时高亮正常；示意图与关键 CSS 都在，且没有把某块讲成"点一下有效果"却没说为什么；正文第一次出现的属性名都带了 MDN 链接且链接没有 404。

## 9. 路径与部署规则

- 站点部署在 **GitHub Pages**（仓库 `github.com/6iedog/css-codelab`，自定义域名 `https://github.6iedog.com/css-codelab/`），站点根路径是 `/css-codelab/` 而不是 `/`。
- **所有内部链接与资源引用一律用相对路径**。不要写 `/css-codelab/...` 这类以 `/` 开头的路径——本地双击打开会失效，换域名部署也会断。
- 目录 URL 依赖 `index.html` 作为默认文档（`containment/index.html` 可直接用 `containment/` 访问）。
- `.nojekyll` 必须保留，否则 GitHub Pages 的 Jekyll 会忽略部分文件。
- `.gitignore` 已忽略：`.idea`、`*.iml`、`out`、`gen`、`.vscode`、`.log`、`.claude/**/*.local.*`、`.workbuddy`。

## 10. 代码风格

- 缩进：**HTML 用 4 空格，`common.css` 用 2 空格**，与现有文件保持一致。
- 类名 `kebab-case`，语义化，避免单字母。
- 注释用中文；`common.css` 用 `/* 分区名 */` 做分区。
- 提交信息用中文，说明"加了什么、演示什么"，例如：`添加表格列宽控制示例及样式，展示不同布局下的表格宽度行为`。
- 不引入新依赖、不引入构建步骤、不引入 CSS 预处理器、不引入 JS 框架。

## 11. 不要做的事

- ❌ 不要为了"统一"而重写既有演示的内联样式——它们是刻意保持单文件自包含的。
- ❌ 不要把演示样式抽到 `common.css` 或新建共享 CSS 文件。
- ❌ 不要用 JS 实现纯 CSS 能做到的视觉效果（交互控件如 `<input type="range">`、`<dialog>` 除外）。
- ❌ 不要改成绝对路径，不要删 `.nojekyll`。
- ❌ 不要在演示页里覆盖 `.navbar`、`.card`、`body` 的全局外观（`18-frosted-glass` 这类需要整页背景的例外，它用了局部 `<style>` 且明知会影响外层，属于有意的权衡）。
- ❌ 不要把 `.workbuddy/`、`.idea/` 等本地目录提交进仓库。
- ❌ 不要只放"点一下有变化"的演示而不讲原理；原理、关键 CSS、对比三件里缺两件的，等于没写完。
- ❌ 不要用截图代替示意图（截图不跟随主题，也会过期）；示意图用 HTML + CSS 画。
- ❌ 不要贴整页 CSS 当"关键代码"，也不要一段代码里高亮七八行——高亮多了等于没高亮。
- ❌ 不要把整页内容都套进卡片。一张卡片只包一个可动手的实践案例（`.demo-case`），说明、结论、代码、表格一律走文档流。
- ❌ 不要新建演示页却漏掉左侧目录，或者目录条目与正文 `id` 对不上（点了不跳、高亮错节）。
- ❌ 不要让属性名一直用裸 `<code>` 而没有 MDN 出处；也不要反过来每个属性每次出现都加链接，一页里同一属性链一次就够。
- ❌ 不要链到没验证过的 MDN 地址，也不要拿英文页凑数——中文页存在就用中文页。
- ❌ 不要删改 `<head>` 里的 GA4 统计代码，也不要给已经带了的页面再插一份（复制页面后先搜 `gtag` 确认）。

## 12. 参考

- `README.md`：面向访客的项目介绍与章节统计。
- `.claude/skills/frontend-design.md`：项目自带的前端设计取向说明（CSS 优先、语义化 HTML、渐进增强、性能优先）。写演示时与本文件冲突的，以本文件为准。
