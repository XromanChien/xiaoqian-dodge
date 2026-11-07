import { KAKA_ART, registerKakaFrames } from '../data/kakaArt.js';
import { SKILL_ART } from '../data/skills.js';
import { RUNNER_ART, RUNNER_FRAMES, RUN_CYCLE } from '../data/runnerArt.js';
import { DODGE_VOICE_KEY, DODGE_VOICE_URL } from '../audio/DodgeVoice.js';
import Phaser from 'phaser';
import { STAGE_ART } from '../data/stageArt.js';
import { SCREEN_ART } from '../data/screenArt.js';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    this.load.image(KAKA_ART.key, KAKA_ART.url);
    this.load.image(RUNNER_ART.key, RUNNER_ART.url);
    this.load.image(RUN_CYCLE.key, RUN_CYCLE.url);
    for (const art of Object.values(SKILL_ART)) this.load.image(art.key, art.url);
    if (DODGE_VOICE_URL) this.load.audio(DODGE_VOICE_KEY, DODGE_VOICE_URL);
    const label = this.add.text(360, 610, '場景載入中 0%', {
      fontFamily: 'system-ui, "Microsoft JhengHei", sans-serif', fontSize: '28px', color: '#ffffff'
    }).setOrigin(0.5);
    this.load.on('progress', value => label.setText('場景載入中 ' + Math.round(value * 100) + '%'));
    for (const { key, url } of Object.values(STAGE_ART)) this.load.image(key, url);
    for (const [key, url] of Object.entries(SCREEN_ART)) this.load.image(key, url);
  }

  create() {
    const buttons = this.textures.get('neon-buttons');
    const source = buttons.getSourceImage();
    buttons.add('gold',0,0,0,source.width,Math.floor(source.height/2));
    buttons.add('blue',0,0,Math.floor(source.height/2),source.width,Math.ceil(source.height/2));
    registerKakaFrames(this.textures.get(KAKA_ART.key));
    const texture = this.textures.get(RUNNER_ART.key);
    for (const [name, bounds] of Object.entries(RUNNER_FRAMES)) {
      if (!texture.has(name)) texture.add(name, 0, ...bounds);
    }
    const runTexture = this.textures.get(RUN_CYCLE.key);
    RUN_CYCLE.frames.forEach((rect, i) => { if (!runTexture.has(String(i))) runTexture.add(String(i), 0, ...rect); });
    for (const art of Object.values(SKILL_ART)) {
      const texture = this.textures.get(art.key);
      art.frames.forEach((frame, i) => { if (!texture.has(String(i))) texture.add(String(i), 0, ...frame.rect); });
    }
    this.scene.start('MenuScene');
  }
}
