# electron-vite-app

An Electron application with Vue and TypeScript

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)

## Project Setup

### Install

```bash
$ pnpm install
```

### Development

```bash
$ pnpm dev
```

### Build

```bash
# For windows
$ pnpm build:win

# For macOS
$ pnpm build:mac

# For Linux
$ pnpm build:linux
```

## electron learn

### electron架构

#### 主进程 (Main Process)

- 是什么？
  主进程是 Electron 应用程序的入口点和心脏。每个 Electron 应用有且`只有一个`主进程。它实际上是一个完整的 `Node.js 环境`。

- 职责和能力:
  - 应用生命周期管理：通过 app 模块控制应用的启动、退出、激活等事件。
  - 创建和管理窗口：使用 BrowserWindow 模块来创建和控制应用的图形界面窗口（即渲染进程）。
  - 访问原生 API：可以直接使用所有 Node.js 的 API（如 fs 读写文件、path 处理路径、child_process 创建子进程）和 Electron 提供的原生 API（如 dialog 创建系统对话框、Menu 创建菜单栏、Tray 创建系统托盘图标）。
  - 作为所有渲染进程的协调者：它是所有渲染进程的父进程，负责它们之间的通信（IPC）和管理。

- 关键点:
  - 没有 UI：主进程不渲染任何可见的界面。它在后台运行
  - 入口文件：package.json 中的 main 字段指定的文件就是主进程的脚本
  - 环境：纯 Node.js 环境，不能访问浏览器特有的 API，如 window、document、DOM

