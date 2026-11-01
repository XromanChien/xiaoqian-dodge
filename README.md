# 小錢閃身步

Vite + JavaScript + Phaser 的 2.5D 三跑道原型。遊戲解析度 720×1280，FIT 等比例縮放至瀏覽器可用空間，保持 9:16。

## 執行

使用 Node.js 22.12 以上版本（含 npm），在專案目錄執行：

```sh
npm install
npm run dev
```

開啟終端機顯示的網址。`npm run build` 產生 dist，`npm run preview` 可預覽建置結果。亦可使用 pnpm 安裝與執行。

## 操作與視覺

- 電腦按左右方向鍵；觸控裝置點按左下／右下透明按鈕。
- InputManager 將鍵盤、觸控及預留的 swipeLeft()/swipeRight() 都轉交 LaneMovementController；移動、邊界與動畫只有一份。
- 角色中心固定在 75% 高度，換道約 180ms；長按不連發。
- 道路與障礙物共用 1/z 投影，越靠近越大、間距越開。幾何障礙物離開畫面後回收。
- 目前具有碰撞與生命系統，沒有登入或資料庫；背景使用 12 張純場景插畫，角色與互動物件仍為幾何原型。

## 關卡資料

src/data/stages.js 是關卡設定來源。每關包含 id、name、length、startDistance、endDistance、baseSpeed、obstacleTypes、backgroundKey。起訖距離由長度自動累加；距離為 m，速度為 m/s。速度與障礙物配置為可調整的原型設定。

| 關卡 | 名稱 | 長度 | 起點 | 終點 | 基本速度 |
| --- | --- | ---: | ---: | ---: | ---: |
| 1 | 金龍路 | 200 | 0 | 200 | 18 |
| 2 | 金龍隧道 | 200 | 200 | 400 | 19 |
| 3 | 美麗華 | 300 | 400 | 700 | 20 |
| 4 | 大直橋 | 400 | 700 | 1100 | 21 |
| 5 | 圓山飯店 | 500 | 1100 | 1600 | 22 |
| 6 | 士林夜市 | 600 | 1600 | 2200 | 23 |
| 7 | 捷運淡水線 | 700 | 2200 | 2900 | 24 |
| 8 | 洲美快速道路 | 800 | 2900 | 3700 | 25 |
| 9 | 淡水輕軌 | 900 | 3700 | 4600 | 26 |
| 10 | 漁人碼頭 | 1000 | 4600 | 5600 | 27 |
| 11 | 淡江大橋 | 900 | 5600 | 6500 | 28 |
| 12 | 八里老街 | 500 | 6500 | 7000 | 24 |

金龍路的 exitTurn 設為 right，到 200m 時自動播放右轉視覺。金龍隧道的 sections 定義前 27m 為隧道前道路（總距離 200–227m），後 173m 為隧道內（227–400m）。目前轉彎為自動視覺轉場，不需要另按轉彎鍵。

StageManager 依距離選取關卡與子路段，在邊界通知 GameScene 套用背景、速度和障礙物設定。切換沿用同一個 GameScene，不重建輸入控制。路面移動與累積距離使用同一個基本速度；跨關幀分段計算。切關時保留上一關已生成的障礙物與生成計時；新障礙物才使用新關卡種類，既有障礙物繼續移動、碰撞並正常回收。

到達 7000m 後進入 ResultScene，顯示完成距離並可回到選單重玩。BootScene 負責啟動，MenuScene 提供開始遊戲、角色選擇、外觀商店入口。

## 檔案分工

- src/data/stages.js：12 關、子路段與轉彎資料。
- src/data/backgrounds.js：背景 key 對應幾何配色與隧道外觀。
- src/managers/StageManager.js：距離、關卡／子路段切換與完成事件。
- src/world/PerspectiveRoad.js：透視道路、速度與轉彎。
- src/world/obstacleDrawers.js：箱體、交通錐、路障的幾何繪製表。
- src/input/InputManager.js：共用輸入入口。
- src/controllers/LaneMovementController.js：唯一的換道邏輯。

金龍隧道目前使用純場景插畫搭配動態透視引導線；舊版幾何隧道繪製保留作參考。

## 障礙物與受傷

- src/managers/ObstacleManager.js 依目前 stage.obstacleTypes 隨機選擇種類與左／中／右跑道，負責生成、投影、碰撞及回收。
- 小錢每次開始有 3 點生命；撞到障礙扣 1 點，同一障礙只處理一次。
- 受傷後有 1000ms 無敵與閃爍，同時減速至 50%，1000ms 後恢復。距離、道路、障礙物與生成節奏使用一致速度。
- 碰撞依角色當下的水平位置及腳下深度判定，並檢查障礙物本幀掃過範圍，避免高速漏判；遠處或其他跑道不會因圖形重疊而受傷。
- 生命為 0 顯示失敗結果與實際距離；到達 7000m 顯示通關結果。重玩時生命與受傷狀態全部重置。

開局會依正常世界間距預生成一列障礙，最近一個約在開始後 2.9 秒（52m）接近玩家，提供反應時間且在第一關內就能進行閃避；換關仍保留障礙與生成計時。

## 金幣與分數

