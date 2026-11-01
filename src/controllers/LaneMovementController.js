// 與輸入方式無關：鍵盤、手機按鈕與滑動都可呼叫 moveLeft / moveRight。
export default class LaneMovementController {
  constructor(scene, character, { lanePositions, initialLane = 1, duration = 180 }) {
    this.scene = scene;
    this.character = character;
    this.lanePositions = [...lanePositions];
    this.laneIndex = initialLane;
    this.lanePosition = initialLane;
    this.duration = duration;
    this.tween = null;
    this.destroyed = false;
    this.character.x = this.lanePositions[this.laneIndex];
  }

  moveLeft() {
    return this.moveBy(-1);
  }

  moveRight() {
    return this.moveBy(1);
  }

  moveBy(direction) {
    if (this.destroyed || (direction !== -1 && direction !== 1)) return false;

    const nextLane = this.laneIndex + direction;
    if (nextLane < 0 || nextLane >= this.lanePositions.length) return false;

    // 快速連按時，以目標跑道為基準，從目前位置平滑轉向。
    this.tween?.stop();
    this.laneIndex = nextLane;
    this.tween = this.scene.tweens.add({
      targets: this,
      lanePosition: nextLane,
      onUpdate: () => this.syncPosition(),
      duration: this.duration,
      ease: 'Sine.easeInOut',
    });
    return true;
  }

  setLanePositions(positions) {
    this.lanePositions = [...positions];
    this.syncPosition();
  }

  syncPosition() {
    if (this.destroyed) return;
    const left = Math.min(1, Math.floor(this.lanePosition));
    const fraction = this.lanePosition - left;
    this.character.x = this.lanePositions[left]
      + (this.lanePositions[left + 1] - this.lanePositions[left]) * fraction;
  }

  destroy() {
    this.tween?.stop();
    this.tween = null;
    this.destroyed = true;
    this.scene = null;
    this.character = null;
  }
}
