# 小錢背影圖集

內建 imagegen 生成，參考使用者提供的 ../主視覺小錢02.png；保留原圖。
檔案 xiaoqian-back-poses.png，1536×1024，RGBA透明。抽查背景角落及間隔alpha=0，並於遊戲背景驗收。
工程裁切見 src/data/runnerArt.js，使用 run／left／right。第二個前進姿勢因斜背包位置不連續，暫不串成跑步循環。
基準底點：裁切框內 y=890；Sprite origin=(0.5,890/1024)，scale=0.28；父角色腳點維持y=1020。
未生成裝備專屬姿勢；原裝備先保留簡單色彩覆蓋。

## 最終生成提示詞（內建工具，非 CLI）

Use case: stylized-concept. Create a production game sprite sheet, 1536x1024, transparent alpha background. Reference image is only character appearance reference, not a background to copy. Exactly FOUR full-body sprites of the SAME Xiaoqian boy, in FOUR equal columns in ONE horizontal row, each occupying a 384x1024 cell. All characters viewed from BEHIND running away from camera, camera slightly above, head to shoes fully visible, no face looking back. Each character same scale, feet baseline y=930, top of head about y=160, centered at respective cell center; 40px empty gutters, no overlap. Appearance matches reference: short textured light brown hair, white short-sleeved school shirt, navy shorts, white calf socks, red canvas sneakers, black cross-body sling bag with silver star on the back and diagonal strap. Polished semi-realistic 3D game render, coherent lighting, readable silhouette. Frame1 forward running left foot forward, frame2 forward running right foot forward, frame3 quick sidestep to screen LEFT, bent knees lowered hips slight torso twist, one arm outward for balance, frame4 quick sidestep to screen RIGHT, bent knees low center gravity and balanced arm. Sidesteps inspired by a nimble lateral folk dance shuffle, not a tumbling roll. Keep all poses centered in their cells with feet baseline identical. No text, labels, grids, ground, shadows, coins, UI, logos or scenery. True transparent background.

產出未精準遵守等寬欄位，所以採人工明確裁切，未修改原始PNG。
動作背景查閱：https://www.cool-style.com.tw/wd2/archives/1346724
本實作是遊戲側閃演繹，未使用該影片或音軌，非精確舞蹈動作還原。

## 技能動作圖檔（2026-11-03）

- xiaoqian-langzi-kick.png：浪子踢球四幀，蓄力→抬膝→踢擊→收勢。遊戲演繹參考民間舞步，非逐格還原教學影片。
- xiaoqian-bear-shiver.png：狗熊哆嗦毛四幀，抬肩→左側抖動→下沉→右側抖動。
- 兩張實際為887×1774 RGBA PNG，2×2排列；透明角落／分格與灰底合成檢查通過。未覆寫現有背影圖。
- 精確裁切、腳點參考、建議時序見 skill-actions.json。因寬度為奇數，左右欄分別443、444px，不使用整除假設。
- 踢擊圖原生斜背包在畫面右側，接入時每幀 flipX=true，使斜背包回到目前跑姿的畫面左側；圖集順序不反轉。腳點為建議基準，正式接入時需與跑姿實際尺寸對齊。
- 攻擊建議第3幀入幀觸發一次；擊飛速度、距離、冷卻及操作入口尚未設定。圖檔未包含可互動障礙物。
- 無敵建議每幀125ms、四幀循環6次（3000ms）；無敵期限由遊戲計時器判定，不以動畫播完事件延長。護盾／輪廓光由程式另畫，圖檔不烘焙特效。
- 此次只交付圖檔與動畫契約，尚未接入攻擊、擊飛或3秒無敵程式；原本受傷1秒無敵規則不變。
- 生成方式與最終完整提示詞：SKILL_ACTION_PROMPTS.md。
- 動作研究參考：https://news.tvbs.com.tw/life/4030565 、https://news.tvbs.com.tw/life/4034352 。未使用網路影片素材或音軌。

更新（2026-11-03）：上述兩組動作已接入遊戲。攻擊220ms入幀、500ms結束；無敵3000ms。技能按鈕與J/K快捷鍵可用，執行規格見GAME_DESIGN.md；前述「尚未接入」為素材交付當時紀錄。