- 处理流程：
  <svg aria-roledescription="flowchart-v2" role="graphics-document document" viewBox="-8 -8 663.34375 2121.375" style="max-width: 663.34375px;" xmlns="http://www.w3.org/2000/svg" width="100%" id="mermaid-svg-1753760788867-af4ywpqfl"><style>#mermaid-svg-1753760788867-af4ywpqfl{font-family:"trebuchet ms",verdana,arial,sans-serif;font-size:16px;fill:#616161;}#mermaid-svg-1753760788867-af4ywpqfl .error-icon{fill:#f2dede;}#mermaid-svg-1753760788867-af4ywpqfl .error-text{fill:#a1260d;stroke:#a1260d;}#mermaid-svg-1753760788867-af4ywpqfl .edge-thickness-normal{stroke-width:2px;}#mermaid-svg-1753760788867-af4ywpqfl .edge-thickness-thick{stroke-width:3.5px;}#mermaid-svg-1753760788867-af4ywpqfl .edge-pattern-solid{stroke-dasharray:0;}#mermaid-svg-1753760788867-af4ywpqfl .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-svg-1753760788867-af4ywpqfl .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-svg-1753760788867-af4ywpqfl .marker{fill:#616161;stroke:#616161;}#mermaid-svg-1753760788867-af4ywpqfl .marker.cross{stroke:#616161;}#mermaid-svg-1753760788867-af4ywpqfl svg{font-family:"trebuchet ms",verdana,arial,sans-serif;font-size:16px;}#mermaid-svg-1753760788867-af4ywpqfl .label{font-family:"trebuchet ms",verdana,arial,sans-serif;color:#616161;}#mermaid-svg-1753760788867-af4ywpqfl .cluster-label text{fill:#424242;}#mermaid-svg-1753760788867-af4ywpqfl .cluster-label span,#mermaid-svg-1753760788867-af4ywpqfl p{color:#424242;}#mermaid-svg-1753760788867-af4ywpqfl .label text,#mermaid-svg-1753760788867-af4ywpqfl span,#mermaid-svg-1753760788867-af4ywpqfl p{fill:#616161;color:#616161;}#mermaid-svg-1753760788867-af4ywpqfl .node rect,#mermaid-svg-1753760788867-af4ywpqfl .node circle,#mermaid-svg-1753760788867-af4ywpqfl .node ellipse,#mermaid-svg-1753760788867-af4ywpqfl .node polygon,#mermaid-svg-1753760788867-af4ywpqfl .node path{fill:#fafafa;stroke:#dbdbdc;stroke-width:1px;}#mermaid-svg-1753760788867-af4ywpqfl .flowchart-label text{text-anchor:middle;}#mermaid-svg-1753760788867-af4ywpqfl .node .label{text-align:center;}#mermaid-svg-1753760788867-af4ywpqfl .node.clickable{cursor:pointer;}#mermaid-svg-1753760788867-af4ywpqfl .arrowheadPath{fill:#050505;}#mermaid-svg-1753760788867-af4ywpqfl .edgePath .path{stroke:#616161;stroke-width:2.0px;}#mermaid-svg-1753760788867-af4ywpqfl .flowchart-link{stroke:#616161;fill:none;}#mermaid-svg-1753760788867-af4ywpqfl .edgeLabel{background-color:#fafafa99;text-align:center;}#mermaid-svg-1753760788867-af4ywpqfl .edgeLabel rect{opacity:0.5;background-color:#fafafa99;fill:#fafafa99;}#mermaid-svg-1753760788867-af4ywpqfl .labelBkg{background-color:rgba(250, 250, 250, 0.5);}#mermaid-svg-1753760788867-af4ywpqfl .cluster rect{fill:rgba(229, 229, 230, 0.5);stroke:#526fff;stroke-width:1px;}#mermaid-svg-1753760788867-af4ywpqfl .cluster text{fill:#424242;}#mermaid-svg-1753760788867-af4ywpqfl .cluster span,#mermaid-svg-1753760788867-af4ywpqfl p{color:#424242;}#mermaid-svg-1753760788867-af4ywpqfl div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:"trebuchet ms",verdana,arial,sans-serif;font-size:12px;background:#526fff;border:1px solid #526fff;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-svg-1753760788867-af4ywpqfl .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#616161;}#mermaid-svg-1753760788867-af4ywpqfl :root{--mermaid-font-family:"trebuchet ms",verdana,arial,sans-serif;}</style><g><marker orient="auto" markerHeight="12" markerWidth="12" markerUnits="userSpaceOnUse" refY="5" refX="6" viewBox="0 0 10 10" class="marker flowchart" id="mermaid-svg-1753760788867-af4ywpqfl_flowchart-pointEnd"><path style="stroke-width: 1; stroke-dasharray: 1, 0;" class="arrowMarkerPath" d="M 0 0 L 10 5 L 0 10 z"/></marker><marker orient="auto" markerHeight="12" markerWidth="12" markerUnits="userSpaceOnUse" refY="5" refX="4.5" viewBox="0 0 10 10" class="marker flowchart" id="mermaid-svg-1753760788867-af4ywpqfl_flowchart-pointStart"><path style="stroke-width: 1; stroke-dasharray: 1, 0;" class="arrowMarkerPath" d="M 0 5 L 10 10 L 10 0 z"/></marker><marker orient="auto" markerHeight="11" markerWidth="11" markerUnits="userSpaceOnUse" refY="5" refX="11" viewBox="0 0 10 10" class="marker flowchart" id="mermaid-svg-1753760788867-af4ywpqfl_flowchart-circleEnd"><circle style="stroke-width: 1; stroke-dasharray: 1, 0;" class="arrowMarkerPath" r="5" cy="5" cx="5"/></marker><marker orient="auto" markerHeight="11" markerWidth="11" markerUnits="userSpaceOnUse" refY="5" refX="-1" viewBox="0 0 10 10" class="marker flowchart" id="mermaid-svg-1753760788867-af4ywpqfl_flowchart-circleStart"><circle style="stroke-width: 1; stroke-dasharray: 1, 0;" class="arrowMarkerPath" r="5" cy="5" cx="5"/></marker><marker orient="auto" markerHeight="11" markerWidth="11" markerUnits="userSpaceOnUse" refY="5.2" refX="12" viewBox="0 0 11 11" class="marker cross flowchart" id="mermaid-svg-1753760788867-af4ywpqfl_flowchart-crossEnd"><path style="stroke-width: 2; stroke-dasharray: 1, 0;" class="arrowMarkerPath" d="M 1,1 l 9,9 M 10,1 l -9,9"/></marker><marker orient="auto" markerHeight="11" markerWidth="11" markerUnits="userSpaceOnUse" refY="5.2" refX="-1" viewBox="0 0 11 11" class="marker cross flowchart" id="mermaid-svg-1753760788867-af4ywpqfl_flowchart-crossStart"><path style="stroke-width: 2; stroke-dasharray: 1, 0;" class="arrowMarkerPath" d="M 1,1 l 9,9 M 10,1 l -9,9"/></marker><g class="root"><g class="clusters"/><g class="edgePaths"><path marker-end="url(#mermaid-svg-1753760788867-af4ywpqfl_flowchart-pointEnd)" style="fill:none;" class="edge-thickness-normal edge-pattern-solid flowchart-link LS-A LE-B" id="L-A-B-0" d="M235.852,39L235.852,43.167C235.852,47.333,235.852,55.667,235.852,63.117C235.852,70.567,235.852,77.133,235.852,80.417L235.852,83.7"/><path marker-end="url(#mermaid-svg-1753760788867-af4ywpqfl_flowchart-pointEnd)" style="fill:none;" class="edge-thickness-normal edge-pattern-solid flowchart-link LS-B LE-C" id="L-B-C-0" d="M235.852,128L235.852,132.167C235.852,136.333,235.852,144.667,235.918,152.2C235.984,159.734,236.116,166.467,236.182,169.834L236.248,173.201"/><path marker-end="url(#mermaid-svg-1753760788867-af4ywpqfl_flowchart-pointEnd)" style="fill:none;" class="edge-thickness-normal edge-pattern-solid flowchart-link LS-C LE-D" id="L-C-D-0" d="M204.611,270.635L192.486,282.008C180.361,293.382,156.11,316.128,143.985,332.785C131.859,349.442,131.859,360.008,131.859,365.292L131.859,370.575"/><path marker-end="url(#mermaid-svg-1753760788867-af4ywpqfl_flowchart-pointEnd)" style="fill:none;" class="edge-thickness-normal edge-pattern-solid flowchart-link LS-C LE-E" id="L-C-E-0" d="M268.092,270.635L280.05,282.008C292.009,293.382,315.926,316.128,327.885,332.785C339.844,349.442,339.844,360.008,339.844,365.292L339.844,370.575"/><path marker-end="url(#mermaid-svg-1753760788867-af4ywpqfl_flowchart-pointEnd)" style="fill:none;" class="edge-thickness-normal edge-pattern-solid flowchart-link LS-E LE-F" id="L-E-F-0" d="M339.844,414.875L339.844,419.042C339.844,423.208,339.844,431.542,339.844,438.992C339.844,446.442,339.844,453.008,339.844,456.292L339.844,459.575"/><path marker-end="url(#mermaid-svg-1753760788867-af4ywpqfl_flowchart-pointEnd)" style="fill:none;" class="edge-thickness-normal edge-pattern-solid flowchart-link LS-F LE-F1" id="L-F-F1-0" d="M339.844,503.875L339.844,508.042C339.844,512.208,339.844,520.542,339.844,527.992C339.844,535.442,339.844,542.008,339.844,545.292L339.844,548.575"/><path marker-end="url(#mermaid-svg-1753760788867-af4ywpqfl_flowchart-pointEnd)" style="fill:none;" class="edge-thickness-normal edge-pattern-solid flowchart-link LS-F1 LE-F2" id="L-F1-F2-0" d="M339.844,587.875L339.844,592.042C339.844,596.208,339.844,604.542,339.844,611.992C339.844,619.442,339.844,626.008,339.844,629.292L339.844,632.575"/><path marker-end="url(#mermaid-svg-1753760788867-af4ywpqfl_flowchart-pointEnd)" style="fill:none;" class="edge-thickness-normal edge-pattern-solid flowchart-link LS-F2 LE-F3" id="L-F2-F3-0" d="M339.844,671.875L339.844,676.042C339.844,680.208,339.844,688.542,339.844,695.992C339.844,703.442,339.844,710.008,339.844,713.292L339.844,716.575"/><path marker-end="url(#mermaid-svg-1753760788867-af4ywpqfl_flowchart-pointEnd)" style="fill:none;" class="edge-thickness-normal edge-pattern-solid flowchart-link LS-F3 LE-F4" id="L-F3-F4-0" d="M339.844,755.875L339.844,760.042C339.844,764.208,339.844,772.542,339.844,779.992C339.844,787.442,339.844,794.008,339.844,797.292L339.844,800.575"/><path marker-end="url(#mermaid-svg-1753760788867-af4ywpqfl_flowchart-pointEnd)" style="fill:none;" class="edge-thickness-normal edge-pattern-solid flowchart-link LS-F4 LE-F5" id="L-F4-F5-0" d="M339.844,839.875L339.844,844.042C339.844,848.208,339.844,856.542,339.844,863.992C339.844,871.442,339.844,878.008,339.844,881.292L339.844,884.575"/><path marker-end="url(#mermaid-svg-1753760788867-af4ywpqfl_flowchart-pointEnd)" style="fill:none;" class="edge-thickness-normal edge-pattern-solid flowchart-link LS-F5 LE-G" id="L-F5-G-0" d="M339.844,923.875L339.844,928.042C339.844,932.208,339.844,940.542,339.844,947.992C339.844,955.442,339.844,962.008,339.844,965.292L339.844,968.575"/><path marker-end="url(#mermaid-svg-1753760788867-af4ywpqfl_flowchart-pointEnd)" style="fill:none;" class="edge-thickness-normal edge-pattern-solid flowchart-link LS-G LE-H" id="L-G-H-0" d="M339.844,1012.875L339.844,1017.042C339.844,1021.208,339.844,1029.542,339.844,1036.992C339.844,1044.442,339.844,1051.008,339.844,1054.292L339.844,1057.575"/><path marker-end="url(#mermaid-svg-1753760788867-af4ywpqfl_flowchart-pointEnd)" style="fill:none;" class="edge-thickness-normal edge-pattern-solid flowchart-link LS-H LE-I" id="L-H-I-0" d="M242.491,1101.875L221.689,1106.042C200.887,1110.208,159.283,1118.542,138.482,1130.398C117.68,1142.254,117.68,1157.633,117.68,1165.323L117.68,1173.013"/><path marker-end="url(#mermaid-svg-1753760788867-af4ywpqfl_flowchart-pointEnd)" style="fill:none;" class="edge-thickness-normal edge-pattern-solid flowchart-link LS-I LE-J" id="L-I-J-0" d="M117.68,1217.313L117.68,1227.885C117.68,1238.458,117.68,1259.604,117.68,1275.46C117.68,1291.317,117.68,1301.883,117.68,1307.167L117.68,1312.45"/><path marker-end="url(#mermaid-svg-1753760788867-af4ywpqfl_flowchart-pointEnd)" style="fill:none;" class="edge-thickness-normal edge-pattern-solid flowchart-link LS-J LE-K" id="L-J-K-0" d="M117.68,1356.75L117.68,1360.917C117.68,1365.083,117.68,1373.417,117.68,1389.335C117.68,1405.254,117.68,1428.758,117.68,1440.51L117.68,1452.263"/><path marker-end="url(#mermaid-svg-1753760788867-af4ywpqfl_flowchart-pointEnd)" style="fill:none;" class="edge-thickness-normal edge-pattern-solid flowchart-link LS-K LE-L" id="L-K-L-0" d="M117.68,1496.563L117.68,1511.198C117.68,1525.833,117.68,1555.104,117.68,1575.023C117.68,1594.942,117.68,1605.508,117.68,1610.792L117.68,1616.075"/><path marker-end="url(#mermaid-svg-1753760788867-af4ywpqfl_flowchart-pointEnd)" style="fill:none;" class="edge-thickness-normal edge-pattern-solid flowchart-link LS-L LE-M" id="L-L-M-0" d="M117.68,1660.375L117.68,1664.542C117.68,1668.708,117.68,1677.042,117.68,1684.492C117.68,1691.942,117.68,1698.508,117.68,1701.792L117.68,1705.075"/><path marker-end="url(#mermaid-svg-1753760788867-af4ywpqfl_flowchart-pointEnd)" style="fill:none;" class="edge-thickness-normal edge-pattern-solid flowchart-link LS-M LE-N" id="L-M-N-0" d="M117.68,1749.375L117.68,1753.542C117.68,1757.708,117.68,1766.042,117.68,1773.492C117.68,1780.942,117.68,1787.508,117.68,1790.792L117.68,1794.075"/><path marker-end="url(#mermaid-svg-1753760788867-af4ywpqfl_flowchart-pointEnd)" style="fill:none;" class="edge-thickness-normal edge-pattern-solid flowchart-link LS-N LE-O" id="L-N-O-0" d="M117.68,1838.375L117.68,1842.542C117.68,1846.708,117.68,1855.042,117.68,1862.492C117.68,1869.942,117.68,1876.508,117.68,1879.792L117.68,1883.075"/><path marker-end="url(#mermaid-svg-1753760788867-af4ywpqfl_flowchart-pointEnd)" style="fill:none;" class="edge-thickness-normal edge-pattern-solid flowchart-link LS-O LE-P" id="L-O-P-0" d="M117.68,1927.375L117.68,1931.542C117.68,1935.708,117.68,1944.042,117.68,1951.492C117.68,1958.942,117.68,1965.508,117.68,1968.792L117.68,1972.075"/><path marker-end="url(#mermaid-svg-1753760788867-af4ywpqfl_flowchart-pointEnd)" style="fill:none;" class="edge-thickness-normal edge-pattern-solid flowchart-link LS-H LE-Q" id="L-H-Q-0" d="M391.714,1101.875L402.798,1106.042C413.881,1110.208,436.048,1118.542,447.197,1126.075C458.347,1133.609,458.479,1140.342,458.545,1143.709L458.611,1147.076"/><path marker-end="url(#mermaid-svg-1753760788867-af4ywpqfl_flowchart-pointEnd)" style="fill:none;" class="edge-thickness-normal edge-pattern-solid flowchart-link LS-Q LE-R" id="L-Q-R-0" d="M458.715,1244.25L458.632,1250.333C458.548,1256.417,458.382,1268.583,458.298,1279.95C458.215,1291.317,458.215,1301.883,458.215,1307.167L458.215,1312.45"/><path marker-end="url(#mermaid-svg-1753760788867-af4ywpqfl_flowchart-pointEnd)" style="fill:none;" class="edge-thickness-normal edge-pattern-solid flowchart-link LS-R LE-S" id="L-R-S-0" d="M458.215,1356.75L458.215,1360.917C458.215,1365.083,458.215,1373.417,458.281,1380.95C458.347,1388.484,458.479,1395.217,458.545,1398.584L458.611,1401.951"/><path marker-end="url(#mermaid-svg-1753760788867-af4ywpqfl_flowchart-pointEnd)" style="fill:none;" class="edge-thickness-normal edge-pattern-solid flowchart-link LS-S LE-T" id="L-S-T-0" d="M424.145,1513.305L412.524,1525.15C400.904,1536.995,377.663,1560.685,366.042,1577.813C354.422,1594.942,354.422,1605.508,354.422,1610.792L354.422,1616.075"/><path marker-end="url(#mermaid-svg-1753760788867-af4ywpqfl_flowchart-pointEnd)" style="fill:none;" class="edge-thickness-normal edge-pattern-solid flowchart-link LS-S LE-U" id="L-S-U-0" d="M493.285,1513.305L504.739,1525.15C516.193,1536.995,539.1,1560.685,550.554,1577.813C562.008,1594.942,562.008,1605.508,562.008,1610.792L562.008,1616.075"/><path marker-end="url(#mermaid-svg-1753760788867-af4ywpqfl_flowchart-pointEnd)" style="fill:none;" class="edge-thickness-normal edge-pattern-solid flowchart-link LS-T LE-V" id="L-T-V-0" d="M354.422,1660.375L354.422,1664.542C354.422,1668.708,354.422,1677.042,364.3,1685.444C374.179,1693.846,393.936,1702.316,403.814,1706.551L413.692,1710.787"/><path marker-end="url(#mermaid-svg-1753760788867-af4ywpqfl_flowchart-pointEnd)" style="fill:none;" class="edge-thickness-normal edge-pattern-solid flowchart-link LS-U LE-V" id="L-U-V-0" d="M562.008,1660.375L562.008,1664.542C562.008,1668.708,562.008,1677.042,552.129,1685.444C542.251,1693.846,522.494,1702.316,512.616,1706.551L502.737,1710.787"/><path marker-end="url(#mermaid-svg-1753760788867-af4ywpqfl_flowchart-pointEnd)" style="fill:none;" class="edge-thickness-normal edge-pattern-solid flowchart-link LS-P LE-W" id="L-P-W-0" d="M117.68,2016.375L117.68,2020.542C117.68,2024.708,117.68,2033.042,117.68,2040.492C117.68,2047.942,117.68,2054.508,117.68,2057.792L117.68,2061.075"/><path marker-end="url(#mermaid-svg-1753760788867-af4ywpqfl_flowchart-pointEnd)" style="fill:none;" class="edge-thickness-normal edge-pattern-solid flowchart-link LS-V LE-X" id="L-V-X-0" d="M458.215,1746.875L458.215,1751.458C458.215,1756.042,458.215,1765.208,458.215,1773.075C458.215,1780.942,458.215,1787.508,458.215,1790.792L458.215,1794.075"/><path marker-end="url(#mermaid-svg-1753760788867-af4ywpqfl_flowchart-pointEnd)" style="fill:none;" class="edge-thickness-normal edge-pattern-solid flowchart-link LS-X LE-Y" id="L-X-Y-0" d="M458.215,1838.375L458.215,1842.542C458.215,1846.708,458.215,1855.042,458.215,1862.492C458.215,1869.942,458.215,1876.508,458.215,1879.792L458.215,1883.075"/><path marker-end="url(#mermaid-svg-1753760788867-af4ywpqfl_flowchart-pointEnd)" style="fill:none;" class="edge-thickness-normal edge-pattern-solid flowchart-link LS-Y LE-Z" id="L-Y-Z-0" d="M458.215,1927.375L458.215,1931.542C458.215,1935.708,458.215,1944.042,458.215,1951.908C458.215,1959.775,458.215,1967.175,458.215,1970.875L458.215,1974.575"/></g><g class="edgeLabels"><g class="edgeLabel"><g transform="translate(0, 0)" class="label"><foreignObject height="0" width="0"><div style="display: inline-block; white-space: nowrap;" xmlns="http://www.w3.org/1999/xhtml"><span class="edgeLabel"></span></div></foreignObject></g></g><g class="edgeLabel"><g transform="translate(0, 0)" class="label"><foreignObject height="0" width="0"><div style="display: inline-block; white-space: nowrap;" xmlns="http://www.w3.org/1999/xhtml"><span class="edgeLabel"></span></div></foreignObject></g></g><g transform="translate(131.859375, 338.875)" class="edgeLabel"><g transform="translate(-8, -12)" class="label"><foreignObject height="24" width="16"><div style="display: inline-block; white-space: nowrap;" xmlns="http://www.w3.org/1999/xhtml"><span class="edgeLabel">是</span></div></foreignObject></g></g><g transform="translate(339.84375, 338.875)" class="edgeLabel"><g transform="translate(-8, -12)" class="label"><foreignObject height="24" width="16"><div style="display: inline-block; white-space: nowrap;" xmlns="http://www.w3.org/1999/xhtml"><span class="edgeLabel">否</span></div></foreignObject></g></g><g class="edgeLabel"><g transform="translate(0, 0)" class="label"><foreignObject height="0" width="0"><div style="display: inline-block; white-space: nowrap;" xmlns="http://www.w3.org/1999/xhtml"><span class="edgeLabel"></span></div></foreignObject></g></g><g class="edgeLabel"><g transform="translate(0, 0)" class="label"><foreignObject height="0" width="0"><div style="display: inline-block; white-space: nowrap;" xmlns="http://www.w3.org/1999/xhtml"><span class="edgeLabel"></span></div></foreignObject></g></g><g class="edgeLabel"><g transform="translate(0, 0)" class="label"><foreignObject height="0" width="0"><div style="display: inline-block; white-space: nowrap;" xmlns="http://www.w3.org/1999/xhtml"><span class="edgeLabel"></span></div></foreignObject></g></g><g class="edgeLabel"><g transform="translate(0, 0)" class="label"><foreignObject height="0" width="0"><div style="display: inline-block; white-space: nowrap;" xmlns="http://www.w3.org/1999/xhtml"><span class="edgeLabel"></span></div></foreignObject></g></g><g class="edgeLabel"><g transform="translate(0, 0)" class="label"><foreignObject height="0" width="0"><div style="display: inline-block; white-space: nowrap;" xmlns="http://www.w3.org/1999/xhtml"><span class="edgeLabel"></span></div></foreignObject></g></g><g class="edgeLabel"><g transform="translate(0, 0)" class="label"><foreignObject height="0" width="0"><div style="display: inline-block; white-space: nowrap;" xmlns="http://www.w3.org/1999/xhtml"><span class="edgeLabel"></span></div></foreignObject></g></g><g class="edgeLabel"><g transform="translate(0, 0)" class="label"><foreignObject height="0" width="0"><div style="display: inline-block; white-space: nowrap;" xmlns="http://www.w3.org/1999/xhtml"><span class="edgeLabel"></span></div></foreignObject></g></g><g class="edgeLabel"><g transform="translate(0, 0)" class="label"><foreignObject height="0" width="0"><div style="display: inline-block; white-space: nowrap;" xmlns="http://www.w3.org/1999/xhtml"><span class="edgeLabel"></span></div></foreignObject></g></g><g class="edgeLabel"><g transform="translate(0, 0)" class="label"><foreignObject height="0" width="0"><div style="display: inline-block; white-space: nowrap;" xmlns="http://www.w3.org/1999/xhtml"><span class="edgeLabel"></span></div></foreignObject></g></g><g class="edgeLabel"><g transform="translate(0, 0)" class="label"><foreignObject height="0" width="0"><div style="display: inline-block; white-space: nowrap;" xmlns="http://www.w3.org/1999/xhtml"><span class="edgeLabel"></span></div></foreignObject></g></g><g class="edgeLabel"><g transform="translate(0, 0)" class="label"><foreignObject height="0" width="0"><div style="display: inline-block; white-space: nowrap;" xmlns="http://www.w3.org/1999/xhtml"><span class="edgeLabel"></span></div></foreignObject></g></g><g class="edgeLabel"><g transform="translate(0, 0)" class="label"><foreignObject height="0" width="0"><div style="display: inline-block; white-space: nowrap;" xmlns="http://www.w3.org/1999/xhtml"><span class="edgeLabel"></span></div></foreignObject></g></g><g class="edgeLabel"><g transform="translate(0, 0)" class="label"><foreignObject height="0" width="0"><div style="display: inline-block; white-space: nowrap;" xmlns="http://www.w3.org/1999/xhtml"><span class="edgeLabel"></span></div></foreignObject></g></g><g class="edgeLabel"><g transform="translate(0, 0)" class="label"><foreignObject height="0" width="0"><div style="display: inline-block; white-space: nowrap;" xmlns="http://www.w3.org/1999/xhtml"><span class="edgeLabel"></span></div></foreignObject></g></g><g class="edgeLabel"><g transform="translate(0, 0)" class="label"><foreignObject height="0" width="0"><div style="display: inline-block; white-space: nowrap;" xmlns="http://www.w3.org/1999/xhtml"><span class="edgeLabel"></span></div></foreignObject></g></g><g class="edgeLabel"><g transform="translate(0, 0)" class="label"><foreignObject height="0" width="0"><div style="display: inline-block; white-space: nowrap;" xmlns="http://www.w3.org/1999/xhtml"><span class="edgeLabel"></span></div></foreignObject></g></g><g class="edgeLabel"><g transform="translate(0, 0)" class="label"><foreignObject height="0" width="0"><div style="display: inline-block; white-space: nowrap;" xmlns="http://www.w3.org/1999/xhtml"><span class="edgeLabel"></span></div></foreignObject></g></g><g transform="translate(458.21484375, 1280.75)" class="edgeLabel"><g transform="translate(-8, -12)" class="label"><foreignObject height="24" width="16"><div style="display: inline-block; white-space: nowrap;" xmlns="http://www.w3.org/1999/xhtml"><span class="edgeLabel">是</span></div></foreignObject></g></g><g class="edgeLabel"><g transform="translate(0, 0)" class="label"><foreignObject height="0" width="0"><div style="display: inline-block; white-space: nowrap;" xmlns="http://www.w3.org/1999/xhtml"><span class="edgeLabel"></span></div></foreignObject></g></g><g transform="translate(354.421875, 1584.375)" class="edgeLabel"><g transform="translate(-8, -12)" class="label"><foreignObject height="24" width="16"><div style="display: inline-block; white-space: nowrap;" xmlns="http://www.w3.org/1999/xhtml"><span class="edgeLabel">是</span></div></foreignObject></g></g><g transform="translate(562.0078125, 1584.375)" class="edgeLabel"><g transform="translate(-8, -12)" class="label"><foreignObject height="24" width="16"><div style="display: inline-block; white-space: nowrap;" xmlns="http://www.w3.org/1999/xhtml"><span class="edgeLabel">否</span></div></foreignObject></g></g><g class="edgeLabel"><g transform="translate(0, 0)" class="label"><foreignObject height="0" width="0"><div style="display: inline-block; white-space: nowrap;" xmlns="http://www.w3.org/1999/xhtml"><span class="edgeLabel"></span></div></foreignObject></g></g><g class="edgeLabel"><g transform="translate(0, 0)" class="label"><foreignObject height="0" width="0"><div style="display: inline-block; white-space: nowrap;" xmlns="http://www.w3.org/1999/xhtml"><span class="edgeLabel"></span></div></foreignObject></g></g><g class="edgeLabel"><g transform="translate(0, 0)" class="label"><foreignObject height="0" width="0"><div style="display: inline-block; white-space: nowrap;" xmlns="http://www.w3.org/1999/xhtml"><span class="edgeLabel"></span></div></foreignObject></g></g><g class="edgeLabel"><g transform="translate(0, 0)" class="label"><foreignObject height="0" width="0"><div style="display: inline-block; white-space: nowrap;" xmlns="http://www.w3.org/1999/xhtml"><span class="edgeLabel"></span></div></foreignObject></g></g><g class="edgeLabel"><g transform="translate(0, 0)" class="label"><foreignObject height="0" width="0"><div style="display: inline-block; white-space: nowrap;" xmlns="http://www.w3.org/1999/xhtml"><span class="edgeLabel"></span></div></foreignObject></g></g><g class="edgeLabel"><g transform="translate(0, 0)" class="label"><foreignObject height="0" width="0"><div style="display: inline-block; white-space: nowrap;" xmlns="http://www.w3.org/1999/xhtml"><span class="edgeLabel"></span></div></foreignObject></g></g></g><g class="nodes"><g transform="translate(235.8515625, 19.5)" id="flowchart-A-274" class="node default default flowchart-label"><rect height="39" width="166.71875" y="-19.5" x="-83.359375" ry="0" rx="0" style="fill:#e1f5fe;" class="basic label-container"/><g transform="translate(-75.859375, -12)" style="" class="label"><rect/><foreignObject height="24" width="151.71875"><div style="display: inline-block; white-space: nowrap;" xmlns="http://www.w3.org/1999/xhtml"><span class="nodeLabel">startApplication 开始</span></div></foreignObject></g></g><g transform="translate(235.8515625, 108.5)" id="flowchart-B-275" class="node default default flowchart-label"><rect height="39" width="127" y="-19.5" x="-63.5" ry="0" rx="0" style="" class="basic label-container"/><g transform="translate(-56, -12)" style="" class="label"><rect/><foreignObject height="24" width="112"><div style="display: inline-block; white-space: nowrap;" xmlns="http://www.w3.org/1999/xhtml"><span class="nodeLabel">检查初始化状态</span></div></foreignObject></g></g><g transform="translate(235.8515625, 239.9375)" id="flowchart-C-277" class="node default default flowchart-label"><polygon style="" transform="translate(-61.9375,61.9375)" class="label-container" points="61.9375,0 123.875,-61.9375 61.9375,-123.875 0,-61.9375"/><g transform="translate(-34.9375, -12)" style="" class="label"><rect/><foreignObject height="24" width="69.875"><div style="display: inline-block; white-space: nowrap;" xmlns="http://www.w3.org/1999/xhtml"><span class="nodeLabel">已初始化?</span></div></foreignObject></g></g><g transform="translate(131.859375, 395.375)" id="flowchart-D-279" class="node default default flowchart-label"><rect height="39" width="127" y="-19.5" x="-63.5" ry="0" rx="0" style="" class="basic label-container"/><g transform="translate(-56, -12)" style="" class="label"><rect/><foreignObject height="24" width="112"><div style="display: inline-block; white-space: nowrap;" xmlns="http://www.w3.org/1999/xhtml"><span class="nodeLabel">记录警告并返回</span></div></foreignObject></g></g><g transform="translate(339.84375, 395.375)" id="flowchart-E-281" class="node default default flowchart-label"><rect height="39" width="188.96875" y="-19.5" x="-94.484375" ry="0" rx="0" style="" class="basic label-container"/><g transform="translate(-86.984375, -12)" style="" class="label"><rect/><foreignObject height="24" width="173.96875"><div style="display: inline-block; white-space: nowrap;" xmlns="http://www.w3.org/1999/xhtml"><span class="nodeLabel">设置状态为 INITIALIZING</span></div></foreignObject></g></g><g transform="translate(339.84375, 484.375)" id="flowchart-F-283" class="node default default flowchart-label"><rect height="39" width="178.09375" y="-19.5" x="-89.046875" ry="0" rx="0" style="" class="basic label-container"/><g transform="translate(-81.546875, -12)" style="" class="label"><rect/><foreignObject height="24" width="163.09375"><div style="display: inline-block; white-space: nowrap;" xmlns="http://www.w3.org/1999/xhtml"><span class="nodeLabel">阶段1: 设置启动前事件</span></div></foreignObject></g></g><g transform="translate(339.84375, 570.875)" id="flowchart-F1-285" class="node default default flowchart-label"><rect height="34" width="180.828125" y="-17" x="-90.4140625" ry="0" rx="0" style="" class="basic label-container"/><g transform="translate(-82.9140625, -9.5)" style="" class="label"><rect/><foreignObject height="19" width="165.828125"><div style="display: inline-block; white-space: nowrap;" xmlns="http://www.w3.org/1999/xhtml"><span class="nodeLabel">setupAppStartupEvents</span></div></foreignObject></g></g><g transform="translate(339.84375, 654.875)" id="flowchart-F2-287" class="node default default flowchart-label"><rect height="34" width="145.953125" y="-17" x="-72.9765625" ry="0" rx="0" style="" class="basic label-container"/><g transform="translate(-65.4765625, -9.5)" style="" class="label"><rect/><foreignObject height="19" width="130.953125"><div style="display: inline-block; white-space: nowrap;" xmlns="http://www.w3.org/1999/xhtml"><span class="nodeLabel">setupAppLifecycle</span></div></foreignObject></g></g><g transform="translate(339.84375, 738.875)" id="flowchart-F3-289" class="node default default flowchart-label"><rect height="34" width="135.828125" y="-17" x="-67.9140625" ry="0" rx="0" style="" class="basic label-container"/><g transform="translate(-60.4140625, -9.5)" style="" class="label"><rect/><foreignObject height="19" width="120.828125"><div style="display: inline-block; white-space: nowrap;" xmlns="http://www.w3.org/1999/xhtml"><span class="nodeLabel">setProcessEvents</span></div></foreignObject></g></g><g transform="translate(339.84375, 822.875)" id="flowchart-F4-291" class="node default default flowchart-label"><rect height="34" width="159" y="-17" x="-79.5" ry="0" rx="0" style="" class="basic label-container"/><g transform="translate(-72, -9.5)" style="" class="label"><rect/><foreignObject height="19" width="144"><div style="display: inline-block; white-space: nowrap;" xmlns="http://www.w3.org/1999/xhtml"><span class="nodeLabel">setupSecurityEvents</span></div></foreignObject></g></g><g transform="translate(339.84375, 906.875)" id="flowchart-F5-293" class="node default default flowchart-label"><rect height="34" width="151.3125" y="-17" x="-75.65625" ry="0" rx="0" style="" class="basic label-container"/><g transform="translate(-68.15625, -9.5)" style="" class="label"><rect/><foreignObject height="19" width="136.3125"><div style="display: inline-block; white-space: nowrap;" xmlns="http://www.w3.org/1999/xhtml"><span class="nodeLabel">setupSystemEvents</span></div></foreignObject></g></g><g transform="translate(339.84375, 993.375)" id="flowchart-G-295" class="node default default flowchart-label"><rect height="39" width="153.703125" y="-19.5" x="-76.8515625" ry="0" rx="0" style="" class="basic label-container"/><g transform="translate(-69.3515625, -12)" style="" class="label"><rect/><foreignObject height="24" width="138.703125"><div style="display: inline-block; white-space: nowrap;" xmlns="http://www.w3.org/1999/xhtml"><span class="nodeLabel">记录: 事件设置完成</span></div></foreignObject></g></g><g transform="translate(339.84375, 1082.375)" id="flowchart-H-297" class="node default default flowchart-label"><rect height="39" width="223.359375" y="-19.5" x="-111.6796875" ry="0" rx="0" style="fill:#fff3e0;" class="basic label-container"/><g transform="translate(-104.1796875, -12)" style="" class="label"><rect/><foreignObject height="24" width="208.359375"><div style="display: inline-block; white-space: nowrap;" xmlns="http://www.w3.org/1999/xhtml"><span class="nodeLabel">阶段2: await app.whenReady</span></div></foreignObject></g></g><g transform="translate(117.6796875, 1197.8125)" id="flowchart-I-299" class="node default default flowchart-label"><rect height="39" width="128.625" y="-19.5" x="-64.3125" ry="0" rx="0" style="" class="basic label-container"/><g transform="translate(-56.8125, -12)" style="" class="label"><rect/><foreignObject height="24" width="113.625"><div style="display: inline-block; white-space: nowrap;" xmlns="http://www.w3.org/1999/xhtml"><span class="nodeLabel">等待应用就绪...</span></div></foreignObject></g></g><g transform="translate(117.6796875, 1337.25)" id="flowchart-J-301" class="node default default flowchart-label"><rect height="39" width="95" y="-19.5" x="-47.5" ry="0" rx="0" style="fill:#f3e5f5;" class="basic label-container"/><g transform="translate(-40, -12)" style="" class="label"><rect/><foreignObject height="24" width="80"><div style="display: inline-block; white-space: nowrap;" xmlns="http://www.w3.org/1999/xhtml"><span class="nodeLabel">应用已就绪</span></div></foreignObject></g></g><g transform="translate(117.6796875, 1477.0625)" id="flowchart-K-303" class="node default default flowchart-label"><rect height="39" width="182.296875" y="-19.5" x="-91.1484375" ry="0" rx="0" style="" class="basic label-container"/><g transform="translate(-83.6484375, -12)" style="" class="label"><rect/><foreignObject height="24" width="167.296875"><div style="display: inline-block; white-space: nowrap;" xmlns="http://www.w3.org/1999/xhtml"><span class="nodeLabel">setupApp 设置基础配置</span></div></foreignObject></g></g><g transform="translate(117.6796875, 1640.875)" id="flowchart-L-305" class="node default default flowchart-label"><rect height="39" width="228.984375" y="-19.5" x="-114.4921875" ry="0" rx="0" style="" class="basic label-container"/><g transform="translate(-106.9921875, -12)" style="" class="label"><rect/><foreignObject height="24" width="213.984375"><div style="display: inline-block; white-space: nowrap;" xmlns="http://www.w3.org/1999/xhtml"><span class="nodeLabel">setupAppEvents 设置窗口事件</span></div></foreignObject></g></g><g transform="translate(117.6796875, 1729.875)" id="flowchart-M-307" class="node default default flowchart-label"><rect height="39" width="235.359375" y="-19.5" x="-117.6796875" ry="0" rx="0" style="" class="basic label-container"/><g transform="translate(-110.1796875, -12)" style="" class="label"><rect/><foreignObject height="24" width="220.359375"><div style="display: inline-block; white-space: nowrap;" xmlns="http://www.w3.org/1999/xhtml"><span class="nodeLabel">createMainWindow 创建主窗口</span></div></foreignObject></g></g><g transform="translate(117.6796875, 1818.875)" id="flowchart-N-309" class="node default default flowchart-label"><rect height="39" width="146.078125" y="-19.5" x="-73.0390625" ry="0" rx="0" style="" class="basic label-container"/><g transform="translate(-65.5390625, -12)" style="" class="label"><rect/><foreignObject height="24" width="131.078125"><div style="display: inline-block; white-space: nowrap;" xmlns="http://www.w3.org/1999/xhtml"><span class="nodeLabel">设置状态为 READY</span></div></foreignObject></g></g><g transform="translate(117.6796875, 1907.875)" id="flowchart-O-311" class="node default default flowchart-label"><rect height="39" width="137.703125" y="-19.5" x="-68.8515625" ry="0" rx="0" style="" class="basic label-container"/><g transform="translate(-61.3515625, -12)" style="" class="label"><rect/><foreignObject height="24" width="122.703125"><div style="display: inline-block; white-space: nowrap;" xmlns="http://www.w3.org/1999/xhtml"><span class="nodeLabel">记录: 初始化完成</span></div></foreignObject></g></g><g transform="translate(117.6796875, 1996.875)" id="flowchart-P-313" class="node default default flowchart-label"><rect height="39" width="79" y="-19.5" x="-39.5" ry="0" rx="0" style="" class="basic label-container"/><g transform="translate(-32, -12)" style="" class="label"><rect/><foreignObject height="24" width="64"><div style="display: inline-block; white-space: nowrap;" xmlns="http://www.w3.org/1999/xhtml"><span class="nodeLabel">返回成功</span></div></foreignObject></g></g><g transform="translate(458.21484375, 1197.8125)" id="flowchart-Q-315" class="node default default flowchart-label"><polygon style="" transform="translate(-45.9375,45.9375)" class="label-container" points="45.9375,0 91.875,-45.9375 45.9375,-91.875 0,-45.9375"/><g transform="translate(-18.9375, -12)" style="" class="label"><rect/><foreignObject height="24" width="37.875"><div style="display: inline-block; white-space: nowrap;" xmlns="http://www.w3.org/1999/xhtml"><span class="nodeLabel">异常?</span></div></foreignObject></g></g><g transform="translate(458.21484375, 1337.25)" id="flowchart-R-317" class="node default default flowchart-label"><rect height="39" width="146.90625" y="-19.5" x="-73.453125" ry="0" rx="0" style="" class="basic label-container"/><g transform="translate(-65.953125, -12)" style="" class="label"><rect/><foreignObject height="24" width="131.90625"><div style="display: inline-block; white-space: nowrap;" xmlns="http://www.w3.org/1999/xhtml"><span class="nodeLabel">设置状态为 FAILED</span></div></foreignObject></g></g><g transform="translate(458.21484375, 1477.0625)" id="flowchart-S-319" class="node default default flowchart-label"><polygon style="" transform="translate(-70.3125,70.3125)" class="label-container" points="70.3125,0 140.625,-70.3125 70.3125,-140.625 0,-70.3125"/><g transform="translate(-45.8125, -9.5)" style="" class="label"><rect/><foreignObject height="19" width="91.625"><div style="display: inline-block; white-space: nowrap;" xmlns="http://www.w3.org/1999/xhtml"><span class="nodeLabel">app.isReady?</span></div></foreignObject></g></g><g transform="translate(354.421875, 1640.875)" id="flowchart-T-321" class="node default default flowchart-label"><rect height="39" width="144.5" y="-19.5" x="-72.25" ry="0" rx="0" style="" class="basic label-container"/><g transform="translate(-64.75, -12)" style="" class="label"><rect/><foreignObject height="24" width="129.5"><div style="display: inline-block; white-space: nowrap;" xmlns="http://www.w3.org/1999/xhtml"><span class="nodeLabel">app.quit 优雅退出</span></div></foreignObject></g></g><g transform="translate(562.0078125, 1640.875)" id="flowchart-U-323" class="node default default flowchart-label"><rect height="39" width="170.671875" y="-19.5" x="-85.3359375" ry="0" rx="0" style="" class="basic label-container"/><g transform="translate(-77.8359375, -12)" style="" class="label"><rect/><foreignObject height="24" width="155.671875"><div style="display: inline-block; white-space: nowrap;" xmlns="http://www.w3.org/1999/xhtml"><span class="nodeLabel">process.exit 强制退出</span></div></foreignObject></g></g><g transform="translate(458.21484375, 1729.875)" id="flowchart-V-325" class="node default default flowchart-label"><rect height="34" width="97.59375" y="-17" x="-48.796875" ry="0" rx="0" style="" class="basic label-container"/><g transform="translate(-41.296875, -9.5)" style="" class="label"><rect/><foreignObject height="19" width="82.59375"><div style="display: inline-block; white-space: nowrap;" xmlns="http://www.w3.org/1999/xhtml"><span class="nodeLabel">throw error</span></div></foreignObject></g></g><g transform="translate(117.6796875, 2085.875)" id="flowchart-W-329" class="node default default flowchart-label"><rect height="39" width="166.71875" y="-19.5" x="-83.359375" ry="0" rx="0" style="fill:#c8e6c9;" class="basic label-container"/><g transform="translate(-75.859375, -12)" style="" class="label"><rect/><foreignObject height="24" width="151.71875"><div style="display: inline-block; white-space: nowrap;" xmlns="http://www.w3.org/1999/xhtml"><span class="nodeLabel">startApplication 成功</span></div></foreignObject></g></g><g transform="translate(458.21484375, 1818.875)" id="flowchart-X-331" class="node default default flowchart-label"><rect height="39" width="166.71875" y="-19.5" x="-83.359375" ry="0" rx="0" style="fill:#ffcdd2;" class="basic label-container"/><g transform="translate(-75.859375, -12)" style="" class="label"><rect/><foreignObject height="24" width="151.71875"><div style="display: inline-block; white-space: nowrap;" xmlns="http://www.w3.org/1999/xhtml"><span class="nodeLabel">startApplication 失败</span></div></foreignObject></g></g><g transform="translate(458.21484375, 1907.875)" id="flowchart-Y-333" class="node default default flowchart-label"><rect height="39" width="111" y="-19.5" x="-55.5" ry="0" rx="0" style="" class="basic label-container"/><g transform="translate(-48, -12)" style="" class="label"><rect/><foreignObject height="24" width="96"><div style="display: inline-block; white-space: nowrap;" xmlns="http://www.w3.org/1999/xhtml"><span class="nodeLabel">最终错误处理</span></div></foreignObject></g></g><g transform="translate(458.21484375, 1996.875)" id="flowchart-Z-335" class="node default default flowchart-label"><rect height="34" width="101.84375" y="-17" x="-50.921875" ry="0" rx="0" style="fill:#ffcdd2;" class="basic label-container"/><g transform="translate(-43.421875, -9.5)" style="" class="label"><rect/><foreignObject height="19" width="86.84375"><div style="display: inline-block; white-space: nowrap;" xmlns="http://www.w3.org/1999/xhtml"><span class="nodeLabel">process.exit</span></div></foreignObject></g></g></g></g></g></svg>

