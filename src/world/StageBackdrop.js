import { ROAD_ALIGNMENT } from '../data/roadAlignment.js';
import { STAGE_ART } from '../data/stageArt.js';

const ease = t => t * t * t * (t * (t * 6 - 15) + 10);
const mix = (a, b, t) => a + (b - a) * t;
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

// Each scene uses one image and one forward-only camera move. No looping copies.
export default class StageBackdrop {
  constructor(scene) {
    this.scene = scene;
    this.distance = 0;
    this.active = 0;
    this.key = null;
    this.pending = null;
    this.transition = null;
    this.layers = [0, 1].map(() => {
      const image = scene.add.image(360, 640, STAGE_ART.jinlongRoad.key);
      const container = scene.add.container(0, 0, [image]).setDepth(-2).setAlpha(0);
      return { container, image, distance: 0, length: 200, projection: null };
    });
  }

  show(backgroundKey, length = 200) {
    const art = STAGE_ART[backgroundKey];
    if (!art) return;
    if (art.key === this.key) {
      this.pending = null;
      return; // Same road continues through a stage boundary without resetting its camera.
    }
    if (this.transition) {
      this.pending = { backgroundKey, length };
      return;
    }
    const previous = this.layers[this.active];
    this.active = 1 - this.active;
    const next = this.layers[this.active];
    next.image.setTexture(art.key);
    next.distance = 0;
    next.length = Math.max(1, length);
    next.alignment = ROAD_ALIGNMENT[backgroundKey];
    next.backgroundKey = backgroundKey;
    next.container.setDepth(-1).setAlpha(this.key ? 0 : 1);
    previous.container.setDepth(-2);
    if (this.key) this.transition = { elapsed: 0, previous, next };
    this.key = art.key;
    this.render(0);
  }

  update(delta, speed, road) {
    const elapsed = Math.max(0, delta);
    const travelled = elapsed / 1000 * Math.max(0, speed);
    this.distance += travelled;
    for (const layer of this.layers) {
      if (layer.container.alpha > 0 || layer === this.transition?.next) layer.distance += travelled;
    }
    if (this.transition) this.transition.elapsed += elapsed;
    this.render(road?.turnOffset ?? 0);
    if (this.transition && this.transition.elapsed >= 2400) {
      this.transition.previous.container.setAlpha(0);
      this.transition = null;
      const pending = this.pending;
      this.pending = null;
      if (pending) this.show(pending.backgroundKey, pending.length);
    }
  }

  pose(layer, turnOffset) {
    // Progress is monotonic and does not wrap. The gentle tail allows outgoing motion.
    const progress = layer.distance / 650;
    const zoom = 1.12 + 0.36 * (progress <= 1 ? progress : 1 + 0.15 * (1 - Math.exp(-(progress - 1) / 0.15)));
    return { zoom, x: 360 + turnOffset * 0.08, y: 678 + (640 - 678) * zoom };
  }

  place(layer, pose, target) {
    const [vx, vy, cx, half] = layer.alignment;
    const { zoom } = pose;
    const naturalX = pose.x + (vx * 720 - 360) * zoom;
    const naturalY = pose.y + (vy * 1280 - 640) * zoom;
    const x = clamp(pose.x + (target ? target.x - naturalX : 0), 720 - 360 * zoom, 360 * zoom);
    const y = clamp(pose.y + (target ? target.y - naturalY : 0), 1280 - 640 * zoom, 640 * zoom);
    layer.image.setDisplaySize(720 * zoom, 1280 * zoom).setPosition(x, y);
    layer.projection = {
      horizon: y + (vy * 1280 - 640) * zoom,
      vanishingX: x + (vx * 720 - 360) * zoom,
      centerSlope: (cx - vx) * 720 / ((1 - vy) * 1280),
      widthSlope: half * 720 / ((1 - vy) * 1280),
    };
  }

  render(turnOffset) {
    const current = this.layers[this.active];
    if (!this.transition) {
      this.place(current, this.pose(current, turnOffset));
      return;
    }
    const { previous, next, elapsed } = this.transition;
    const weight = ease(clamp(elapsed / 2400, 0, 1));
    const oldPose = this.pose(previous, turnOffset);
    const nextPose = this.pose(next, turnOffset);
    const vanishing = (layer, pose) => ({
      x: pose.x + (layer.alignment[0] * 720 - 360) * pose.zoom,
      y: pose.y + (layer.alignment[1] * 1280 - 640) * pose.zoom,
    });
    const a = vanishing(previous, oldPose);
    const b = vanishing(next, nextPose);
    const target = { x: mix(a.x, b.x, weight), y: mix(a.y, b.y, weight) };
    // Match road vanishing points while dissolving; guard image edges against gaps.
    this.place(previous, oldPose, target);
    this.place(next, nextPose, target);
    next.container.setAlpha(weight);
  }

  getSurface() {
    const current = this.layers[this.active];
    return {
      from: this.transition?.previous.backgroundKey ?? current.backgroundKey,
      to: current.backgroundKey,
      weight: this.transition ? this.transition.next.container.alpha : 1,
    };
  }

  getRoadProjection() {
    const current = this.layers[this.active].projection;
    if (!this.transition) return current;
    const old = this.transition.previous.projection;
    const weight = this.transition.next.container.alpha;
    return Object.fromEntries(Object.keys(current).map(key => [key, mix(old[key], current[key], weight)]));
  }

  destroy() {
    this.transition = null;
    this.pending = null;
    this.layers.forEach(layer => layer.container.destroy());
  }
}
