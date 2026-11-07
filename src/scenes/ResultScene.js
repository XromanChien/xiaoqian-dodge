import { neonButton } from '../ui/neonButton.js';
import Phaser from 'phaser';
import { calculateScore } from '../storage/coinStorage.js';

export default class ResultScene extends Phaser.Scene {
  constructor() {
    super('ResultScene');
  }

  create({ distance = 0, reason = 'completed', stage, lap = 1, health = 3,
    coinsEarned = 0, totalCoins = 0, coinsSaved = true,
    runId = crypto.randomUUID(), leaderboardName = '', leaderboardSubmitted = false,
    score = calculateScore(distance, coinsEarned) } = {}) {
    const completed = reason === 'completed';
    this.result = { distance, reason, stage, lap, health, coinsEarned, totalCoins, score, coinsSaved, runId, leaderboardName, leaderboardSubmitted };
    const fontFamily = 'system-ui, "Microsoft JhengHei", sans-serif';
    this.cameras.main.setBackgroundColor('#172132');
    this.add.text(360, 270, completed ? '全程完成！' : '遊戲結束', {
      fontFamily, fontSize: '64px', color: '#ffd166',
    }).setOrigin(0.5);
    this.add.text(360, 490, [
      '距離 ' + Math.floor(distance) + ' m',
      '第 ' + lap + ' 輪 · ' + (stage?.name ?? '未開始'),
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
    neonButton(this,{name:'leaderboard',x:360,y:850,width:420,height:110,label:'排行榜',fontSize:36,tone:'blue',
      action:()=>this.scene.start('LeaderboardScene',{result:this.result})});
    neonButton(this,{name:'back-menu',x:360,y:990,width:420,height:110,label:'回到選單',fontSize:36,
      action:()=>this.scene.start('MenuScene')});
  }
}