- CoinManager 生成單枚、同跑道 5 枚直線、左／右跑道 5 枚交錯排列。
- 金幣沿用道路投影與實際前進速度，受傷時一起減速；換關不清空。
- 觸碰金幣增加 coinsEarned，顯示金幣上浮淡出與 +1 動畫，同一枚只計算一次。
- 每局開始 coinsEarned 歸零。通關或生命耗盡後，ResultScene 顯示距離、抵達場景、本局金幣、累積金幣與總分。
- 總分公式：floor(距離) + coinsEarned × 10，集中在 src/storage/coinStorage.js 的 calculateScore。
- 每局結束只入帳一次，使用 LocalStorage key：xiaoqian-dodge.profile.v1，內含 totalCoins、ownedItems、equipped 與角色資料。舊版 xiaoqian-dodge.totalCoins 金幣會自動讀取並於下次儲存時遷移。重新整理可保留已結算金幣；中途重新整理尚未結算的本局金幣不入帳。
- 累積資料限目前瀏覽器及同一網站來源，不跨裝置同步。儲存受限時遊戲仍可繼續，結果畫面會提示未能儲存。

## V0.1 角色與外觀商店

- 首頁、角色選擇、外觀商店分別使用 image/主視覺小錢02.png、image/選角色.01.png、image/外觀商店01.png；BootScene 預載，Vite 建置時打包原圖。
- src/data/screenArt.js 定義底圖，src/ui/artUi.js 統一處理原圖座標到 720×1280 的互動區域轉換，縮放後按鈕仍對齊。
- CharacterScene 只有小錢可用；其他角色鎖定並顯示敬請期待。「選擇角色」返回首頁。
- ShopScene 的金幣餘額、價格、購買與裝備狀態使用實際存檔覆蓋原圖固定文字。商品配置集中在 src/data/shopItems.js，版面位置在 src/data/shopArtLayout.js。
- 點選商品可預選；購買後再按「裝備」穿戴。分類按鈕可篩選商品，再次點選取消篩選；尚無商品的分類顯示敬請期待。
- 裝備欄位為頭部、服裝、下裝、鞋子、配件、特效。右上「裝備」入口可循環已持有道具與預設外觀，也保留舊版道具的穿戴入口。
- 介面的大幅角色插畫為靜態底圖；實際遊戲中的幾何角色會套用裝備外觀。裝備不更動生命、速度、換道或碰撞範圍。
- 購買使用單次 LocalStorage 寫入，同時更新餘額與持有道具；重複購買、餘額不足、未持有或欄位不符的穿戴操作會被拒絕。儲存失敗不扣款、不發放道具。
- 存檔集中在 src/storage/profileStorage.js，角色與商店沿用同一份金幣資料，舊版已購道具保留。

## 12 關純場景背景

- image/backgrounds/01-clean.png 至 12-clean.png 是移除人物、HUD、金幣及跑道障礙後的新圖；原始參考圖保留。生成方式與提示詞記錄在 image/backgrounds/PROMPTS.md。
- src/data/stageArt.js 依 backgroundKey 對應圖片；BootScene 預載圖片並顯示進度。
- src/world/StageBackdrop.js 使用雙圖層 650ms 淡入銜接。GameScene 依 StageManager 的關卡與子路段切換背景，不清空金幣或障礙物。
- 第二關前 27m 使用金龍路背景，到總距離 227m 換成金龍隧道。第一關仍為 200m，總長 7000m。
- 背景是靜態地標插畫；路面使用半透明的動態透視引導線，角色、障礙與金幣仍共用 1/z 投影。舊幾何背景繪製保留於 backgrounds.js 作參考，目前 GameScene 僅使用其配色。


## 動態背景
StageBackdrop 將遠景依本關前進距離緩慢放大，中央路面取樣以 1/z 透視持續向下流動。動畫使用 GameScene 傳入的實際速度，受傷減速時同步放慢；雙層轉場保留，離開場景時回收 Canvas 紋理。此為圖片驅動的 2.5D 動畫，非影片或完整 3D 場景。

背景動畫修正：12 關改為整幅場景持續前進，使用依距離循環的雙圖層縮放，僅在循環尾端短暫交接，避免長時間重影。換關使用 1400ms 淡入，交接期間兩個場景持續移動；連續換景請求排隊銜接。已移除舊版中央 Canvas 路面取樣效果。


## 道路與場景對齊
roadAlignment.js 為 12 張背景設定消失點與前景道路寬度。StageBackdrop 將背景縮放、位移及換景權重轉成共用道路投影，PerspectiveRoad 提供角色、障礙與金幣的統一座標。已移除額外的路面、藍色邊線與虛線，直接使用圖片中的道路。換道動畫改為跑道索引插值，使動畫期間也能跟隨背景透視。

## GitHub Pages 試玩與部署

公開試玩網址：https://xromanchien.github.io/xiaoqian-dodge/

推送 master 分支的程式或素材更新後，GitHub Actions 會使用 Node 22、pnpm 10.11.0 與 frozen lockfile 建置，再發布 dist。純 Markdown／Skill 文件更新不觸發發布，也可在 Actions 手動執行 Deploy game to GitHub Pages。
本機開發仍使用根路徑；正式建置使用 /xiaoqian-dodge/。LocalStorage 依網址來源分開，因此公開網站與 localhost 的金幣存檔各自獨立。
