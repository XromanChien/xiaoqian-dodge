// 共用投影：路面、標線、障礙物與角色的跑道位置使用同一套透視。
export default class PerspectiveRoad {
  constructor(scene, width, height) {
    this.scene = scene;
    this.width = width;
    this.height = height;
    this.horizon = height * 0.53;
    this.bottom = height + 180;
    this.vanishingX = width / 2;
    this.centerSlope = 0;
    this.nearHalfWidth = width * 0.59;
    // 相機前方的世界距離；相同生成間隔代表固定的世界間距。
    this.farDistance = 12;
    this.nearDistance = 0.9;
    this.visibleDistance = 130; // 投影遠端到近端對應的遊戲公尺數
    this.baseSpeed = 20;
    this.roadColor = 0x25364b;
    this.palette = {};
    this.phase = 0;
    this.turnOffset = 0;
    this.graphics = scene.add.graphics().setDepth(0);
    this.drawRoad();
  }

  alignToBackground(projection) {
    this.horizon = projection.horizon;
    this.vanishingX = projection.vanishingX;
    this.centerSlope = projection.centerSlope;
    this.nearHalfWidth = projection.widthSlope * (this.bottom - this.horizon);
  }

  applyStage(stage, palette) {
    this.baseSpeed = stage.baseSpeed;
    this.applyPalette(palette);
    this.drawRoad();
  }

  applyPalette(palette) {
    this.palette = palette;
    this.roadColor = palette.road;
  }

  playTurn(direction) {
    const offset = { right: 120, left: -120 }[direction];
    if (offset === undefined) return;
    this.scene.tweens.killTweensOf(this);
    this.turnOffset = 0;
    this.scene.tweens.add({ targets: this, turnOffset: offset, duration: 550,
      hold: 100, yoyo: true, ease: 'Sine.easeInOut' });
  }

  project(progress, laneOffset = 0) {
    // 針孔相機投影：位置、道路寬度與物件大小都使用相同的 1/z。
    // 深度等速減少時，畫面上的前後間距會隨接近相機而加速拉開。
    const distance = Math.max(0.05,
      this.farDistance - progress * (this.farDistance - this.nearDistance));
    const perspective = this.nearDistance / distance;
    return {
      x: this.vanishingX + this.centerSlope * (this.bottom - this.horizon) * perspective
        + laneOffset * this.nearHalfWidth * perspective,
      y: this.horizon + (this.bottom - this.horizon) * perspective,
      scale: 1.5 * perspective,
    };
  }

  lanePositionsAt(y) {
    const perspective = (y - this.horizon) / (this.bottom - this.horizon);
    return [-2 / 3, 0, 2 / 3].map(offset =>
      this.vanishingX + this.centerSlope * (y - this.horizon) + offset * this.nearHalfWidth * perspective);
  }

  quad(start, end, left, right, color, alpha = 1) {
    // 整段道路用多點描邊，轉彎時路面與沿途標線保持相同曲線。
    if (start === -Infinity) {
      const samples = [-Infinity, ...Array.from({ length: 49 }, (_, i) => i / 48)];
      const points = [...samples.map(p => this.project(p, left)),
        ...samples.slice().reverse().map(p => this.project(p, right))];
      this.graphics.fillStyle(color, alpha).fillPoints(points, true);
      return;
    }
    const a = this.project(start, left);
    const b = this.project(start, right);
    const c = this.project(end, right);
    const d = this.project(end, left);
    this.graphics.fillStyle(color, alpha);
    this.graphics.fillPoints([a, b, c, d], true);
  }

  drawRoad() {
    // The photograph is the visible road. Do not draw a second road or lane grid.
    this.graphics.clear();
  }

  update(delta, speed = this.baseSpeed) {
    const step = delta / 1000 * speed / this.visibleDistance;
    this.phase = (this.phase + step) % 1;
    this.drawRoad();
  }

  destroy() {
    this.scene.tweens.killTweensOf(this);
    this.graphics.destroy();
  }
}
