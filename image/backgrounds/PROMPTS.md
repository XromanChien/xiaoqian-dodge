# 純場景背景生成紀錄

工具：內建 image_gen（逐張編輯）。原始 image/*.png 保留不覆寫。
輸出：01-clean.png 至 12-clean.png，依關卡順序對應。
這些圖片為地標美術示意，不是實際地理測繪；背景上的道路標線不參與碰撞。

## 第 1 關提示詞
Edit target: supplied 金龍路 game screenshot. Produce a clean portrait 9:16 game environment background. Remove ALL UI panels, numbers, minimap, buttons, main runner, all other people, floating coins, cones, boxes, barriers, vehicles and other gameplay obstacles. Inpaint naturally. Preserve sunny Taipei architecture, Taipei 101, trees and Jinlong tunnel entrance/signs and original rich polished visual style. Road must be empty and unobstructed, centered one-point perspective vanishing point at x50% y40%, with broad clear road foreground for three-lane runner. No HUD, no characters, no collectible objects. Full bleed background only. Save generated image.

## 第 2–12 關提示詞（name 為各關原始圖片名稱）
Use case: precise-object-edit. Edit target: supplied {name} game scene. Output a clean 9:16 portrait game environment background. Remove ALL UI panels, numbers, minimap, buttons, runner, all people, floating coins, traffic cones, boxes, construction barriers, vehicles on the path and gameplay obstacles. Reconstruct hidden environment naturally. Preserve this image's recognizable landmark buildings, scenery, lighting/time of day and polished rich photographic style. Keep trains on adjacent rails if present. Broad empty unobstructed foreground path suitable for three-lane running. Centered one-point perspective with vanishing point x50% y40%. No HUD, characters, collectibles, text overlays. Architectural signs may remain. Background only, full bleed.

name: 02金龍隧道、03美麗華、04大直橋、05圓山飯店、06士林夜市、07淡水捷運線、08洲美快速道路、09淡水輕軌、10漁人碼頭、11淡江大橋、12八里老街