---

#### 渲染进程 (Renderer Process)

- 是什么？
  - 渲染进程是应用中的一个`浏览器窗口`。它的主要工作是使用 HTML, CSS, 和 JavaScript 来展示用户界面。它本质上是一个 `Chromium 浏览器环境`。
- 职责和能力:
  - 构建用户界面：使用熟悉的 Web 技术（React, Vue, Svelte,原生JS等）来创建交互式界面
  - 与用户交互：响应用户的点击、键盘输入等事件
  - 使用 Web API：可以访问所有标准的浏览器 API，如 DOM 操作、fetch、Canvas、Web Audio 等
- 关键点:
  - 多进程：一个 Electron 应用可以有多个渲染进程（例如，多个窗口、或者一个窗口内的 <webview>）
  - 安全沙箱：出于安全考虑，默认情况下，渲染进程不能直接访问 Node.js API 或操作系统资源。这就是为什么我们需要预加载脚本。这个安全特性被称为上下文隔离 (Context Isolation)

---

#### 预加载脚本 (Preload Script)

- 是什么？
  - 预加载脚本是一个在渲染进程的 Web 内容开始加载之前，运行在`渲染进程内部`的特殊脚本。它虽然运行在渲染进程中，但拥有一个`特权环境`
- 职责和能力:
  - 安全桥梁：它的核心使命是作为主进程和渲染进程之间的安全通信桥梁
  - 特权访问：它同时可以访问浏览器 API（如 window, document）和 Node.js API（如 require, process）
  - 暴露 API 给渲染进程：通过 Electron 的 contextBridge 模块，它可以安全地将主进程或 Node.js 的功能封装成函数，并暴露给渲染进程的 window 对象，供其调用
