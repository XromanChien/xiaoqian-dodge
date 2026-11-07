# 咔咔素材契約

使用內建 imagegen 生成，參考使用者提供的人像照片（僅作生成參考，未複製原照片到專案），及既有 xiaoqian-run-cycle.png 的美術風格。

- PNG 透明圖集，尺寸 1254×1254，1304601 bytes。
- 3×3 等分，依實際尺寸四捨五入取得邊界；左到右、上到下0～8：正面、跑步1～4、左閃、右閃、踢擊、護盾。
- 遊戲圖幀高度230邏輯像素，原點(0.5,0.94)，沿用角色腳點；不影響碰撞。
- 跑步沿用110ms幀序；技能先使用預備／動作姿勢切換與既有變形表演，不是完整技能逐格圖集。
- 咔咔先使用專屬水手服；不使用小錢專屬裝備定位，舊裝備保存不變。

## 生成提示詞
Create a production game character sprite atlas for 咔咔, same polished semi-realistic colorful 3D game illustration style as Xiaoqian reference. Face likeness from user reference, smiling East Asian girl with straight bangs. Exactly two black braided pigtails reaching mid-thigh. White student sailor blouse, navy collar, red neckerchief, navy pleated short skirt, opaque fitted safety shorts covered by skirt, white socks and red sneakers. Wholesome athletic runner. Transparent background, no shadows, text or grid. Exactly 3 columns by 3 rows, equal cells, full body centered, generous margins, grounded foot at 94% cell height. Row1 front portrait / rear running left planted / passing pose. Row2 rear running right planted / opposite passing / rear left dodge. Row3 rear right dodge / rear three-quarter forward kick with skirt staying down / rear arms-out protective shiver. Consistent costume, two long braids, proportions. Camera at upper-body height, never low angle.

## v2 臉部與身形修訂（2026-11-07）

目前載入 kaka-poses-v2.png，保留原版。內建imagegen以原九格圖集為編輯目標，使用者照片為臉部身分參考，要求眼型、眼距、鼻形、笑容與臉頰貼近照片，肩膀、軀幹、手腳適度纖細，維持自然比例、水手服、雙長辮與所有姿勢位置。第二次編輯僅移除背景與陰影，保留臉部和纖細身形。等分九格與原點契約沿用，沒有改變角色能力或碰撞。

## v3 兩張新照片修訂（2026-11-07）

現用kaka-poses-v3.png，保留v1/v2。內建imagegen以v2為編輯目標，兩張新照片為同一人物的臉部參考，忽略愛心與腮紅貼紙；臉部更自然、身形再適度纖細。九格順序、服裝與遊戲定位不變。

### 完整提示詞
Edit the first image, Kaka game sprite atlas. Images 2 and 3 are the SAME person's facial identity references and must guide the face, especially the unfiltered third photo. Replace the generic doll-like face with a recognizable semi-realistic rendering of her natural facial proportions: oval/rounded cheeks and softly tapered chin, her almond-shaped dark eyes (not oversized cartoon eyes), her eye spacing, nose bridge and rounded nose tip, naturally broad warm tooth-showing smile and lip shape, straight black bangs. Ignore pink hearts and cheek stickers in photo2, do not add them. Keep identity consistent in front and side views. Further slim the build modestly across all 9 poses: narrower shoulders and torso, more slender arms and legs, natural healthy athletic proportions, not extreme thinness. Keep same age appearance and same head/body height. Preserve sailor blouse, navy pleated skirt with covered opaque safety shorts, thigh-length TWO braided pigtails, white socks/red sneakers. Keep all nine poses EXACTLY in existing row-major order and equal 3x3 cells, same scale, camera, foot locations. No sexualized styling. Keep genuine full transparency in empty areas (alpha=0), no white/gray backdrop, no shadows or glow. Full bodies contained in their respective cells. Only likeness and build adjustment. Same semi-realistic Xiaoqian game art style.

## v4 新臉部方向（2026-11-07）

使用者不滿前版臉部，指定最新Q版參考圖為準。內建imagegen調整正面及側面臉部為大圓眼、圓臉、小鼻、閉嘴嘟唇與齊瀏海；保留纖細身形、水手服、雙辮、九格幀序。現用kaka-poses-v4.png，前版保留。

### 完整提示詞
Edit image1 nine-pose transparent Kaka sprite atlas. Image2 is the NEW sole face reference, replacing previous realistic face direction. Change the visible front face (cell0) and side face (cell7) to closely match image2's cute stylized 3D doll facial design: very large round glossy dark eyes, rounded full cheeks, tiny button nose, small pink closed puckered lips, straight neat bangs, soft porcelain-like skin. NO teeth or wide smile, NO realistic adult-looking face. Match reference's expression and eye-to-face proportions faithfully. Ignore image2 play triangle overlay, clothing, background, watch and crossed-arm pose. Keep image1's slender body proportions, sailor uniform, modest skirt, covered safety shorts, TWO thigh-length braids, white socks/red shoes, same full-body height. Do not shorten the body into chibi proportions. Preserve exactly all nine poses, equal 3x3 grid, camera, foot placement, individual cell boundaries and frame sequence. Rear views remain rear views. All empty area fully transparent alpha=0, no backdrop/shadow/glow/text. Keep all prior costume details. Only replace facial styling and subtle matching head rendering.
