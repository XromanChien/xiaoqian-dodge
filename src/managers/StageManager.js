import { STAGES } from '../data/stages.js';

// 純邏輯，不依賴 Phaser；關卡範圍為 [startDistance, endDistance)。
export default class StageManager {
  constructor({ stages = STAGES, onStageChange = () => {}, onSectionChange = () => {} } = {}) {
    this.stages = stages;
    this.totalDistance = stages.at(-1).endDistance;
    this.distance = 0;
    this.currentStage = null;
    this.currentSection = null;
    this.lap = 1;
    this.lapDistance = 0;
    this.speedMultiplier = 1;
    this.onStageChange = onStageChange;
    this.onSectionChange = onSectionChange;
  }

  start() {
    this.setDistance(0);
  }

  setDistance(distance) {
    if (!Number.isFinite(distance)) throw new TypeError('距離必須是有限數值');
    const previousLap = this.lap;
    this.distance = Math.max(0, distance);
    this.lap = Math.floor(this.distance / this.totalDistance) + 1;
    this.lapDistance = this.distance % this.totalDistance;
    this.speedMultiplier = 2 ** (this.lap - 1);
    const next = this.stages.find(stage => this.lapDistance < stage.endDistance)
      ?? this.stages.at(-1);
    if (next !== this.currentStage || this.lap !== previousLap) {
      const previous = this.currentStage;
      this.currentStage = next;
      this.onStageChange(next, previous);
    }
    const offset = this.lapDistance - next.startDistance;
    const section = next.sections?.find(item => offset >= item.startOffset && offset < item.endOffset) ?? null;
    if (section !== this.currentSection) {
      this.currentSection = section;
      this.onSectionChange(section, next);
    }
  }

  update(delta, onStep = () => {}, speedMultiplier = 1) {
    if (!this.currentStage) this.start();
    let remaining = Math.min(Math.max(delta, 0), 100) / 1000;
    // 跨界時將本幀拆開，前後兩關各自使用正確速度與視覺設定。
    while (remaining > 0) {
      const stage = this.currentStage;
      const lapStart = (this.lap - 1) * this.totalDistance;
      const boundary = lapStart + (this.currentSection
        ? stage.startDistance + this.currentSection.endOffset : stage.endDistance);
      const speed = stage.baseSpeed * this.speedMultiplier * speedMultiplier;
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
