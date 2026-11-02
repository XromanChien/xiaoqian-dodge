import { SKILL_ART, SKILLS } from '../data/skills.js';
import DodgeVoice from '../audio/DodgeVoice.js';

// Responds to successful lane changes; never changes lane position or collision size.
export default class RunnerAnimator {
  constructor(scene, appearance) {
    this.scene = scene;
    this.appearance = appearance;
    this.elapsed = 1000;
    this.stride = 0;
    this.direction = 0;
    this.voice = new DodgeVoice(scene);
    this.onDodge = direction => {
      if (scene.skills?.active) return;
      this.direction = direction;
      this.elapsed = 0;
      appearance.setPose(direction < 0 ? 'left' : 'right');
      this.voice.play();
    };
    scene.events.on('runner-dodge', this.onDodge);
  }

  update(delta, speedMultiplier = 1) {
    const skill = this.scene.skills?.active;
    if (skill) {
      let index = 0;
      if (skill.kind === 'guard') index = Math.floor(skill.elapsed / SKILLS.guard.frameMs) % 4;
      else {
        let boundary = 0;
        for (const [i, frame] of SKILL_ART.attack.frames.entries()) {
          boundary += frame.durationMs; index = i; if (skill.elapsed < boundary) break;
        }
      }
      this.elapsed = 1000;
      this.appearance.setSkillPose(skill.kind, index);
      this.appearance.y = 60;
      this.appearance.setScale(1);
      this.appearance.angle = skill.kind === 'guard' ? Math.sin(skill.elapsed / 32) * 1.4 : 0;
      return;
    }
    this.stride += delta * speedMultiplier / 145;
    this.elapsed += delta;
    if (this.elapsed < 280) {
      const t = this.elapsed / 280;
      const push = Math.sin(Math.PI * t);
      this.appearance.y = 60 + 3 * push;
      this.appearance.angle = this.direction * 6 * push;
      this.appearance.scaleX = 1 - 0.07 * push;
      this.appearance.scaleY = 1 - 0.035 * push;
      if (this.elapsed > 210) this.appearance.setPose('run');
    } else {
      this.appearance.setPose('run');
      this.appearance.y = 60 - Math.abs(Math.sin(this.stride)) * 4;
      this.appearance.angle = Math.sin(this.stride) * 1.2;
      this.appearance.setScale(1);
    }
  }

  destroy() {
    this.scene.events.off('runner-dodge', this.onDodge);
    this.voice.destroy();
  }
}
