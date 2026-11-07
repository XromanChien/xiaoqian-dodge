import EquipmentRenderer from './EquipmentRenderer.js';
import { KAKA_EQUIPMENT_ANCHORS } from '../data/kakaEquipmentAnchors.js';
import { KAKA_ART } from '../data/kakaArt.js';
// Same footpoint, parent movement and collision as Xiaoqian.
export function createKakaAppearance(scene, profile) {
  const rig = scene.add.container(0, 60);
  const sprite = scene.add.sprite(0, 0, KAKA_ART.key, '1').setOrigin(0.5, 0.94);
  sprite.setScale(230 / sprite.height);
  rig.add(sprite);
  const equipment = new EquipmentRenderer(scene, rig, sprite, profile, KAKA_EQUIPMENT_ANCHORS);
  const set = frame => { sprite.setFrame(String(frame)); equipment.draw(String(frame)); };
  set(1);
  rig.setPose = name => set(name === 'left' ? 5 : name === 'right' ? 6 : 1);
  rig.setRunFrame = index => set(1 + index % 4);
  // Preparation / impact / recovery use her own poses, never Xiaoqian's art.
  rig.setSkillPose = (kind, index) => set(kind === 'guard' ? (index % 2 ? 8 : 1) : (index === 1 || index === 2 ? 7 : 1));
  return rig;
}