- 关键点：
  - 上下文隔离 (Context Isolation)：即使 preload.js 可以访问 Node.js，contextBridge 也能确保你暴露给渲染进程的函数和变量不会被渲染进程的第三方脚本篡改，从而保证了安全
  - 不是注入全部：绝对不要直接把 require 或整个 ipcRenderer 对象暴露给渲染进程，这是非常危险的。只暴露你需要的最少功能

---

#### 总结

| 特性            | 主进程 (Main Process)             | 渲染进程 (Renderer Process) | 预加载脚本 (Preload Script)    |
| :-------------- | :-------------------------------- | :-------------------------- | :----------------------------- |
| **数量**        | 只有一个                          | 可以有多个                  | 每个渲染进程一个               |
| **环境**        | Node.js                           | Chromium 浏览器             | 特殊的混合环境                 |
| **UI**          | ❌ 没有                           | ✅ 有，负责渲染             | ❌ 没有                        |
| **Node.js API** | ✅ 完全访问                       | ❌ 默认无权限               | ✅ 完全访问                    |
| **DOM/Web API** | ❌ 无法访问                       | ✅ 完全访问                 | ✅ 完全访问                    |
| **主要职责**    | 应用管理、系统交互                | 用户界面、用户交互          | 安全桥梁，连接主进程和渲染进程 |
| **核心模块**    | `app`, `BrowserWindow`, `ipcMain` | `(无特定)`, 使用Web技术     | `contextBridge`, `ipcRenderer` |

