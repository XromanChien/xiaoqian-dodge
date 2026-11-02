import { OBSTACLE_DRAWERS } from '../world/obstacleDrawers.js';

// 障礙物生命週期與碰撞集中管理，PerspectiveRoad 只提供投影。
export default class ObstacleManager {
  constructor(scene, road, character, onCollision, random = Math.random) {
    this.scene = scene;
    this.road = road;
    this.character = character;
    this.onCollision = onCollision;
    this.random = random;
    this.obstacles = [];
    this.flying = new Set();
    this.spawnElapsed = 0;
    this.spawnInterval = 850;
    this.stage = null;
  }

  applyStage(stage) {
    const firstStage = this.stage === null;
    this.stage = stage;
    // 換關只改變後續生成設定，保留既有障礙的位置、種類與生成計時。
    // 只在開局鋪好前方障礙，換關不補生、不清空。
    if (firstStage) {
      const spacing = this.spawnInterval / 1000 * stage.baseSpeed / this.road.visibleDistance;
      const firstProgress = 0.55;
      for (let progress = firstProgress; progress > 0; progress -= spacing) {
        this.spawn(progress);
      }
      // 接續最後一個預生成障礙的間距，避免後續生成出現空檔。
      this.spawnElapsed = (firstProgress % spacing) / spacing * this.spawnInterval;
    }
  }

  spawn(progress = 0) {
    const types = this.stage.obstacleTypes;
    const lane = Math.floor(this.random() * 3);
    const type = types[Math.floor(this.random() * types.length)];
    const shape = this.scene.add.graphics();
    shape.fillStyle(0x101824, 0.35).fillEllipse(5, 5, 116, 30);
    OBSTACLE_DRAWERS[type](shape);
    const obstacle = { lane, type, progress, shape };
    this.obstacles.push(obstacle);
    this.position(obstacle);
    return obstacle;
  }

  position(obstacle) {
    const point = this.road.project(obstacle.progress, (obstacle.lane - 1) * 2 / 3);
    obstacle.shape.setPosition(point.x, point.y).setScale(point.scale).setDepth(point.y);
  }

  overlapsPlayer(obstacle, previousY) {
    // 用腳下的深度區間判斷，而不是用遠處箱體的圖片外框。
    // 掃過整幀的 Y 範圍，避免高速障礙跨過玩家而漏判。
    const feetY = this.character.y + 60;
    if (previousY > feetY + 24 || obstacle.shape.y < feetY - 24) return false;
    const laneX = this.road.lanePositionsAt(feetY)[obstacle.lane];
    const scale = 1.5 * (feetY - this.road.horizon) / (this.road.bottom - this.road.horizon);
    const halfWidths = { crate: 45, cone: 38, barrier: 58 };
    // 使用角色當下 X，換道動畫尚未到達目標跑道時不會提前判定。
    return Math.abs(this.character.x - laneX) < 32 + halfWidths[obstacle.type] * scale;
  }

  update(delta, speed) {
    if (!this.stage) return;
    const step = delta / 1000 * speed / this.road.visibleDistance;
    for (let i = this.obstacles.length - 1; i >= 0; i -= 1) {
      const obstacle = this.obstacles[i];
      const previousY = obstacle.shape.y;
      obstacle.progress += step;
      this.position(obstacle);
      if (this.overlapsPlayer(obstacle, previousY)) {
        // 無敵期間接觸到的障礙也移除，同一障礙不會在無敵結束後再次扣血。
        obstacle.shape.destroy();
        this.obstacles.splice(i, 1);
        if (this.onCollision(obstacle) === false) return;
      } else if (obstacle.shape.y - 112 * obstacle.shape.scaleY > this.road.height + 30) {
        obstacle.shape.destroy();
        this.obstacles.splice(i, 1);
      }
    }
    // 減速時生成節奏一起放慢，維持原本的世界間距。
    this.spawnElapsed += delta * speed / this.stage.baseSpeed;
    while (this.spawnElapsed >= this.spawnInterval) {
      this.spawnElapsed -= this.spawnInterval;
      this.spawn();
    }
  }

  kickNearest(maxDistance = 18) {
    const feetY = this.character.y + 60;
    const perspective = (feetY - this.road.horizon) / (this.road.bottom - this.road.horizon);
    if (perspective <= 0 || !Number.isFinite(maxDistance) || maxDistance < 0) return false;
    const feetProgress = (this.road.farDistance - this.road.nearDistance / perspective)
      / (this.road.farDistance - this.road.nearDistance);
    // 換道途中依實際腳點 X 選最近跑道，不使用換道的目標索引。
    const lanes = this.road.lanePositionsAt(feetY);
    const lane = lanes.reduce((closest, x, index) =>
      Math.abs(x - this.character.x) < Math.abs(lanes[closest] - this.character.x) ? index : closest, 0);
    let nearest = null;
    let nearestDistance = Infinity;
    for (const obstacle of this.obstacles) {
      const distance = (feetProgress - obstacle.progress) * this.road.visibleDistance;
      if (obstacle.lane === lane && distance >= 0 && distance <= maxDistance && distance < nearestDistance) {
        nearest = obstacle;
        nearestDistance = distance;
      }
    }
    if (!nearest) return false;

    // 先離開碰撞／生成集合，再獨立播放擊飛動畫；不產生分數或金幣。
    this.obstacles.splice(this.obstacles.indexOf(nearest), 1);
    const shape = nearest.shape;
    const target = this.road.project(nearest.progress - 18 / this.road.visibleDistance, (lane - 1) * 2 / 3);
    this.flying.add(shape);
    this.scene.tweens.add({
      targets: shape,
      x: target.x,
      y: target.y - 180,
      angle: shape.angle + 300,
      scaleX: shape.scaleX * 0.22,
      scaleY: shape.scaleY * 0.22,
      alpha: 0,
      duration: 600,
      ease: 'Quad.easeOut',
      onComplete: () => {
        this.flying.delete(shape);
        shape.destroy();
      },
    });
    return true;
  }
  clear() {
    for (const shape of this.flying) {
      this.scene.tweens.killTweensOf(shape);
      shape.destroy();
    }
    this.flying.clear();
    this.obstacles.forEach(obstacle => obstacle.shape.destroy());
    this.obstacles.length = 0;
    this.spawnElapsed = 0;
  }

  destroy() {
    this.clear();
    this.stage = null;
  }
}
