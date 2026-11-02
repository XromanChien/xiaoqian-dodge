import RoadSurface from './RoadSurface.js';
import { ROAD_MATERIALS } from '../data/roadMaterials.js';

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
    this.travelled = 0;
    this.surface = { from: "jinlongRoad", to: "jinlongRoad", weight: 1 };
    this.turnOffset = 0;
    this.surfaceRenderer = new RoadSurface(scene, width, height);
    this.graphics = scene.add.graphics().setDepth(1);
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

  setSurface(surface) {
    if (surface) this.surface = surface;
  }

  materialColor(key, shade = 1) {
    const a = ROAD_MATERIALS[this.surface.from] ?? ROAD_MATERIALS.jinlongRoad;
    const b = ROAD_MATERIALS[this.surface.to] ?? a;
    const t = this.surface.weight;
    const channel = shift => Math.max(0, Math.min(255, Math.round(
      (((a[key] >> shift) & 255) * (1 - t) + ((b[key] >> shift) & 255) * t) * shade)));
    return (channel(16) << 16) | (channel(8) << 8) | channel(0);
  }

  drawRoad() {
    const g = this.graphics;
    g.clear();
    // One opaque ground surface replaces the painted road, including its baked-in lines.
    // Every detail has a world metre coordinate, just like coins and obstacles.
    const p = metres => 1 - (metres - this.travelled) / this.visibleDistance;
    if (!this.surfaceRenderer.shader) {
    this.quad(-Infinity, 1.025, -5, 5, this.materialColor('base'));
    this.quad(-Infinity, 1.025, -1.055, 1.055, this.materialColor('shoulder'));
    this.quad(-Infinity, 1.025, -1, 1, this.materialColor('base'));
    }
    const a = ROAD_MATERIALS[this.surface.from] ?? ROAD_MATERIALS.jinlongRoad;
    const b = ROAD_MATERIALS[this.surface.to] ?? a;
    const wood = (a.type === 'wood' ? 1 - this.surface.weight : 0)
      + (b.type === 'wood' ? this.surface.weight : 0);
    const paving = (a.type === 'paving' ? 1 - this.surface.weight : 0)
      + (b.type === 'paving' ? this.surface.weight : 0);
    this.surfaceRenderer.update(this, wood, paving);
    const hash = n => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
    // Stable, individually varied ground patches. No full-screen texture reset on a stage change.
    if (!this.surfaceRenderer.shader) for (let row = Math.floor((this.travelled - 5) / 3); row < Math.ceil((this.travelled + 230) / 3); row++) {
      const near = p(row * 3), far = p((row + 1) * 3);
      if (this.project(far).y > this.height + 30) continue;
      const fade = Math.min(1, Math.max(0, near + 0.55));
      for (let col = 0; col < 8; col++) {
        const random = hash(row * 17 + col);
        const left = -1 + col / 4;
        // Tiny stable aggregate rather than visibly tiled rectangular patches.
        for (let grain = 0; grain < 3; grain++) {
          const r = hash(row * 107 + col * 7 + grain);
          const xg = (left + r * 0.25) * 5;
          const pg = far + r * (near - far);
          this.quad(pg, pg + 0.0006, xg, xg + 0.006,
            this.materialColor(r > 0.5 ? 'light' : 'shadow'), 0.2 * fade);
        }
        // Fine longitudinal grain also creates reflected light on wet paving.
        const x = left + random * 0.22;
        this.quad(far, far + (near - far) * 0.65, x, x + 0.004,
          this.materialColor('light'), 0.035 * fade);
      }
      if (wood + paving > 0) {
        this.quad(near - 0.002, near, -1, 1, this.materialColor('shadow'),
          (wood * 0.60 + paving * 0.22) * fade);
        for (const offset of [-0.66, 0, 0.66]) {
          this.quad(far, near, offset, offset + 0.003, this.materialColor('shadow'), paving * 0.3 * fade);
        }
      }
    }
    const markings = (a.marking ? 1 - this.surface.weight : 0) + (b.marking ? this.surface.weight : 0);
    for (let segment = Math.floor((this.travelled - 10) / 18); segment < Math.ceil((this.travelled + 230) / 18); segment++) {
      const start = p(segment * 18 + 7), end = p(segment * 18);
      if (this.project(start).y > this.height + 30) continue;
      const fade = Math.min(1, Math.max(0, end + 0.4));
      for (const divider of [-1 / 3, 1 / 3]) {
        // Non-road stages use subtle inlaid guides, preserving the same three lane centres.
        this.quad(start, end, divider - 0.009, divider + 0.009,
          this.materialColor('line'), (0.28 + 0.65 * markings) * fade);
      }
    }
    for (const edge of [-1, 1]) {
      this.quad(-Infinity, 1.025, edge - 0.007, edge + 0.007, this.materialColor('line'), 0.65);
      this.quad(-Infinity, 1.025, edge * 1.018 - 0.007, edge * 1.018 + 0.007,
        this.materialColor('shadow'), 0.55);
    }
  }

  update(delta, speed = this.baseSpeed) {
    const step = delta / 1000 * speed / this.visibleDistance;
    this.phase = (this.phase + step) % 1;
    this.travelled += delta / 1000 * speed;
    this.drawRoad();
  }

  destroy() {
    this.scene.tweens.killTweensOf(this);
    this.surfaceRenderer.destroy();
    this.graphics.destroy();
  }
}
