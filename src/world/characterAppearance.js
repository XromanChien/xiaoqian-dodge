import { SKILL_ART } from '../data/skills.js';
import EquipmentRenderer from './EquipmentRenderer.js';
import { loadProfile } from '../storage/profileStorage.js';
import { RUNNER_ART, RUN_CYCLE } from '../data/runnerArt.js';

// Presentation only. The parent container and its collision footpoint stay unchanged.
export function createCharacterAppearance(scene, profile = loadProfile()) {
  const rig = scene.add.container(0, 60);
  const sprite = scene.add.sprite(0, 0, RUNNER_ART.key, 'run').setOrigin(0.5, 890 / 1024).setScale(0.28);
  rig.add(sprite);
  const equipment = new EquipmentRenderer(scene, rig, sprite, profile);
  let currentPose = null;
  rig.setPose = name => {
    if (name === currentPose) return;
    currentPose = name;
    sprite.setTexture(RUNNER_ART.key, name).setFlipX(false).setOrigin(0.5, 890 / 1024).setScale(0.28);
    equipment.draw(name);
  };
  rig.setRunFrame = index => {
    const pose = 'run:' + index;
    if (currentPose === pose) return;
    currentPose = pose;
    sprite.setTexture(RUN_CYCLE.key, String(index)).setFlipX(RUN_CYCLE.flipX)
      .setOrigin(...RUN_CYCLE.origin).setScale(RUN_CYCLE.scale);
    equipment.draw(pose);
  };
  rig.setSkillPose = (kind, index) => {
    const pose = kind + ':' + index;
    if (currentPose === pose) return;
    currentPose = pose;
    const art = SKILL_ART[kind], frame = art.frames[index];
    sprite.setTexture(art.key, String(index)).setFlipX(art.flipX)
      .setOrigin(frame.pivot[0] / frame.rect[2], frame.pivot[1] / frame.rect[3]).setScale(kind === 'guard' ? 0.30 : 0.32);
    equipment.draw(pose);
  };
  rig.setPose('run');
  return rig;
}
