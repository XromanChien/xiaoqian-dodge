import { STAGES } from '../data/stages.js';

// 純邏輯，不依賴 Phaser；關卡範圍為 [startDistance, endDistance)。
export default class StageManager {
  constructor({ stages = STAGES, onStageChange = () => {}, onSectionChange = () => {}, onComplete = () => {} } = {}) {
    this.stages = stages;
    this.totalDistance = stages.at(-1).endDistance;
    this.distance = 0;
    this.currentStage = null;
    this.currentSection = null;
    this.completed = false;
    this.onStageChange = onStageChange;
    this.onSectionChange = onSectionChange;
    this.onComplete = onComplete;
  }

  start() {
    this.setDistance(0);
  }

  setDistance(distance) {
    if (!Number.isFinite(distance)) throw new TypeError('距離必須是有限數值');
    this.distance = Math.max(0, Math.min(distance, this.totalDistance));
    const next = this.stages.find(stage => this.distance < stage.endDistance)
      ?? this.stages.at(-1);
    if (next !== this.currentStage) {
      const previous = this.currentStage;
      this.currentStage = next;
      this.onStageChange(next, previous);
    }
    const offset = this.distance - next.startDistance;
    const section = next.sections?.find(item => offset >= item.startOffset && offset < item.endOffset) ?? null;
    if (section !== this.currentSection) {
      this.currentSection = section;
      this.onSectionChange(section, next);
    }
    const finished = this.distance >= this.totalDistance;
    const justFinished = finished && !this.completed;
    this.completed = finished;
    if (justFinished) this.onComplete({ distance: this.distance, stage: next });
  }

  update(delta, onStep = () => {}, speedMultiplier = 1) {
    if (this.completed) return;
    if (!this.currentStage) this.start();
    let remaining = Math.min(Math.max(delta, 0), 100) / 1000;
    // 跨界時將本幀拆開，前後兩關各自使用正確速度與視覺設定。
    while (remaining > 0 && !this.completed) {
      const stage = this.currentStage;
      const boundary = this.currentSection
        ? stage.startDistance + this.currentSection.endOffset : stage.endDistance;
      const speed = stage.baseSpeed * speedMultiplier;
      if (speed <= 0) return;
      const toBoundary = (boundary - this.distance) / speed;
      const seconds = Math.min(remaining, toBoundary);
      if (onStep(seconds * 1000, stage, speed) === false) return;
      remaining -= seconds;
      this.setDistance(seconds >= toBoundary
        ? boundary : this.distance + seconds * speed);
    }
  }
}
