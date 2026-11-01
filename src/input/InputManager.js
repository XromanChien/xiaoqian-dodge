import Phaser from 'phaser';

// 只負責輸入轉接；跑道、邊界與動畫一律交給 movement。
export default class InputManager {
  constructor(scene, movement, {
    showTouchControls = navigator.maxTouchPoints > 0
      || window.matchMedia('(any-pointer: coarse)').matches,
  } = {}) {
    this.scene = scene;
    this.movement = movement;
    this.destroyed = false;
    this.touchButtons = [];
    this.touchLabels = [];
    this.showTouchControls = showTouchControls;
    this.keyboard = scene.input.keyboard;
    this.handledKeyEvents = new WeakSet();
    this.onLeft = event => this.handleKey(event, 'moveLeft');
    this.onRight = event => this.handleKey(event, 'moveRight');
    this.onShutdown = () => this.destroy();

    this.keyboard?.addCapture(['LEFT', 'RIGHT']);
    this.keyboard?.on('keydown-LEFT', this.onLeft);
    this.keyboard?.on('keydown-RIGHT', this.onRight);

    if (showTouchControls) this.createTouchButtons();
    scene.events.once(Phaser.Scenes.Events.SHUTDOWN, this.onShutdown);
    scene.events.once(Phaser.Scenes.Events.DESTROY, this.onShutdown);
  }

  handleKey(event, action) {
    // 同一個原生事件即使被輸入佇列重送，也只換道一次。
    if (event.repeat || this.handledKeyEvents.has(event)) return;
    this.handledKeyEvents.add(event);
    this[action]();
  }

  createTouchButtons() {
    const { width, height } = this.scene.scale;
    // 720×1280 邏輯座標，隨 FIT 縮放；底部留白避開手機手勢區。
    const y = height - 150;
    const entries = [
      { x: 120, label: '←', action: () => this.moveLeft() },
      { x: width - 120, label: '→', action: () => this.moveRight() },
    ];
    for (const { x, label, action } of entries) {
      const button = this.scene.add.rectangle(x, y, 192, 184, 0xffffff, 0.08)
        .setStrokeStyle(2, 0xffffff, 0.25)
        .setDepth(20000).setScrollFactor(0)
        .setInteractive({ useHandCursor: true });
      const arrow = this.scene.add.text(x, y, label, {
        fontFamily: 'system-ui, sans-serif', fontSize: '64px', color: '#ffffff',
      }).setOrigin(0.5).setAlpha(0.6).setDepth(20001).setScrollFactor(0);
      // 只監聽 pointerdown，避免觸控同時處理 click 而重複換道。
      button.on('pointerdown', () => {
        button.setFillStyle(0xffffff, 0.2);
        action();
      });
      const release = () => button.setFillStyle(0xffffff, 0.08);
      button.on('pointerup', release);
      button.on('pointerout', release);
      this.touchButtons.push(button);
      this.touchLabels.push(arrow);
    }
  }

  moveLeft() {
    if (this.destroyed || !this.scene.sys.isActive()) return false;
    return this.movement.moveLeft();
  }

  moveRight() {
    if (this.destroyed || !this.scene.sys.isActive()) return false;
    return this.movement.moveRight();
  }

  // 保留給未來 Capacitor／手勢辨識層呼叫，這裡不重複實作換道。
  swipeLeft() {
    return this.moveLeft();
  }

  swipeRight() {
    return this.moveRight();
  }

  destroy() {
    if (this.destroyed) return;
    this.destroyed = true;
    this.keyboard?.off('keydown-LEFT', this.onLeft);
    this.keyboard?.off('keydown-RIGHT', this.onRight);
    this.keyboard?.removeCapture(['LEFT', 'RIGHT']);
    this.scene.events.off(Phaser.Scenes.Events.SHUTDOWN, this.onShutdown);
    this.scene.events.off(Phaser.Scenes.Events.DESTROY, this.onShutdown);
    this.touchButtons.forEach(button => button.destroy());
    this.touchLabels.forEach(label => label.destroy());
    this.touchButtons.length = 0;
    this.touchLabels.length = 0;
    this.keyboard = null;
    this.movement = null;
    this.scene = null;
  }
}
