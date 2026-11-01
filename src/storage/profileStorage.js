import { EQUIPMENT_SLOTS, ITEM_BY_ID } from '../data/shopItems.js';
export const PROFILE_KEY = 'xiaoqian-dodge.profile.v1';
export const LEGACY_COIN_KEY = 'xiaoqian-dodge.totalCoins';
let memoryProfile = null;
const coins = value => Number.isSafeInteger(value) && value >= 0 ? value : 0;

function normalize(raw = {}) {
  const ownedItems = [...new Set(Array.isArray(raw.ownedItems)
    ? raw.ownedItems.filter(id => Object.hasOwn(ITEM_BY_ID, id)) : [])];
  const equipped = Object.fromEntries(EQUIPMENT_SLOTS.map(slot => {
    const id = raw.equipped?.[slot.id];
    return [slot.id, ownedItems.includes(id) && ITEM_BY_ID[id]?.slot === slot.id ? id : null];
  }));
  return { version: 1, totalCoins: coins(raw.totalCoins), character: 'xiaoqian', ownedItems, equipped };
}

export function loadProfile() {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    const parsed = raw === null ? null : JSON.parse(raw);
    memoryProfile = normalize(parsed && typeof parsed === 'object' ? parsed : {
      totalCoins: coins(Number(localStorage.getItem(LEGACY_COIN_KEY))),
    });
  } catch {
    memoryProfile ??= normalize();
  }
  return structuredClone(memoryProfile);
}

function saveProfile(profile) {
  const next = normalize(profile);
  try {
    // 金幣、持有物與穿戴狀態單次寫入，避免扣款成功卻未取得道具。
    localStorage.setItem(PROFILE_KEY, JSON.stringify(next));
    memoryProfile = next;
    return { ok: true, profile: structuredClone(next) };
  } catch {
    return { ok: false, message: '無法儲存，請確認瀏覽器儲存設定；本次操作未完成。' };
  }
}

export function purchaseItem(id) {
  const item = Object.hasOwn(ITEM_BY_ID, id) ? ITEM_BY_ID[id] : null;
  if (!item) return { ok: false, message: '找不到此道具。' };
  const profile = loadProfile();
  if (profile.ownedItems.includes(id)) return { ok: false, message: '已擁有此道具，不會重複扣款。' };
  if (profile.totalCoins < item.price) return { ok: false, message: '金幣不足，先跑一局收集金幣吧！' };
  profile.totalCoins -= item.price;
  profile.ownedItems.push(id);
  const result = saveProfile(profile);
  return { ...result, message: result.ok ? '已購買 ' + item.name + '，可到角色頁裝備。' : result.message };
}

export function equipItem(slot, id) {
  if (!EQUIPMENT_SLOTS.some(item => item.id === slot)) return { ok: false, message: '無效的裝備欄位。' };
  const profile = loadProfile();
  if (id !== null && (!profile.ownedItems.includes(id) || ITEM_BY_ID[id]?.slot !== slot)) {
    return { ok: false, message: '尚未擁有此裝備，或欄位不符。' };
  }
  profile.equipped[slot] = id;
  return saveProfile(profile);
}

export function addEarnedCoins(amount) {
  const profile = loadProfile();
  profile.totalCoins = Math.min(Number.MAX_SAFE_INTEGER, profile.totalCoins + coins(amount));
  const result = saveProfile(profile);
  return { total: profile.totalCoins, saved: result.ok };
}
