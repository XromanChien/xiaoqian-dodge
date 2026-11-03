import Phaser from 'phaser';
import './style.css';
import BootScene from './scenes/BootScene.js';
import MenuScene from './scenes/MenuScene.js';
import CharacterScene from './scenes/CharacterScene.js';
import ShopScene from './scenes/ShopScene.js';
import GameScene from './scenes/GameScene.js';
import ResultScene from './scenes/ResultScene.js';
import LeaderboardScene from './scenes/LeaderboardScene.js';

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  dom: { createContainer: true },
  backgroundColor: '#172132',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 720,
    height: 1280,
  },
  scene: [BootScene, MenuScene, CharacterScene, ShopScene, GameScene, ResultScene, LeaderboardScene],
});

// 避免開發期間模組熱更新留下重複的 canvas。
if (import.meta.hot) {
  import.meta.hot.dispose(() => game.destroy(true));
}
