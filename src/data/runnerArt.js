import spriteUrl from '../../image/characters/xiaoqian-back-poses.png';
export const RUNNER_ART = { key: 'xiaoqian-back', url: spriteUrl };
// Explicit atlas bounds: generator cells are not perfectly equally spaced.
export const RUNNER_FRAMES = {
  run: [0, 0, 380, 1024],
  left: [714, 0, 420, 1024],
  right: [1134, 0, 402, 1024],
};

import runCycleUrl from '../../image/characters/xiaoqian-run-cycle.png';
export const RUN_CYCLE = {
  key: 'xiaoqian-run-cycle', url: runCycleUrl, frameMs: 110,
  frames: [[0, 0, 512, 768], [512, 0, 512, 768], [0, 768, 512, 768], [512, 768, 512, 768]],
  origin: [0.5, 752 / 768], scale: 0.295, flipX: true,
};
