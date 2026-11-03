# 線上金幣排行榜啟用

1. 建立或選擇Supabase專案，在SQL Editor執行leaderboard.sql。此腳本啟用RLS、禁止直接表格存取，只開放登錄和讀取前20名的RPC。
2. 複製.env.example為.env.local，填入Project URL及publishable key（或anon public key），重啟Vite。不要使用service_role／secret key。
3. GitHub repository Settings → Secrets and variables → Actions → Variables，新增VITE_SUPABASE_URL與VITE_SUPABASE_PUBLISHABLE_KEY，再執行Pages部署流程。這兩項是公開前端設定，不是後端管理金鑰。
4. 真實驗收：兩個不同瀏覽器各完成一局、姓名登錄後看到同一份排名；確認同局重試只有一筆、同金幣並列、匿名無法直接修改／刪除coin_runs。

每筆代表一局，不做姓名帳號綁定或同名合併。排名依coins降序；同分並列，顯示先登錄者在前。回結算再進排行榜沿用runId。登錄失敗可重試；沒有後端設定時明確顯示尚未開通，不假裝成功或改存本機榜。

目前為客戶端回報的休閒排行榜：資料庫檢查姓名／金幣型別與範圍、UUID去重，但不驗證整局遊玩過程，不能宣稱防作弊。公開RPC尚無CAPTCHA／速率限制；若用於競賽獎勵，需另行加入伺服器驗分與防灌榜。管理員可透過Supabase後台移除不當名稱，不開放瀏覽器刪除。

官方API key說明：https://supabase.com/docs/guides/getting-started/api-keys

前端用戶端位於src/services/supabaseClient.js，使用官方@supabase/supabase-js；leaderboard.js呼叫supabase.rpc。設定缺少時supabase為null，排行榜顯示尚未開通。playerName由表單提供，coins為result.coinsEarned，runId在同局重試間保持一致。
