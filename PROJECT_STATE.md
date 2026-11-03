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
| 背景動畫 | StageBackdrop 地標圖依累積距離單次推進（固定650m尺度）；2400ms跨背景淡入；非影片／完整3D |
| 道路投影 | PerspectiveRoad＋RoadSurface 生成唯一動態地面，標線／材質／角色／金幣／障礙共用投影與距離；12關材質資料化 |

## 未實作／不在本次授權範圍

Supabase、登入、雲端存檔、排行榜、Capacitor 打包、完整逐格角色跑步動畫／完整分層場景。
InputManager 的 swipe 方法只是預留呼叫入口，不等於已完成手勢辨識或 App。
工程師職責可涵蓋以上工作，但需要日後具體需求。

## 已知問題與待決策

| ID | 問題 | 狀態／下一步 |
| --- | --- | --- |
| ROAD-001 | 已實作共用動態路面，消除遊戲區原圖白線與程式道心分離 | 功能驗證通過；近處側景仍為平面圖片，部分護欄／攤位下緣被新地面遮蓋，真實側景融合待使用者視覺驗收 |
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


## 道路整合評估（2026-11-02）

- 使用者授權評估程式／美術共同改善路寬與動態，也可提出 3D。錢總管已讀角色 Skills，指派只讀工程審查。
- 檢查 PerspectiveRoad、StageBackdrop、roadAlignment、GameScene、輸入／障礙及 01／10 純背景；確認照片縮放、內嵌白線與物件 1/z 深度運動不一致。
- 新增 ROAD_INTEGRATION_PLAN.md：包含素材與工程契約、兩關先行的實作順序、12 關驗收及真 3D 比較。
- 僅新增方案與更新本文件；未修改 src／image，未建置或發布新版。ROAD-001 尚未修復。

## 共用動態路面實作（2026-11-02）

- 使用者明確選擇直接製作共用動態路面。工程子 Agent 提供12關材質資料，獨立工程審查檢查投影及WebGL相容性，錢總管整合。
- 新增 src/data/roadMaterials.js、src/world/RoadSurface.js；修改 PerspectiveRoad、StageBackdrop、GameScene。原圖未覆寫，未新增美術圖片；此次以程序地面替換原圖可見地面，保留上方地標。
- 世界公尺驅動柏油顆粒／光斑、鋪面／木板接縫與兩條道線；使用與遊戲物件相同的1/z投影；材質隨背景權重混合。固定650m背景縮放尺度，消除關卡長度造成的背景速率差。
- 更新順序改成背景→同步投影→路面→物件，避免一幀錯位。Shader精度檢查與編譯失敗使用Graphics備援。
- 驗證：12關畫面總覽與道心投影一致（誤差小於1e-9）；12個關卡／子路段邊界保留障礙，16ms取樣最大道心位移約1.485px；速度18／9／0時地面與物件世界座標無漂移；手機360×640觸控左右換道通過；WebGL與強制Canvas兩分支無pageerror。
- 限制：桌面Edge模擬手機，未測實體手機效能。新路面屬程序材質版本，未完成獨立側景美術／立體遮擋，不宣稱照片級無縫或完整3D。
- 本次供本機預覽，尚未提交／推送GitHub或更新公開網站。

## 小錢背影與側閃（2026-11-02）

- 使用者要求以主視覺小錢背影替換角色，換道參考閃身步，並發出語音；可於明天提供原創錄音。
- 使用內建 imagegen 參考原主視覺產出透明1536×1024圖集，保存在 image/characters/xiaoqian-back-poses.png；使用後方跑姿、左閃、右閃三個裁切框。提示詞與契約見同目錄README。
- RunnerAnimator 獨立處理姿勢切換／低重心／微傾／回正。LaneMovementController 只新增成功換道事件，原180ms、三道邊界與碰撞規則不變。既有裝備保存並以簡單外觀覆蓋表現，未生成各裝備專屬角色圖。
- 無錄音時以裝置SpeechSynthesis說「閃身步」，不複製網路影片原音或聲線；650ms間隔且不堆疊語音；錄音放入 src/audio/clips/shanshenbu.mp3 後優先使用。沒有支援語音的裝置可能無聲。
- 驗證：Vite build成功；Edge檢視背影／左右姿勢透明與腳點；成功換道觸發語音，越界不觸發，場景切換無pageerror。語音使用測試替身驗證觸發，未宣稱聽驗裝置聲音。
- 限制：目前跑動為單張背影起伏，側閃為姿勢切換與變形，非完整骨骼或逐格跑步動畫；未收到使用者錄音。未提交／推送公開版。

## 技能動作美術（2026-11-03）

- 使用者要求依相同角色條件製作「浪子踢球（攻擊擊飛障礙物）」與「狗熊哆嗦毛（無敵3秒）」圖檔。本次依圖檔任務交付美術及接入契約，不將括號效果冒充成已實作技能。
- 內建imagegen生成兩張透明PNG：image/characters/xiaoqian-langzi-kick.png、xiaoqian-bear-shiver.png；實際887×1774，四幀2×2排列。另附skill-actions.json與SKILL_ACTION_PROMPTS.md；原圖未覆寫。
- 驗證：RGBA尺寸、角落及中間透明像素，瀏覽器灰底合成檢視四肢完整與分格。踢擊圖需每幀flipX才能與既有跑姿斜背包方向一致，已寫入契約；尚需在正式接入時校正腳點。
- 浪子踢球建議第3幀觸發一次擊飛，狗熊哆嗦毛建議125ms×4幀×6循環＝3000ms。冷卻、攻擊範圍與按鈕未設定；原遊戲生命、碰撞與受傷無敵不改。
- 本次未修改src、未建置、未推送GitHub。技能尚未在遊戲中啟用。

