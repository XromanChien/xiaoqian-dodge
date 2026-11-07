import Phaser from 'phaser';
import { artBackground } from '../ui/artUi.js';
import { neonButton } from '../ui/neonButton.js';
import { navigationFooter, primaryButton } from '../ui/navigationUi.js';

export default class MenuScene extends Phaser.Scene {
  constructor() { super('MenuScene'); }
  create() {
    artBackground(this, 'menu-art');
    navigationFooter(this);
    primaryButton(this, {name:'open-character', y:1141, label:'角色選擇 ▶',
      action:()=>this.scene.start('CharacterScene')});
    neonButton(this, {name:'open-leaderboard', x:360, y:1230, width:360, height:76,
      label:'排行榜', fontSize:28, tone:'blue', action:()=>this.scene.start('LeaderboardScene')});
  }
}