### electron进程间的通信

#### 核心原则

由于安全原因（上下文隔离），渲染进程不能直接与主进程对话。所有通信都必须通过预加载脚本这个“安全中介”

#### 核心通信模块

- ipcMain (Inter-Process Communication Main)
  - 运行在`主进程`中。它像一个总机，负责接收和响应来自所有渲染进程的消息
- ipcRenderer (Inter-Process Communication Renderer)
  - 运行在`渲染进程和预加载脚本`中。它像一部电话，可以用来呼叫总机（ipcMain）或者接听来自总机的电话
- contextBridge
  - 运行在`预加载脚本`中。它是安全的桥梁搭建工具，能将预加载脚本中的特权功能（如 ipcRenderer）安全地暴露给渲染进程

#### 通信场景

##### 渲染进程 → 主进程（双向通信）

最常见的场景：渲染进程需要主进程做某件事（如读文件、打开对话框），并**等待一个结果**。

这种模式就像**打电话**：你拨号，等待对方接听，说完事，然后等待对方的答复。

我们使用 `invoke` / `handle` 组合来实现。

**运作流程图:**

```
[用户点击] --> [1. Renderer.js] --> [2. Preload.js] --> [3. IPC Channel] --> [4. Main.js]
   ^                                                                            |
   |                                                                            |
[7. UI更新] <-- [6. Renderer.js] <-- [5. Preload.js] <-- [IPC Channel] <-- [处理并返回结果]
```

