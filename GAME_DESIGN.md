# GAME_DESIGN — 《小錢閃身步》

本文件記錄現有 V0.1 設計基準。核心數值調整須有使用者明確授權，由錢總管記錄。
本次僅建立文件，不實作新功能。

## 定位與流程

直式 9:16、2.5D 三跑道跑酷，使用 Vite／JavaScript／Phaser。
BootScene 載入素材，MenuScene 提供開始遊戲、角色選擇與外觀商店；GameScene 跑酷，ResultScene 顯示結算。
CharacterScene 只有小錢可選，其餘鎖定／敬請期待。ShopScene 使用累積金幣購買外觀。

## 核心規格

| 項目 | 基準 |
| --- | --- |
| 畫面 | 邏輯解析度 720×1280；Phaser FIT、CENTER_BOTH；保持 9:16 |
| 角色 | 中心約 y=960（75% 高度），腳點 y=1020；主視覺衍生背影Sprite；側閃只影響外觀 |
| 跑道 | 左／中／右三條；約 180ms 平滑換到相鄰道，不越界 |
| 輸入 | 左右方向鍵；觸控裝置左下／右下按鈕；預留 swipeLeft／swipeRight，全部共用 moveLeft／moveRight |
| 生命 | 每局 3 點；碰撞扣 1；同一障礙不重複扣血；生命為 0 結算 |
| 受傷 | 1000ms 無敵與閃爍；1000ms 速度降至 50% |
| 障礙 | 隨 stage.obstacleTypes 隨機選類型與跑道；crate／cone／barrier；靠近放大並加速下移 |
| 金幣 | 單枚、5 枚直線、5 枚左右交錯；每枚 +1 本局 coinsEarned，收集有動畫 |
| 分數 | floor(max(0, distance)) + coinsEarned × 10 |
| 裝備 | 僅外觀；不得影響生命、速度、換道或碰撞範圍 |
| 過關 | 同一 GameScene 連續運作；保留既有障礙、金幣與生成進度；7000m 通關 |

不得因美術不合而偷偷變更上述規格。價格／生成節奏／基本速度也是平衡設定，變更需明確授權。

## 12 關資料

資料來源：src/data/stages.js；距離 m、速度 m/s。範圍為 [起點, 終點)，末關到達終點完成。

| ID | 名稱 | 長度 | 起點 | 終點 | 速度 | obstacleTypes | backgroundKey |
| --- | --- | ---: | ---: | ---: | ---: | --- | --- |
| 1 | 金龍路 | 200 | 0 | 200 | 18 | crate | jinlongRoad |
| 2 | 金龍隧道 | 200 | 200 | 400 | 19 | crate, cone | jinlongTunnel |
| 3 | 美麗華 | 300 | 400 | 700 | 20 | cone, barrier | miramar |
| 4 | 大直橋 | 400 | 700 | 1100 | 21 | barrier, cone | dazhiBridge |
| 5 | 圓山飯店 | 500 | 1100 | 1600 | 22 | crate, barrier | grandHotel |
| 6 | 士林夜市 | 600 | 1600 | 2200 | 23 | crate, cone | shilinMarket |
| 7 | 捷運淡水線 | 700 | 2200 | 2900 | 24 | barrier, crate | tamsuiMetro |
| 8 | 洲美快速道路 | 800 | 2900 | 3700 | 25 | cone, barrier | zhoumeiExpressway |
| 9 | 淡水輕軌 | 900 | 3700 | 4600 | 26 | barrier, cone | tamsuiLightRail |
| 10 | 漁人碼頭 | 1000 | 4600 | 5600 | 27 | crate, cone | fishermansWharf |
| 11 | 淡江大橋 | 900 | 5600 | 6500 | 28 | barrier, cone | danjiangBridge |
| 12 | 八里老街 | 500 | 6500 | 7000 | 24 | crate, barrier | baliOldStreet |

第 1 關結束自動右轉視覺；第 2 關前 27m 為道路，227m 起進入隧道，隧道本身 173m。總長 7000m，不按舊圖的 6900m 改回。

## 系統責任

- StageManager：距離／關卡／子路段／完成判定，不把關卡寫成 GameScene 大量 if。
- InputManager：輸入轉接；LaneMovementController：唯一換道邏輯及索引插值。
- PerspectiveRoad：共用 1/z 投影；roadAlignment：背景道路校正資料。
- StageBackdrop：地標單張持續推進，不 loop；背景之間2400ms平滑淡入、對齊消失點；按固定650m尺度推進，不由關卡長度決定倍率。
- RoadSurface：以共用投影及累積公尺生成材質；PerspectiveRoad畫唯一三道標線；兩者使用相同轉場權重。
- ObstacleManager、CoinManager：各自生成、投影、判定、回收。判定使用角色當下 X 與腳點深度掃過區間。
- GameScene：組裝各系統與本局生命、減速、結束；ResultScene：呈現結算。
- shopItems.js 為商品與價格資料；UI 視覺不得成為經濟數值來源。
- 原圖白線由共用動態路面取代；道心與可見標線一致。近處側景接縫與遮蓋限制見 PROJECT_STATE.md 的 ROAD-001。

## 存檔與資料

LocalStorage key：xiaoqian-dodge.profile.v1。
資料欄位：version、totalCoins、character、ownedItems、equipped；舊 xiaoqian-dodge.totalCoins 可遷移。
目前裝備槽為 head、outfit、bottoms、shoes、accessory、effect；空槽與預設外觀可為 null。
購買一次寫入金幣與持有資料，拒絕重複購買、餘額不足及非法穿戴；存檔失敗不完成購買。
一局結束只結算一次；中途重新整理不保存未結算金幣。資料不跨來源或裝置同步。

## 未來範圍

登入、Supabase、排行榜、Capacitor、雲端同步須另行立項。不得因工程師職責包含它們而立即加套件、資料庫或登入頁。

換道表演：成功換道送出 runner-dodge 事件，RunnerAnimator 處理左右低重心姿勢與回正；不改180ms移動或碰撞尺寸。語音優先使用原創錄音，缺檔則嘗試裝置中文TTS；邊界拒絕不播，間隔650ms避免連按重疊。

## 已接入技能（2026-11-03）

- 攻擊：下方按鈕或J，500ms四幀動畫，220ms命中幀擊飛當下最近跑道前方18m內最近一個障礙；沒有目標則空踢。擊飛不增加分數／金幣。
- 無敵：下方按鈕或K，狗熊哆嗦毛循環與護盾持續3000ms遊戲時間。與受傷後1000ms保護分開計時，不延長、不互相覆蓋。
- 兩技能互斥；播放中重複點按或按住鍵盤不排隊、不重啟；無額外消耗與冷卻。仍可左右換道，技能動畫期間暫不插播側閃動畫。
- 數值集中在src/data/skills.js。按鈕位置x288／432、y1174，120×132，避免左右換道區與角色腳點。

## 線上排行榜（使用者於2026-11-03授權，後端待啟用）

本局統計新增排行榜入口，玩家自行輸入1～20字公開姓名，依每局取得金幣降序，顯示前20筆。同金幣並列（1、2、2、4），先登錄者先顯示。每局一筆，名字不當帳號、不合併同名玩家；不新增登入、金幣同步或獎勵。Supabase只儲存run_id、姓名、本局金幣、登錄時間，原LocalStorage錢包不變。客戶端自報版本並非具防作弊能力的競賽榜。
