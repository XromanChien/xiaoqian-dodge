export const FONT = 'system-ui, "Microsoft JhengHei", sans-serif';
export function text(scene, x, y, value, size = 30, color = '#ffffff') {
  return scene.add.text(x, y, value, { fontFamily: FONT, fontSize: size + 'px', color, align: 'center' }).setOrigin(0.5);
}
export function button(scene, x, y, width, label, action, { disabled = false, name = label } = {}) {
  const background = scene.add.rectangle(x, y, width, 76, disabled ? 0x354354 : 0xffd166).setName(name);
  text(scene, x, y, label, 26, disabled ? '#9ba9b9' : '#172132');
  if (!disabled) {
    background.setInteractive({ useHandCursor: true });
    background.on('pointerover', () => background.setFillStyle(0xffe09a));
    background.on('pointerout', () => background.setFillStyle(0xffd166));
    background.on('pointerdown', action);
  }
  return background;
}