**代码实现：**

**第 1 步 & 第 7 步: `renderer.js` (渲染进程 - 客户端)**

```javascript
// 获取按钮和显示区域
const btn = document.getElementById('my-button')
const resultDiv = document.getElementById('result')

btn.addEventListener('click', async () => {
  // 1. 调用由 preload 暴露的 API 函数
  // 这个函数返回一个 Promise
  const response = await window.electronAPI.doSomething('some-data-to-send')

  // 7. 接收到主进程返回的结果，更新UI
  resultDiv.innerText = response
})
```

**第 2 步 & 第 6 步: `preload.js` (预加载脚本 - 安全桥梁)**

```javascript
const { contextBridge, ipcRenderer } = require('electron')

// 2. 使用 contextBridge 暴露一个安全的对象给渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  // 封装 ipcRenderer.invoke，创建一个名为 doSomething 的函数
  // 当 renderer 调用 electronAPI.doSomething 时，它实际上是在调用这个函数
  doSomething: (data) => ipcRenderer.invoke('my-api:do-something', data)
  // 'my-api:do-something' 是我们定义的通信“频道名称”
})

// invoke 的返回值 (Promise) 会自动穿透 contextBridge，
// 所以 renderer 可以直接 await 它。
```

**第 4 步 & 第 5 步: `main.js` (主进程 - 服务端)**

