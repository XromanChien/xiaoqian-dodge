import { SKILL_ART } from '../data/skills.js';
import { ITEM_BY_ID } from '../data/shopItems.js';
import { loadProfile } from '../storage/profileStorage.js';
import { RUNNER_ART } from '../data/runnerArt.js';

// Presentation only. The parent container and its collision footpoint stay unchanged.
export function createCharacterAppearance(scene, profile = loadProfile()) {
  const rig = scene.add.container(0, 60);
  const sprite = scene.add.sprite(0, 0, RUNNER_ART.key, 'run').setOrigin(0.5, 890 / 1024).setScale(0.28);
  rig.add(sprite);
  const equipment = scene.add.graphics();
  rig.add(equipment);
  const drawEquipment = pose => {
    equipment.clear();
    const crouch = pose !== 'run';
    const head = ITEM_BY_ID[profile.equipped.head];
    const outfit = ITEM_BY_ID[profile.equipped.outfit];
    const shoes = ITEM_BY_ID[profile.equipped.shoes];
    const accessory = ITEM_BY_ID[profile.equipped.accessory];
    const top = crouch ? -172 : -204;
    // Existing equipment is kept as simple cosmetic overlays until per-outfit sprites exist.
    if (head) {
      equipment.fillStyle(head.color).fillRoundedRect(-20, top, 40, 18, 8);
      equipment.fillRect(-24, top + 12, 48, 5);
    }
    if (outfit) equipment.fillStyle(outfit.color, 0.72).fillRoundedRect(-25, top + 45, 50, 14, 5);
    if (shoes) {
      equipment.fillStyle(shoes.color, 0.9).fillRoundedRect(-18, -9, 23, 9, 3);
      equipment.fillRoundedRect(18, -25, 23, 9, 3);
    }
    if (accessory) equipment.fillStyle(accessory.color).fillCircle(-12, top + 112, 7);
  };
  let currentPose = null;
  rig.setPose = name => {
    if (name === currentPose) return;
    currentPose = name;
    sprite.setTexture(RUNNER_ART.key, name).setFlipX(false).setOrigin(0.5, 890 / 1024).setScale(0.28);
    drawEquipment(name);
  };
  rig.setSkillPose = (kind, index) => {
    const pose = kind + ':' + index;
    if (currentPose === pose) return;
    currentPose = pose;
    const art = SKILL_ART[kind], frame = art.frames[index];
    sprite.setTexture(art.key, String(index)).setFlipX(art.flipX)
      .setOrigin(frame.pivot[0] / frame.rect[2], frame.pivot[1] / frame.rect[3]).setScale(kind === 'guard' ? 0.30 : 0.32);
    drawEquipment('run');
  };
  rig.setPose('run');
  return rig;
}
