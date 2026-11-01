import Phaser from 'phaser';
import { loadProfile } from '../storage/profileStorage.js';
import { artBackground, artHotspot, artLabel, artPanel } from '../ui/artUi.js';

export default class CharacterScene extends Phaser.Scene {
  constructor() { super('CharacterScene'); }
  create() {
    this.profile = loadProfile();
    artBackground(this, 'character-art');
    artHotspot(this, 'back-menu', 14, 40, 198, 90, () => this.scene.start('MenuScene'));
    artHotspot(this, 'select-xiaoqian', 215, 1424, 530, 164, () => this.scene.start('MenuScene'));
    artHotspot(this, 'xiaoqian-card', 30, 335, 184, 220, () => this.status.setText('已選擇小錢'));
    // 其他角色僅為鎖定展示，不設可選操作。
    artPanel(this, 725, 40, 192, 64);
    artLabel(this, 821, 72, '外觀商店', 23);
    artHotspot(this, 'open-shop', 725, 40, 192, 64, () => this.scene.start('ShopScene'));
    artPanel(this, 555, 1375, 363, 40, 0x071a36, 0.94);
    artLabel(this, 736, 1395, 'V0.1 · 裝備僅影響外觀', 17, '#bdefff');
    this.status = artLabel(this, 470, 1633, '小錢已選用 · 其他角色敬請期待', 20);
  }
}
