import { FONT } from './sceneUi.js';
export const ART_WIDTH = 941;
export const ART_HEIGHT = 1672;
export const ax = x => x * 720 / ART_WIDTH;
export const ay = y => y * 1280 / ART_HEIGHT;
export function artBackground(scene, key) {
  return scene.add.image(0, 0, key, '__BASE').setOrigin(0).setDisplaySize(720, 1280);
}
export function artHotspot(scene, name, x, y, width, height, action) {
  const zone = scene.add.zone(ax(x + width / 2), ay(y + height / 2), ax(width), ay(height))
    .setName(name).setInteractive({ useHandCursor: true });
  const glow = scene.add.rectangle(zone.x, zone.y, zone.width, zone.height, 0xffffff, 0.12).setVisible(false);
  zone.on('pointerover', () => glow.setVisible(true));
  zone.on('pointerout', () => glow.setVisible(false));
  zone.on('pointerdown', action);
  return zone;
}
export function artLabel(scene, x, y, label, size = 24, color = '#ffffff') {
  return scene.add.text(ax(x), ay(y), label, {
    fontFamily: FONT, fontSize: size + 'px', fontStyle: 'bold', color, align: 'center',
    stroke: '#07172e', strokeThickness: 3,
  }).setOrigin(0.5);
}
export function artPanel(scene, x, y, width, height, fill = 0x081d43, alpha = 0.96) {
  return scene.add.rectangle(ax(x + width / 2), ay(y + height / 2), ax(width), ay(height), fill, alpha)
    .setStrokeStyle(2, 0x48cfff, 0.9);
}
