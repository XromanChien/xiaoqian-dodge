import Phaser from 'phaser';
import { STAGE_ART } from '../data/stageArt.js';
import { SCREEN_ART } from '../data/screenArt.js';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    const label = this.add.text(360, 610, '場景載入中 0%', {
      fontFamily: 'system-ui, "Microsoft JhengHei", sans-serif', fontSize: '28px', color: '#ffffff'
    }).setOrigin(0.5);
    this.load.on('progress', value => label.setText('場景載入中 ' + Math.round(value * 100) + '%'));
    for (const { key, url } of Object.values(STAGE_ART)) this.load.image(key, url);
    for (const [key, url] of Object.entries(SCREEN_ART)) this.load.image(key, url);
  }

  create() {
    this.scene.start('MenuScene');
  }
}
