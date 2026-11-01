import Phaser from 'phaser';
import { calculateScore } from '../storage/coinStorage.js';

export default class ResultScene extends Phaser.Scene {
  constructor() {
    super('ResultScene');
  }

  create({ distance = 0, reason = 'completed', stage, health = 3,
    coinsEarned = 0, totalCoins = 0, coinsSaved = true,
    score = calculateScore(distance, coinsEarned) } = {}) {
    const completed = reason === 'completed';
    this.result = { distance, reason, stage, health, coinsEarned, totalCoins, score, coinsSaved };
    const fontFamily = 'system-ui, "Microsoft JhengHei", sans-serif';
    this.cameras.main.setBackgroundColor('#172132');
    this.add.text(360, 270, completed ? '全程完成！' : '遊戲結束', {
      fontFamily, fontSize: '64px', color: '#ffd166',
    }).setOrigin(0.5);
    this.add.text(360, 490, [
      '距離 ' + Math.floor(distance) + ' m',
      '抵達場景 ' + (stage?.name ?? '未開始'),
      '本局金幣 ' + coinsEarned,
      '累積金幣 ' + totalCoins,
      '總分 ' + score,
    ].join('\n'), {
      fontFamily, fontSize: '32px', color: '#ffffff', align: 'center', lineSpacing: 20,
    }).setOrigin(0.5);
    this.add.text(360, 690, '總分＝距離取整數＋本局金幣 × 10', {
      fontFamily, fontSize: '22px', color: '#a8c4d5',
    }).setOrigin(0.5);
    this.add.text(360, 735, coinsSaved ? '累積金幣已儲存在此瀏覽器' : '無法儲存金幣，請確認瀏覽器儲存設定', {
      fontFamily, fontSize: '21px', color: coinsSaved ? '#a8c4d5' : '#ffb080',
    }).setOrigin(0.5);
    const button = this.add.rectangle(360, 850, 360, 112, 0xffd166)
      .setInteractive({ useHandCursor: true });
    this.add.text(360, 850, '回到選單', {
      fontFamily, fontSize: '36px', color: '#172132',
    }).setOrigin(0.5);
    button.on('pointerdown', () => this.scene.start('MenuScene'));
  }
}
