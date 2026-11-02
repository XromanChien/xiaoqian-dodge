import kickUrl from '../../image/characters/xiaoqian-langzi-kick.png';
import guardUrl from '../../image/characters/xiaoqian-bear-shiver.png';
import atlas from '../../image/characters/skill-actions.json';

export const SKILL_ART = {
  attack: { key: 'xiaoqian-kick', url: kickUrl, ...atlas.assets[0] },
  guard: { key: 'xiaoqian-guard', url: guardUrl, ...atlas.assets[1] },
};
export const SKILLS = {
  attack: { durationMs: 500, impactMs: 220, rangeMetres: 18 },
  guard: { durationMs: 3000, frameMs: 125 },
};
