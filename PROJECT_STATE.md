# PROJECT_STATE — 《小錢閃身步》

盤點日期：2026-11-02（Asia/Taipei）
維護者：錢總管。每次任務結束更新；明確區分「已實作」「已驗證」「待決策」。

## 專案位置與工具

- 根目錄：C:/Users/錢君仲/Documents/Codex-Practice/xiaoqian-dodge
- 已建立 Git repository：master 追蹤 origin/master；遠端 https://github.com/XromanChien/xiaoqian-dodge.git；初始版本 1f8911774c8ab016ad978bbfd989d4037f38a455。
- package.json：版本 0.1.0、JavaScript ESM；Phaser ^3.90.0、Vite ^7.0.0；Node >=22.12.0。
- 有 pnpm-lock.yaml、node_modules、dist；npm scripts 僅 dev、build、preview，沒有 test script。
- src 為原始碼；image 為圖片；image/backgrounds 為 12 關純場景及生成紀錄。dist 是產物。
- 開發網址通常為 http://127.0.0.1:5173/，需啟動伺服器，實際埠以啟動輸出為準。此文件不保證服務永久在線。
- 存檔在同源瀏覽器 LocalStorage，搬移專案不等於移動／清空瀏覽器存檔。

## 已實作（本次以原始碼盤點）

| 項目 | 狀態／證據 |
| --- | --- |
| 720×1280、FIT、9:16 | src/main.js；Boot、Menu、Character、Shop、Game、Result 六個 Scene |
| 三跑道與輸入 | LaneMovementController；InputManager 鍵盤、觸控按鈕及 swipeLeft／swipeRight 入口 |
| 關卡 | stages.js 12 關、總長 7000m；第一關 200m，第二關前 27m 道路、後 173m 隧道 |
| 關卡進度 | StageManager 依距離切換；GameScene 保持運作 |
| 受傷與障礙 | ObstacleManager；3 點生命、扣 1、1 秒無敵與 50% 減速；零生命進結果頁 |
| 金幣與結算 | CoinManager 單枚、直線、交錯；ResultScene 距離、場景、金幣與總分 |
| 角色與商店 | 小錢可用；其餘鎖定；外觀購買與穿戴，LocalStorage 持有資料 |
| 圖片介面 | screenArt.js、artUi.js、shopArtLayout.js；完整底圖加互動與動態文字 |
| 背景動畫 | StageBackdrop 單張依距離推進、無關內 loop；2400ms 跨背景淡入；非影片／3D |
| 道路投影 | PerspectiveRoad、roadAlignment；角色／金幣／障礙共用投影，但仍有視覺問題 |

## 未實作／不在本次授權範圍

Supabase、登入、雲端存檔、排行榜、Capacitor 打包、正式角色跑步 Sprite／完整分層場景。
InputManager 的 swipe 方法只是預留呼叫入口，不等於已完成手勢辨識或 App。
工程師職責可涵蓋以上工作，但需要日後具體需求。

## 已知問題與待決策

| ID | 問題 | 狀態／下一步 |
| --- | --- | --- |
| ROAD-001 | 背景既有白線與實際三車道未一致；過去移動範圍與投影數值檢查通過，使用者仍指出視覺不合 | 待使用者決策。已提案移除 12 張背景道路白線，改由程式畫共用三車道。尚未同意；本次建團隊不等於同意該提案 |
| ART-001 | 單張背景只能縮放與淡入，無法呈現真實連續空間；部分 UI 與大幅角色為靜態圖 | 現況限制；分層與 Sprite 待指派 |
| DOC-001 | README 含歷次追加紀錄及早期設計，部分描述已被後續實作取代 | 本次未改寫 README；未來維護以本狀態、規格與程式核對 |
| INFRA-001 | 已有 Git、GitHub 遠端與 Pages 建置部署流程；尚無持久化自動測試套件 | 建置檢查不等於完整遊戲自動測試 |

## 規格與決策紀錄

- 第一關由 100m 改為 200m 是先前使用者要求；總距離因此是 7000m，原圖／舊需求的 6900m 不再是現行規格。
- 使用者要求同關不 loop，現行背景為單次連續推進。
- 2026-11-02 使用者要求建立三角色團隊與文件，明確要求不修改遊戲功能、不刪除或改寫程式。
- 新文件與 Skills 是作業架構，不是新增登入、後端或自行批准 ROAD-001。

## 驗證紀錄

- 歷史紀錄：先前有 Vite build、隔離瀏覽器場景載入、12 關投影與轉場檢查；這不代表 ROAD-001 已視覺驗收。
- 本次：盤點原始碼、目錄與 Git 狀態；管理文件、Skill 結構與相對連結檢查。
- 本次不為純文件改動重跑遊戲建置；以 SHA-256 比對既有 src、image、package／lockfile、入口及 README，確保原有內容未改。
- 本次既有 67 個檔案 SHA-256 比對一致，涵蓋 src、image、package／lockfile、入口、README 等；遊戲程式與素材未變。
- 三個 Skills 的雙欄位 frontmatter、名稱、描述與未完成模板檢查通過；20 個文件相對連結均可解析。內建 quick_validate.py 已嘗試，但缺少 PyYAML 而未能完成，以上為獨立基本檢查，不宣稱官方驗證器通過。
- 獨立子 Agent 以「只提三車道方案」及「只做角色草圖」進行文件情境審閱；已修正純素材任務不得自動延伸成工程接入的語句，並補上 Skill 未自動顯示時的明確讀取方式。

## 任務紀錄格式

每筆記錄保留：日期／需求、任務分類、使用者授權、工程／美術分工、修改檔案、驗證證據、已知限制、待決策、下一步。
完成新工作時更新上方現況，不只在底部累加過期結論。

## GitHub Pages 部署（2026-11-02）

- 使用者授權設定公開試玩部署；工程範圍為 vite.config.js、.github/workflows/deploy.yml、README.md 與本狀態文件。
- 不修改 src、image、核心遊戲規則。正式 base=/xiaoqian-dodge/，開發 base=/。
- Node 22／pnpm 10.11.0／frozen lockfile；僅發布 dist；master 程式或素材推送自動部署，文件更新略過。
- 本機 Vite production build 成功；既有 Phaser bundle 大小警告保留。GitHub Actions run 41353949862 全部成功。公開網址 https://xromanchien.github.io/xiaoqian-dodge/ 回傳 HTTP 200；Edge 隔離瀏覽器驗證首頁、開始遊戲、左右鍵輸入，已看到 GameScene 運行；無 pageerror 或 HTTP 4xx/5xx 素材回應。