```javascript
const { app, BrowserWindow, ipcMain } = require('electron')

function createWindow() {
  /* ... */
}

app.whenReady().then(() => {
  // 4. 使用 ipcMain.handle 监听来自渲染进程的 'invoke' 请求
  // 这个频道名称必须和 preload 中使用的一模一样
  ipcMain.handle('my-api:do-something', async (event, data) => {
    console.log('收到了来自渲染进程的数据:', data) // "some-data-to-send"

    // 在这里执行耗时的、或需要 Node.js/OS 权限的操作
    // 例如：const files = fs.readFileSync(...)

    // 5. 处理完成后，返回一个结果。这个结果会通过 Promise 发送回渲染进程。
    return `主进程已处理你的请求，返回数据！`
  })

  createWindow()
})
```

**总结 `invoke/handle`:**

- **优点**: 异步、基于 Promise、代码结构清晰，非常适合“请求-响应”模式。
- **用途**: 获取系统信息、读写文件、数据库操作等需要返回值的任务。

---

##### 渲染进程 → 主进程（单向通信）

这个场景下，渲染进程只是想**通知**主进程发生了某件事，但**不关心结果**。

这就像**寄一封信**：你把信投进邮筒就完事了，不期待立即收到回信。

我们使用 `send` / `on` 组合来实现。

**代码实现：**

**`renderer.js`**

```javascript
// 假设有一个日志按钮
logButton.addEventListener('click', () => {
  // 调用 preload 暴露的 API
  window.electronAPI.logMessage('用户点击了日志按钮')
})
```

**`preload.js`**

```javascript
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  // ... 其他 API
  // 封装 ipcRenderer.send
  logMessage: (message) => ipcRenderer.send('log:message', message)
})
```

**`main.js`**

```javascript
// 在主进程中
ipcMain.on('log:message', (event, message) => {
  // 'on' 用于监听 'send' 发送过来的消息
  console.log(`[来自渲染进程的日志]: ${message}`)
  // 这里没有 return，因为渲染进程没有在等待结果
})
```

---

##### 主进程 → 渲染进程（主动推送）

这个场景下，主进程需要**主动地向某个渲染进程发送数据**。比如：应用菜单项被点击、下载进度更新、或者收到了来自服务器的推送。

这就像**电台广播**：主进程是广播站，渲染进程是收音机，必须调到正确的频道才能收听。

**运作流程图:**

```
[主进程事件触发] --> [1. Main.js] --> [2. WebContents] --> [3. IPC Channel] --> [4. Preload.js] --> [5. Renderer.js] --> [更新UI]
```

**代码实现：**

**第 1 步 & 第 2 步: `main.js`**

```javascript
// 假设我们有一个菜单项
const { Menu, BrowserWindow } = require('electron')

const menuTemplate = [
  {
    label: '操作',
    submenu: [
      {
        label: '从主进程发送消息',
        click: () => {
          // 1. 获取目标窗口
          const win = BrowserWindow.getAllWindows()[0] // 简单获取第一个窗口
          if (win) {
            // 2. 使用窗口的 webContents.send 发送消息到这个特定的渲染进程
            win.webContents.send('main-process-message', '这是一个来自主进程的消息！')
          }
        }
      }
    ]
  }
]

const menu = Menu.buildFromTemplate(menuTemplate)
Menu.setApplicationMenu(menu)
```

**第 4 步: `preload.js`**

```javascript
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  // 4. 暴露一个函数，让渲染进程可以注册一个回调函数来接收消息
  // 这样做比直接暴露 ipcRenderer 更安全
  onMainMessage: (callback) =>
    ipcRenderer.on('main-process-message', (_event, value) => {
      callback(value)
    })
})
```

**第 5 步: `renderer.js`**

```javascript
const messageDiv = document.getElementById('main-message')

// 5. 注册一个监听器，当收到主进程消息时，执行回调
window.electronAPI.onMainMessage((value) => {
  console.log('收到了来自主进程的消息:', value)
  messageDiv.innerText = value
})
```

#### 安全性：为什么必须用 contextBridge？

如果你不使用 `contextBridge`，而是选择开启 `nodeIntegration: true`，你的渲染进程将可以直接访问 require 和所有 Node.js 模块

