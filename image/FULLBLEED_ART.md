# Full-bleed backgrounds — 2026-11-08

Built-in imagegen used for precise removal, originals retained.

Files: menu-fullbleed.png; characters/xiaoqian-selection-fullbleed.png; characters/kaka-selection-fullbleed.png. All are opaque 941×1672 PNG, full 9:16 page art rendered at720×1280. Existing original-relative UI crop coordinates remain valid. Only bottom baked-in buttons and associated decorations are removed; interactive buttons remain code-owned.

Prompt (same for each source):
Precise local removal for production game background. Preserve the entire original portrait 9:16 composition, all characters and faces, anatomy, logos, upper UI, panels, all text, lighting and framing exactly. ONLY remove the bottom large golden oval/capsule button and its text, ALL its cyan glow, surrounding decorative arrows, horizontal neon streaks and small skyline silhouette belonging to that bottom button. Seamlessly reconstruct the underlying street pavement/motion perspective down to the bottom edge, matching the existing road. Full bleed background to every edge, no new buttons, no footer, no dark panel, no border, no cropping, no zooming or repositioning any existing character. Keep all content above bottom button unchanged. Deliver one edited image matching input aspect ratio.

QA: inspected generated images and integrated 360×640 screenshots for menu, Xiaoqian and Kaka. Street fills the bottom edge with no old-button glow or footer rectangle. Character faces, limb direction and silhouette visually checked. Build and isolated browser navigation pass, no pageerror.
