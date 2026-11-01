// Sample the usable road at 78% image height (near the runner's feet),
// not the far-off-screen road edges extrapolated from the bottom of the image.
// [vanishingX, vanishingY, left road edge, right road edge], normalized.
const samples = {
  jinlongRoad: [0.50, 0.55, 0.02, 0.98],
  jinlongTunnel: [0.42, 0.53, 0.02, 0.98],
  miramar: [0.50, 0.57, 0.03, 0.97],
  dazhiBridge: [0.43, 0.455, 0.02, 0.86],
  grandHotel: [0.53, 0.50, 0.03, 0.97],
  shilinMarket: [0.50, 0.46, 0.07, 0.93],
  tamsuiMetro: [0.50, 0.54, 0.06, 0.94],
  zhoumeiExpressway: [0.53, 0.48, 0.03, 0.97],
  tamsuiLightRail: [0.48, 0.48, 0.04, 0.86],
  fishermansWharf: [0.44, 0.39, 0.05, 0.88],
  danjiangBridge: [0.55, 0.45, 0.03, 0.97],
  baliOldStreet: [0.53, 0.44, 0.08, 0.92],
};

export const ROAD_ALIGNMENT = Object.fromEntries(Object.entries(samples).map(
  ([key, [vx, vy, left, right]]) => {
    const ratio = (1 - vy) / (0.78 - vy);
    return [key, [vx, vy, vx + ((left + right) / 2 - vx) * ratio,
      (right - left) / 2 * ratio]];
  },
));