如果你的应用加载了任何第三方的脚本（例如，一个在线图表库），或者存在 XSS（跨站脚本）漏洞，恶意代码就能在你的渲染进程中执行。有了 `nodeIntegration`，这段恶意代码就可以：

- `require('fs').rmSync('/', { recursive: true })` // 删除你的整个硬盘
- `require('child_process').exec('...')` // 执行任意系统命令

**`contextBridge` + `contextIsolation: true` (默认开启) 就是一个防火墙。** 它确保了渲染进程的 `window` 对象和预加载脚本的特权环境是完全隔离的。你通过 `contextBridge` 暴露的 `electronAPI` 对象是唯一被允许穿过这道防火墙的东西，并且它是一个安全的、不可篡改的副本，从而杜绝了上述所有风险。

**结论：永远使用 `contextBridge`，并保持 `contextIsolation` 为 `true`。** 这是现代、安全的 Electron 应用开发的标准实践。

#### send/on 和 invoke/handle

##### 核心比喻

想象一下你和朋友沟通的两种方式：

- **`send / on` 模式就像发短信或发邮件（异步单向）。**
  - **你（`ipcRenderer.send`）**: "我出门了。" (发送消息)
  - **朋友（`ipcMain.on`）**: 收到消息，看到了。
  - 你发送后就继续做自己的事了，你并**不立刻等待**朋友的回复。朋友可能稍后会给你回一条短信，但这两条消息在时间上是独立的事件。

- **`invoke / handle` 模式就像打电话（异步双向请求-响应）。**
  - **你（`ipcRenderer.invoke`）**: "喂，你在哪？" (发起请求并**等待**)
  - **朋友（`ipcMain.handle`）**: "我正在去超市的路上。" (处理请求并**回复**)
  - **你**: 收到回复，然后根据这个信息决定下一步行动。
  - 这是一个完整的、有始有终的会话。你必须等到对方的答复才能挂电话。

##### 技术细节和实现差异

| 特性         | `send / on`                          | `invoke / handle`                          |
| :----------- | :----------------------------------- | :----------------------------------------- |
| **方向性**   | **单向 (One-way)**                   | **双向 (Two-way)**                         |
| **通信模型** | **事件驱动 (Event-driven)**          | **请求-响应 (Request-response)**           |
| **返回值**   | ❌ **没有直接返回值**                | ✅ **有直接返回值 (Promise)**              |
| **异步性质** | 纯异步，"发完即忘" (Fire and forget) | 异步，但基于 `Promise`，可以 `async/await` |
| **实现模块** | `ipcRenderer.send` / `ipcMain.on`    | `ipcRenderer.invoke` / `ipcMain.handle`    |

###### `send / on` 的工作流程

1.  **渲染进程 (或 Preload)**: 调用 `ipcRenderer.send('channel', ...args)`。这个函数**立即返回 `undefined`**。它只是将事件放入消息队列，然后代码继续往下执行。
2.  **主进程**: `ipcMain.on('channel', (event, ...args) => { ... })` 的监听器被**异步触发**。
3.  **主进程回调**: 监听器函数执行，但**它的 `return` 值会被忽略**，无法传回给 `send` 的调用方。
4.  **如果需要回复**: 主进程必须主动调用 `event.sender.send('reply-channel', ...)` 来向原始窗口发送一条全新的消息。渲染进程需要另一个 `ipcRenderer.on('reply-channel', ...)` 来接收这个回复。这导致了通信逻辑的分离和复杂化。

**代码示例:**

```javascript
// --- Preload.js ---
contextBridge.exposeInMainWorld('api', {
  notifyMain: (data) => ipcRenderer.send('notification', data),
  onReply: (callback) =>
    ipcRenderer.on('reply-notification', (_event, ...args) => callback(...args))
})

// --- Renderer.js ---
window.api.notifyMain({ msg: 'Hello' })
window.api.onReply((response) => {
  console.log('收到了主进程的回复:', response) // 在未来的某个时刻被调用
})

// --- Main.js ---
ipcMain.on('notification', (event, data) => {
  console.log(data.msg) // "Hello"
  // 手动发送回复
  event.sender.send('reply-notification', { success: true })
})
```

**问题**: 代码逻辑分散，需要管理多个通道名称，难以跟踪请求和响应的对应关系。

###### `invoke / handle` 的工作流程

1.  **渲染进程 (或 Preload)**: 调用 `ipcRenderer.invoke('channel', ...args)`。这个函数**返回一个 `Promise`**。代码会在此处暂停执行（如果使用 `await`），直到 `Promise` 被 resolve 或 reject。
2.  **主进程**: `ipcMain.handle('channel', (event, ...args) => { ... })` 的监听器被触发。
3.  **主进程回调**: 监听器函数执行。
    - 如果函数**返回一个值** (或一个 resolve 的 Promise)，这个值将被用来 **resolve** 渲染进程的 `Promise`。
    - 如果函数**抛出一个错误** (或一个 reject 的 Promise)，这个错误将被用来 **reject** 渲染进程的 `Promise`。
4.  **渲染进程**: `Promise` 完成，`await` 语句结束，代码从主进程获得返回值并继续执行。

**代码示例:**

```javascript
// --- Preload.js ---
contextBridge.exposeInMainWorld('api', {
  askMain: (data) => ipcRenderer.invoke('question', data)
})

// --- Renderer.js ---
async function ask() {
  try {
    const response = await window.api.askMain({ q: 'What time is it?' })
    console.log('主进程的回答:', response) // "It's 10:00 AM."
  } catch (error) {
    console.error('出错了:', error)
  }
}
ask()

// --- Main.js ---
ipcMain.handle('question', (event, data) => {
  console.log(data.q) // "What time is it?"
  if (everythingIsOk) {
    return "It's 10:00 AM." // 这个返回值会成为 renderer 端 promise 的结果
  } else {
    throw new Error('I have no clock!') // 这个错误会 reject renderer 端的 promise
  }
})
```

**优点**: 代码线性、直观，请求和响应逻辑紧密耦合，错误处理简单。

##### 何时使用哪个？

###### 使用 `send / on` 的场景：

- **单向通知 (Notifications)**: 渲染进程只需要告诉主进程某件事发生了，不关心后续。
  - 例子：记录用户行为日志 ("用户点击了A按钮")。
  - 例子：通知主进程“我现在准备好了，可以接收数据了”。
- **主进程向渲染进程的持续推送 (Streaming/Pushing)**: 主进程需要定期或不定期地向渲染进程发送数据。
  - 例子：报告文件下载进度。
  - 例子：实时股价更新。
  - 例子：系统状态变化通知（如网络断开）。

在这种推送场景下，`invoke/handle` 不适用，因为它是一次性的请求-响应。

###### 使用 `invoke / handle` 的场景：

- **绝大多数需要返回值的IPC通信**。可以说，这是现代 Electron 开发中的**首选和默认 IPC 模式**。
- **调用主进程的功能并获取结果**:
  - 例子：请求打开一个文件选择对话框并获取用户选择的文件路径。
  - 例子：从主进程管理的数据库中查询数据。
  - 例子：请求主进程执行一个计算密集型任务并返回结果。
  - 例子：获取应用配置或系统信息。

---

##### 对比总结

| 对比项         | `send / on`                                    | `invoke / handle`                                                                      |
| :------------- | :--------------------------------------------- | :------------------------------------------------------------------------------------- |
| **模型**       | **发布/订阅 (Pub/Sub)**                        | **远程过程调用 (RPC)**                                                                 |
| **核心目的**   | 触发事件，单向通知                             | 调用函数，获取返回值                                                                   |
| **代码复杂度** | 对于双向通信，逻辑分散，需要管理多个通道和回调 | 代码集中，线性，符合 `async/await` 直觉                                                |
| **错误处理**   | 复杂，需要定义额外的错误消息通道               | 简单，使用标准的 `Promise` 的 `try...catch` 机制                                       |
| **主进程限制** | 对于同一个通道，可以有多个 `ipcMain.on` 监听器 | 对于同一个通道，**只能有一个** `ipcMain.handle` 处理器。若设置多个，会报错并覆盖前者。 |
| **推荐度**     | 用于单向通知和主进程主动推送                   | **强烈推荐**用于所有渲染进程发起的、需要结果的请求                                     |

除非明确是单向通知或持续推送，否则应**优先考虑 `invoke / handle`**。
