import { SKILLS } from '../data/skills.js';

// One activation path for pointer and keyboard. Durations use gameplay time.
export default class SkillManager {
  constructor(scene) {
    this.scene = scene;
    this.active = null;
    this.lastHit = false;
    this.destroyed = false;
  }

  activate(kind) {
    if (this.destroyed || this.scene.ended || !this.scene.sys.isActive() || this.active || !SKILLS[kind]) return false;
    this.active = { kind, elapsed: 0, impacted: false };
    this.lastHit = false;
    return true;
  }

  get invincible() { return this.active?.kind === 'guard'; }

  update(delta) {
    if (!this.active) return;
    const state = this.active;
    state.elapsed += delta;
    if (state.kind === 'attack' && !state.impacted && state.elapsed >= SKILLS.attack.impactMs) {
      state.impacted = true;
      this.lastHit = this.scene.obstacleManager.kickNearest(SKILLS.attack.rangeMetres);
    }
    if (state.elapsed >= SKILLS[state.kind].durationMs) this.active = null;
  }

  destroy() { this.destroyed = true; this.active = null; this.scene = null; }
}
