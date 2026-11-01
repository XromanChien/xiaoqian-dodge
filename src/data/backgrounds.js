// 每個 backgroundKey 對應獨立幾何背景主題，可日後替換成正式圖片。
const theme = (sky, land, accent, skyline, road = 0x25364b) =>
  ({ sky, land, accent, skyline, road });
export const BACKGROUNDS = {
  jinlongTunnel: { ...theme(0x111722, 0x232a31, 0xffd899, [20,20,20,20,20,20], 0x292e35), decoration: 'tunnel', shoulder: 0x3b4149, edge: 0xa2a7a8, stripe: 0x77818b, center: 0x30353b, line: 0xb4b9b3 },
  jinlongRoad: theme(0x182b42, 0x203c42, 0x547a83, [80,150,35,110,45,115]),
  warmup: theme(0x244357, 0x34554c, 0x639e8f, [40,90,65,120,60,75]),
  miramar: theme(0x252044, 0x343653, 0xa77dc1, [100,55,140,65,110,80]),
  dazhiBridge: theme(0x26475c, 0x31566a, 0x8dbcc3, [35,140,40,40,140,35]),
  grandHotel: theme(0x512e3c, 0x4b4140, 0xc98b64, [50,80,150,150,80,50]),
  shilinMarket: theme(0x30213f, 0x403249, 0xda8d96, [75,90,65,100,80,95]),
  tamsuiMetro: theme(0x273e49, 0x384e54, 0x83b1b1, [45,45,130,130,45,45]),
  zhoumeiExpressway: theme(0x3c4f60, 0x48565b, 0xa9b6b6, [80,50,90,55,80,65], 0x303943),
  tamsuiLightRail: theme(0x40546b, 0x405b55, 0xa8c6a0, [50,95,45,70,110,55]),
  fishermansWharf: theme(0x895669, 0x3d6274, 0xffb997, [35,40,100,45,40,35]),
  danjiangBridge: theme(0x4a4265, 0x354c65, 0xd9acb7, [30,150,30,30,150,30]),
  baliOldStreet: theme(0x6e494c, 0x535448, 0xe5b784, [70,90,75,105,80,65]),
};

export function drawStageBackground(scene, graphics, key, road) {
  const palette = BACKGROUNDS[key];
  if (!palette) throw new Error(`Unknown background: ${key}`);
  const { width, height } = scene.scale;
  const horizon = height * 0.28;
  scene.cameras.main.setBackgroundColor(palette.sky);
  graphics.clear();
  if (palette.decoration) {
    animateStageBackground(graphics, palette, road);
    return palette;
  }
  graphics.fillStyle(palette.accent, 0.65);
  graphics.fillCircle(width * 0.72, horizon - 92, 58);
  graphics.fillStyle(palette.accent, 0.4);
  graphics.fillPoints([
    { x: 0, y: horizon },
    ...palette.skyline.map((rise, index) =>
      ({ x: width * index / (palette.skyline.length - 1), y: horizon - rise })),
    { x: width, y: horizon },
  ], true);
  graphics.fillStyle(palette.land).fillRect(0, horizon, width, height - horizon);
  return palette;
}

// 隧道橫截面：腳點與道路共用 1/z 投影，再依相同比例加入牆高。
export function tunnelSection(road, progress) {
  const point = (offset, elevation) => {
    const ground = road.project(progress, offset);
    return { x: ground.x, y: ground.y - elevation * ground.scale };
  };
  return [point(-1.12, 0), point(-1.12, 900), point(-0.68, 1080),
    point(0, 1140), point(0.68, 1080), point(1.12, 900), point(1.12, 0)];
}

export function animateStageBackground(graphics, palette, road) {
  decorations[palette.decoration]?.(graphics, road);
}

const decorations = {
  tunnel(g, road) {
    const { width, height } = road;
    g.clear().fillStyle(0x141a21).fillRect(0, 0, width, height);
    // 遠端與近端使用同一組橫截面，左右壁、拱頂和道路共用消失點。
    const far = tunnelSection(road, -Infinity);
    const near = tunnelSection(road, 1);
    const colors = [0x303a43, 0x3b444c, 0x333c45, 0x333c45, 0x3b444c, 0x303a43];
    colors.forEach((color, i) => {
      g.fillStyle(color).fillPoints([far[i], near[i], near[i+1], far[i+1]], true);
    });
    // 沿途拱架與燈具使用道路相位；近處間距、大小與下移速度一起增加。
    const progresses = Array.from({ length: 14 }, (_, i) => (i / 14 + road.phase) % 1)
      .sort((a, b) => a - b);
    for (const progress of progresses) {
      const ring = tunnelSection(road, progress);
      const scale = road.project(progress).scale;
      g.lineStyle(Math.max(0.7, 5 * scale), 0x687580, 0.45);
      g.strokePoints(ring, false);
      for (const offset of [-1.105, 1.105]) {
        const start = road.project(progress, offset);
        const end = road.project(Math.min(1, progress + 0.025), offset);
        g.lineStyle(Math.max(1, 8 * scale), 0xffd99a, 0.9);
        g.lineBetween(start.x, start.y - 720 * start.scale,
          end.x, end.y - 720 * end.scale);
      }
    }
  },
};
