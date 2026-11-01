import { loadProfile, addEarnedCoins, PROFILE_KEY } from './profileStorage.js';
// 金幣已併入單一存檔；舊 totalCoins 會在初次載入時自動讀取遷移。
export const COIN_STORAGE_KEY = PROFILE_KEY;
export function loadTotalCoins() { return loadProfile().totalCoins; }
export function bankCoins(coinsEarned) { return addEarnedCoins(coinsEarned); }
export function calculateScore(distance, coinsEarned) {
  return Math.floor(Math.max(0, distance)) + coinsEarned * 10;
}
