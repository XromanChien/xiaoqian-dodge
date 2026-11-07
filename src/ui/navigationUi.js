import { neonButton } from './neonButton.js';

// Shared primary action dimensions for Menu → Character → Shop.
export function primaryButton(scene, { name, y, label, action }) {
  return neonButton(scene, { name, x: 360, y, width: 480, height: 112,
    fontSize: 36, label, action });
}
