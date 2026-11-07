import { neonButton } from './neonButton.js';

// Shared primary action dimensions for Menu → Character → Shop.
export function primaryButton(scene, { name, y, label, action }) {
  return neonButton(scene, { name, x: 360, y, width: 480, height: 112,
    fontSize: 36, label, action });
}

// Full-width navigation area replaces the baked-in buttons, including their glow.
export function navigationFooter(scene) {
  const g = scene.add.graphics();
  g.fillGradientStyle(0x10294b, 0x10294b, 0x061326, 0x061326, 1);
  g.fillRect(0, 1080, 720, 200);
  g.lineStyle(2, 0x5bd9ff, .65).lineBetween(0, 1080, 720, 1080);
}
