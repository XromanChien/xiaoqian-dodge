import Phaser from 'phaser';
import { artBackground, artHotspot } from '../ui/artUi.js';

export default class MenuScene extends Phaser.Scene {
  constructor() { super('MenuScene'); }
  create() {
    artBackground(this, 'menu-art');
    artHotspot(this, 'open-character', 205, 1450, 538, 168, () => this.scene.start('CharacterScene'));
  }
}
