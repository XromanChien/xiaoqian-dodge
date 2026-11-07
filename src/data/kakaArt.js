import url from '../../image/characters/kaka-poses-v4.png';
export const KAKA_ART = { key: 'kaka-poses', url };
// Equal 3x3 atlas; bounds derive from actual texture size to avoid resampling.
export function registerKakaFrames(texture) {
  const { width, height } = texture.getSourceImage();
  for (let i = 0; i < 9; i++) {
    const x = Math.round(i % 3 * width / 3), y = Math.round(Math.floor(i / 3) * height / 3);
    const w = Math.round((i % 3 + 1) * width / 3) - x;
    const h = Math.round((Math.floor(i / 3) + 1) * height / 3) - y;
    if (!texture.has(String(i))) texture.add(String(i), 0, x, y, w, h);
  }
}
