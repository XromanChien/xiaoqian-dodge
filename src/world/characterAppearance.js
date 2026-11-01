import { ITEM_BY_ID } from '../data/shopItems.js';
import { loadProfile } from '../storage/profileStorage.js';
import { FONT } from '../ui/sceneUi.js';

// 只建立顯示物件，不改動生命、碰撞範圍、換道或前進速度。
export function createCharacterAppearance(scene, profile = loadProfile()) {
  const outfit = ITEM_BY_ID[profile.equipped.outfit];
  const body = scene.add.rectangle(0, 0, 80, 120, outfit?.color ?? 0xffd166).setStrokeStyle(4, 0xffe6a6);
  const label = scene.add.text(0, 0, '小錢', { fontFamily: FONT, fontSize: '26px', fontStyle: 'bold', color: '#172132' }).setOrigin(0.5);
  const parts = [body, label];
  const head = ITEM_BY_ID[profile.equipped.head];
  if (head) {
    parts.push(scene.add.rectangle(0, -72, 70, 24, head.color));
    parts.push(scene.add.rectangle(10, -60, 100, 10, head.color));
  }
  const accessory = ITEM_BY_ID[profile.equipped.accessory];
  if (accessory) {
    parts.push(scene.add.rectangle(0, -42, 84, 15, accessory.color));
    parts.push(scene.add.rectangle(30, -22, 15, 38, accessory.color));
  }
  const shoes = ITEM_BY_ID[profile.equipped.shoes];
  if (shoes) {
    parts.push(scene.add.rectangle(-22, 53, 32, 14, shoes.color));
    parts.push(scene.add.rectangle(22, 53, 32, 14, shoes.color));
  }
  return scene.add.container(0, 0, parts);
}