## 攻擊／無敵按鈕與技能接入（2026-11-03）

- 使用者授權在遊戲中增加攻擊、無敵按鈕並接入剛製作的動畫。新增 src/data/skills.js、managers/SkillManager.js、input/SkillControls.js；修改 BootScene、GameScene、RunnerAnimator、characterAppearance、ObstacleManager，及素材契約狀態。
- 下方中央兩顆120×132邏輯像素按鈕（x288／432，y1174）與左右換道區分離；手機360×640為60×66CSS像素；桌面J攻擊／K無敵。顯示剩餘秒數與進度條，技能活動時互斥且不能延長。
- 浪子踢球：500ms四幀，220ms第3幀觸發一次，依角色實際X選最近跑道，擊飛前方18m內最近一個障礙，600ms旋轉縮小淡出；不額外加分或金幣。
- 狗熊哆嗦毛：125ms四幀循環、3000ms遊戲時間無敵；光圈與倒數；不改既有受傷1000ms保護／減速。此版本不加消耗或額外冷卻，動作期間不重複啟動，之後可再次使用。
- 驗證：Vite build成功；Edge手機模擬觸控無敵、J快捷鍵、攻擊219ms前不命中／220ms命中一次且保留遠方與異道物件、無敵0／2999ms保護而3000ms到期受傷、跨Scene及重開狀態清理均通過，無pageerror。兩組技能姿勢和按鈕截圖已檢視。
- 近道選擇與擊飛回收另經工程子Agent stub驗證。未測實體手機效能；未提交或推送GitHub。

## GitHub 發布（2026-11-03）

使用者要求將目前新版發布到GitHub。本次整合共用動態道路、小錢背影與側閃、裝置語音、浪子踢球攻擊、狗熊哆嗦毛3秒無敵與操作按鈕。先前本機建置與功能驗證已通過；已推送功能提交 5c485b7；GitHub Actions 執行 41533177844 部署成功。公開網址 https://xromanchien.github.io/xiaoqian-dodge/ 回應 HTTP 200，載入新版 index-Du7aK3bu.js；Edge 360×640 手機模擬成功開始遊戲並觸發無敵，畫面顯示小錢背影、共用道路、攻擊與無敵按鈕及護盾倒數，無 JavaScript pageerror。前述「未推送」為各任務交付當時狀態。

## 直線跑步動畫（2026-11-03）

使用者要求直線前進改成跑步動作。新增 image/characters/xiaoqian-run-cycle.png 與 RUN_CYCLE.md，四幀透明2×2圖集；更新 runnerArt、BootScene、characterAppearance、RunnerAnimator，以110ms每幀循環，受傷減速時步頻同步降低，0速度不推進步頻。技能及換道優先，結束自動切回跑步；未改碰撞、速度、生命或存檔。
Vite build通過（原有大型bundle警告仍在）。Edge 360×640手機比例實際畫面已檢視；四幀循環1/2/3/0、0速度、0.5減速、側閃及無敵後返回跑步均驗證通過，無pageerror。素材以內建imagegen生成，提示詞與原點見RUN_CYCLE.md。本次尚未提交或推送GitHub。

## 商店裝備遊戲內外觀美化（2026-11-03）

- 使用者授權美化裝備後的遊戲外觀。新增 src/data/equipmentAnchors.js、src/world/EquipmentRenderer.js，替換 characterAppearance.js 的固定色塊。前一任務的跑步修改保留。
- 15件現有商品皆有外觀分支：棒球帽／禮帽／針織帽／漁夫帽形狀與縫線、衣服乘色裝飾與細節、鞋面與白底線、斜背包飾邊、麥克風、魔方吊飾、圍巾。沿用程式繪製素材，無新生成圖片。
- 原始圖集座標定位，靜態、左右閃身、4幀跑步、4幀攻擊、4幀護盾共15組定位；與Sprite同翻轉、縮放及原點，帽子另外補償直式圖集比例；只在姿勢切換重繪。圖層隨rig銷毀，無新計時器。
- 驗證：Vite build通過（原有bundle大小警告）；Edge隔離環境15商品遍歷跑步／攻擊／護盾及左右閃身無pageerror；初版總覽找出帽型拉高後修正，再檢視360×640實際跑步穿戴畫面。測試未寫入玩家LocalStorage，讀前讀後一致。未測實體手機或宣稱全部組合視覺完美。
- 限制：此版是逐姿勢定位的風格化裝飾層，服裝保留原有袖子和角色輪廓，並非每件商店服裝獨立重繪的完整圖集。價格、能力、碰撞、存檔格式不變。未提交／推送GitHub。

## 跑步與裝備新版發布（2026-11-03）

使用者要求更新GitHub。已推送1abd406（加入循環跑步動畫並美化裝備外觀）；GitHub Actions 41580296079部署成功。公開頁面HTTP 200、載入index-BuFu1cwB.js；Edge手機比例成功開始遊戲、無pageerror。前兩任務「尚未推送」為當時交付狀態，現已發布。
