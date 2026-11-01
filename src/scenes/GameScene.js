import Phaser from 'phaser';
import LaneMovementController from '../controllers/LaneMovementController.js';
import PerspectiveRoad from '../world/PerspectiveRoad.js';
import InputManager from '../input/InputManager.js';
import StageManager from '../managers/StageManager.js';
import ObstacleManager from '../managers/ObstacleManager.js';
import CoinManager from '../managers/CoinManager.js';
import { createCharacterAppearance } from '../world/characterAppearance.js';
import { bankCoins, calculateScore } from '../storage/coinStorage.js';
import { BACKGROUNDS } from '../data/backgrounds.js';
import StageBackdrop from '../world/StageBackdrop.js';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  create() {
    this.health = 3;
    this.coinsEarned = 0;
    this.invulnerableMs = 0;
    this.slowdownMs = 0;
    this.ended = false;
    const { width, height } = this.scale;
    const fontFamily = 'system-ui, "Microsoft JhengHei", sans-serif';
    this.backdrop = new StageBackdrop(this);
    this.road = new PerspectiveRoad(this, width, height);

    this.add.rectangle(width / 2, 140, width, 280, 0x101722, 0.82).setDepth(9999);
    const controlHint = this.add.text(width / 2, 158, '←  左右方向鍵換道  →', {
      fontFamily, fontSize: '30px', color: '#ffffff',
    }).setOrigin(0.5).setDepth(10000);
    this.healthLabel = this.add.text(width / 2, 201, '生命 3 / 3', {
      fontFamily, fontSize: '21px', color: '#a8c4d5',
    }).setOrigin(0.5).setDepth(10000);

    // 角色中心維持 y=960，依腳下位置取得三條透視跑道的中心。
    const playerY = height * 0.75;
    const feetY = playerY + 60;
    const lanePositions = this.road.lanePositionsAt(feetY);
    const shadow = this.add.ellipse(0, 60, 100, 26, 0x0b1824, 0.45);
    this.appearance = createCharacterAppearance(this);
    this.character = this.add.container(lanePositions[1], playerY, [shadow, this.appearance])
      .setDepth(feetY);
    this.movement = new LaneMovementController(this, this.character, { lanePositions });
    // 只讓外觀輕微起伏，角色控制座標與跑道位置保持穩定。
    this.tweens.add({ targets: this.appearance, y: -5, duration: 150, yoyo: true, repeat: -1,
      ease: 'Sine.easeInOut' });

    this.playerInput = new InputManager(this, this.movement);
    if (this.playerInput.showTouchControls) {
      controlHint.setText('點按左下／右下按鈕換道');
    }

    this.stageLabel = this.add.text(width / 2, 48, '', {
      fontFamily, fontSize: '34px', color: '#ffd166', fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(10000);
    this.distanceLabel = this.add.text(width / 2, 99, '', {
      fontFamily, fontSize: '24px', color: '#ffffff',
    }).setOrigin(0.5).setDepth(10000);
    this.coinLabel = this.add.text(width / 2, 246, '本局金幣 0', {
      fontFamily, fontSize: '24px', color: '#ffd166',
    }).setOrigin(0.5).setDepth(10000);
    this.coinManager = new CoinManager(this, this.road, this.character, amount => {
      if (this.ended) return;
      this.coinsEarned += amount;
      this.coinLabel.setText('本局金幣 ' + this.coinsEarned);
    });
    this.obstacleManager = new ObstacleManager(this, this.road, this.character, () => this.takeHit());
    this.stageManager = new StageManager({
      onStageChange: (stage, previous) => this.applyStage(stage, previous),
      onSectionChange: (section, stage) => {
        const backgroundKey = section?.backgroundKey ?? stage.backgroundKey;
        this.backdrop.show(backgroundKey, section ? section.endOffset - section.startOffset : stage.length);
        const palette = BACKGROUNDS[backgroundKey];
        this.backgroundPalette = palette;
        this.road.applyPalette(palette);
        this.stageLabel.setText(stage.id + ' / 12  ' + stage.name + (section ? ' · ' + section.name : ''));
      },
      onComplete: () => this.endRun('completed'),
    });
    this.stageManager.start();
    this.syncRoadAlignment();
    this.refreshDistanceLabel();

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.coinManager.destroy();
      this.obstacleManager.destroy();
      this.movement.destroy();
      this.road.destroy();
      this.backdrop.destroy();
    });
  }

  applyStage(stage, previous) {
    const backgroundKey = stage.sections?.[0]?.backgroundKey ?? stage.backgroundKey;
    this.backdrop.show(backgroundKey, stage.length);
    const palette = BACKGROUNDS[backgroundKey];
    this.backgroundPalette = palette;
    this.road.applyStage(stage, palette);
    this.obstacleManager.applyStage(stage);
    if (previous?.exitTurn) this.road.playTurn(previous.exitTurn);
    this.stageLabel.setText(stage.id + ' / 12  ' + stage.name);
  }

  syncRoadAlignment() {
    this.road.alignToBackground(this.backdrop.getRoadProjection());
    this.movement.setLanePositions(this.road.lanePositionsAt(this.character.y + 60));
  }

  refreshDistanceLabel() {
    const { distance, currentStage, totalDistance } = this.stageManager;
    this.distanceLabel.setText(Math.floor(distance) + ' / ' + totalDistance
      + ' m  ·  本關 ' + Math.floor(distance - currentStage.startDistance)
      + ' / ' + currentStage.length + ' m');
  }

  takeHit() {
    if (this.ended) return false;
    if (this.invulnerableMs > 0) return true;
    this.health = Math.max(0, this.health - 1);
    this.healthLabel.setText('生命 ' + this.health + ' / 3');
    this.cameras.main.flash(140, 180, 35, 35);
    if (this.health === 0) {
      this.endRun('defeated');
      return false;
    }
    this.invulnerableMs = 1000;
    this.slowdownMs = 1000;
    return true;
  }

  endRun(reason) {
    if (this.ended) return;
    this.ended = true;
    this.movement.destroy();
    this.playerInput.destroy();
    const wallet = bankCoins(this.coinsEarned);
    this.scene.start('ResultScene', { reason, distance: this.stageManager.distance,
      health: this.health, stage: this.stageManager.currentStage,
      coinsEarned: this.coinsEarned, totalCoins: wallet.total, coinsSaved: wallet.saved,
      score: calculateScore(this.stageManager.distance, this.coinsEarned) });
  }

  update(time, delta) {
    if (this.ended) return;
    const elapsed = Math.min(Math.max(delta, 0), 100);
    this.invulnerableMs = Math.max(0, this.invulnerableMs - elapsed);
    this.slowdownMs = Math.max(0, this.slowdownMs - elapsed);
    this.character.setAlpha(this.invulnerableMs > 0
      && Math.floor(this.invulnerableMs / 90) % 2 === 0 ? 0.35 : 1);
    this.healthLabel.setText('生命 ' + this.health + ' / 3'
      + (this.invulnerableMs > 0 ? '  ·  無敵／減速' : ''));
    const speedMultiplier = this.slowdownMs > 0 ? 0.5 : 1;
    this.stageManager.update(elapsed, (step, stage, speed) => {
      this.road.update(step, speed);
      this.backdrop.update(step, speed, this.road);
      this.syncRoadAlignment();
      this.obstacleManager.update(step, speed);
      if (!this.ended) this.coinManager.update(step, speed);
      return !this.ended;
    }, speedMultiplier);
    if (!this.ended) {
      this.refreshDistanceLabel();
    }
  }
}
