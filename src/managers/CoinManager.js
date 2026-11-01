export const COIN_PATTERNS = {
  single: lane => [{ lane, offset: 0 }],
  line: lane => Array.from({ length: 5 }, (_, i) => ({ lane, offset: i * 0.04 })),
  zigzag: lane => Array.from({ length: 5 }, (_, i) => ({
    lane: i % 2 === 0 ? (lane === 2 ? 2 : 0) : (lane === 2 ? 0 : 2),
    offset: i * 0.12,
  })),
};

export default class CoinManager {
  constructor(scene, road, character, onCollect, random = Math.random) {
    this.scene = scene;
    this.road = road;
    this.character = character;
    this.onCollect = onCollect;
    this.random = random;
    this.coins = [];
    this.effects = new Set();
    this.distanceSincePattern = 0;
    this.patternDistance = 75;
    this.destroyed = false;
    this.spawnPattern('line', 0.35);
  }

  spawnPattern(pattern, progress = 0) {
    const names = Object.keys(COIN_PATTERNS);
    const selected = pattern ?? names[Math.floor(this.random() * names.length)];
    const lane = Math.floor(this.random() * 3);
    return COIN_PATTERNS[selected](lane).map(item => this.spawnCoin(item.lane, progress - item.offset));
  }

  spawnCoin(lane, progress) {
    const shape = this.scene.add.graphics();
    // 金幣懸在路面上，原點仍是腳下深度，避免收集判定受圖形高度影響。
    shape.fillStyle(0x9c6619).fillEllipse(4, -46, 48, 62);
    shape.fillStyle(0xffd45a).fillEllipse(0, -48, 48, 62);
    shape.lineStyle(3, 0xfff2ac).strokeEllipse(0, -48, 36, 50);
    shape.fillStyle(0xfff2ac).fillRect(-3, -65, 6, 34);
    const coin = { lane, progress, shape };
    this.coins.push(coin);
    this.position(coin);
    return coin;
  }

  position(coin) {
    const point = this.road.project(coin.progress, (coin.lane - 1) * 2 / 3);
    coin.shape.setPosition(point.x, point.y).setScale(point.scale).setDepth(point.y + 1);
  }

  touchesPlayer(coin, previousY) {
    const feetY = this.character.y + 60;
    if (previousY > feetY + 26 || coin.shape.y < feetY - 26) return false;
    const laneX = this.road.lanePositionsAt(feetY)[coin.lane];
    const scale = 1.5 * (feetY - this.road.horizon) / (this.road.bottom - this.road.horizon);
    return Math.abs(this.character.x - laneX) < 32 + 24 * scale;
  }

  collect(coin) {
    const shape = coin.shape;
    shape.setDepth(9000);
    this.effects.add(shape);
    this.scene.tweens.add({ targets: shape, y: shape.y - 90,
      scaleX: shape.scaleX * 1.5, scaleY: shape.scaleY * 1.5, alpha: 0,
      duration: 320, ease: 'Sine.easeOut', onComplete: () => {
        this.effects.delete(shape);
        shape.destroy();
      } });
    const label = this.scene.add.text(this.character.x, this.character.y - 80, '+1', {
      fontFamily: 'system-ui, sans-serif', fontSize: '32px', color: '#ffe48a',
    }).setOrigin(0.5).setDepth(9001);
    this.effects.add(label);
    this.scene.tweens.add({ targets: label, y: label.y - 60, alpha: 0, duration: 450,
      onComplete: () => { this.effects.delete(label); label.destroy(); } });
    this.onCollect(1);
  }

  update(delta, speed) {
    if (this.destroyed) return;
    const meters = delta / 1000 * speed;
    for (let i = this.coins.length - 1; i >= 0; i -= 1) {
      const coin = this.coins[i];
      const previousY = coin.shape.y;
      coin.progress += meters / this.road.visibleDistance;
      this.position(coin);
      if (this.touchesPlayer(coin, previousY)) {
        this.coins.splice(i, 1); // 先移出收集清單，動畫期間不會重複計數。
        this.collect(coin);
      } else if (coin.shape.y - 80 * coin.shape.scaleY > this.road.height + 30) {
        coin.shape.destroy();
        this.coins.splice(i, 1);
      }
    }
    this.distanceSincePattern += meters;
    while (this.distanceSincePattern >= this.patternDistance) {
      this.distanceSincePattern -= this.patternDistance;
      this.spawnPattern();
    }
  }

  destroy() {
    this.destroyed = true;
    for (const object of [...this.coins.map(coin => coin.shape), ...this.effects]) {
      this.scene.tweens.killTweensOf(object);
      object.destroy();
    }
    this.coins.length = 0;
    this.effects.clear();
  }
}
