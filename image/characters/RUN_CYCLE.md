# 小錢跑步圖集

使用內建 imagegen 生成及修正，來源為 xiaoqian-back-poses.png，原檔保留。

## 初次提示詞

Use case: identity-preserve. Asset: game running sprite sheet. Use reference first rear-view character as exact identity/outfit reference. Create FOUR distinct consecutive running-cycle poses in a strict 2 by 2 equal cell grid, reading top-left, top-right, bottom-left, bottom-right, transparent background. All four are same boy viewed directly from behind running AWAY from camera, white short sleeve school shirt, navy shorts, white socks, red sneakers, brown short spiky hair, black sling bag with star ALWAYS on viewer LEFT hip and strap from right shoulder. Same camera, body size, head position and ground baseline per cell; full body including shoes with padding, no clipping, no text, no shadows/background/glow. Frame1 left foot reaching back toward viewer, right leg forward, opposing arms; frame2 left push-off with right knee passing, bent knees; frame3 right foot reaching back toward viewer, left leg forward, opposing arms; frame4 right push-off left knee passing. Clearly different leg silhouettes across four frames. Realistic polished game character matching reference. Straight forward run, no side dodge, no kick. Equal 512x768 cells on 1024x1536 sheet if possible. Feet bottom baseline at 92% of cell height, head at 10%. Actual alpha transparency.

## 修正提示詞

Correct this four frame running animation sheet. Keep four distinct running poses and same character/scale/layout. CRITICAL: in EVERY frame the black star sling bag must sit on the VIEWER LEFT HIP, strap from VIEWER RIGHT shoulder diagonally down left. Currently only top-left is correct; change bag and strap location on the other THREE frames only, without mirroring the bodies or legs. Remove all background including grey, glow, white, shadows; real alpha transparency around characters. Full body, no text. Maintain equal 2x2 grid.

## 接入契約

xiaoqian-run-cycle.png：1024×1536 RGBA、2×2，各幀512×768，左上→右上→左下→右下，每幀110ms，440ms循環。原圖包在畫面右側，工程整組flipX維持既有角色包在畫面左側。origin=(0.5,752/768)，scale=0.295。透明角落與格線alpha=0。減速按speedMultiplier調整步頻；技能優先，其次換道，最後跑步。僅動畫，不修改移動／碰撞。

