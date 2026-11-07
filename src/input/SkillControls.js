import { SKILLS } from '../data/skills.js';

export default class SkillControls {
  constructor(scene, skills) {
    this.scene = scene;
    this.skills = skills;
    this.buttons = [];
    this.keys = [];
    for (const [kind, x, label, subtitle, color, key] of [
      ['attack', 288, '攻擊', 'J · 浪子踢球', 0xffc14d, 'J'],
      ['guard', 432, '無敵', 'K · 3秒護盾', 0x5ce1ff, 'K'],
    ]) {
      const plate = scene.add.image(x, 1174, 'neon-buttons', kind === 'attack' ? 'gold' : 'blue').setDisplaySize(132, 100).setDepth(20002).setInteractive({ useHandCursor: true });
      const title = scene.add.text(x, 1159, label, { fontFamily: 'system-ui, Microsoft JhengHei',
        fontSize: '30px', fontStyle: 'bold', color: '#ffffff', stroke: '#172132', strokeThickness: 4 }).setOrigin(0.5).setDepth(20003);
      const hint = scene.add.text(x, 1188, subtitle, { fontFamily: 'system-ui, Microsoft JhengHei',
        fontSize: '16px', color: '#ecf5ff' }).setOrigin(0.5).setDepth(20003);
      const meter = scene.add.rectangle(x - 49, 1221, 98, 5, color).setOrigin(0, 0.5).setDepth(20003);
      plate.on('pointerdown', () => skills.activate(kind));
      const handler = event => { if (!event.repeat) skills.activate(kind); };
      scene.input.keyboard?.on('keydown-' + key, handler);
      this.keys.push([key, handler]);
      this.buttons.push({ kind, plate, title, hint, meter, subtitle, label });
    }
    this.aura = scene.add.ellipse(0, 0, 158, 222, 0x46ccff, 0.1)
      .setStrokeStyle(4, 0x83f2ff, 0.9).setDepth(1030).setVisible(false);
  }

  update() {
    const active = this.skills.active;
    for (const button of this.buttons) {
      const selected = active?.kind === button.kind;
      const remaining = selected ? Math.max(0, SKILLS[active.kind].durationMs - active.elapsed) : 0;
      button.plate.setAlpha(active && !selected ? 0.45 : 1);
      button.title.setAlpha(active && !selected ? 0.5 : 1);
      button.hint.setText(selected ? (remaining / 1000).toFixed(1) + ' 秒' : active ? '稍候' : button.subtitle);
      button.meter.setScale(selected ? remaining / SKILLS[active.kind].durationMs : active ? 0 : 1, 1);
    }
    this.aura.setVisible(this.skills.invincible).setPosition(this.scene.character.x, this.scene.character.y - 40);
    if (this.skills.invincible) this.aura.setAlpha(0.7 + 0.2 * Math.sin(active.elapsed / 85));
  }

  destroy() {
    for (const [key, handler] of this.keys) this.scene.input.keyboard?.off('keydown-' + key, handler);
    for (const { plate, title, hint, meter } of this.buttons) { plate.destroy(); title.destroy(); hint.destroy(); meter.destroy(); }
    this.aura.destroy();
  }
}

