import Phaser from 'phaser';
import { artBackground, artHotspot } from '../ui/artUi.js';

export default class MenuScene extends Phaser.Scene {
  constructor() { super('MenuScene'); }
  create() {
    artBackground(this, 'menu-art');
    artHotspot(this, 'open-character', 72, 1310, 394, 121, () => this.scene.start('CharacterScene'));
    artHotspot(this, 'open-shop', 485, 1310, 396, 121, () => this.scene.start('ShopScene'));
    artHotspot(this, 'start-game', 205, 1450, 538, 168, () => this.scene.start('GameScene'));
  }
}
