import { primaryButton } from '../ui/navigationUi.js';
import Phaser from 'phaser';
import { loadProfile, selectCharacter } from '../storage/profileStorage.js';
import { artBackground, artHotspot, artLabel, artPanel } from '../ui/artUi.js';

// UI crops use the original design's 941x1672 coordinate system.
function frame(scene, key, name, x, y, w, h) {
  const texture = scene.textures.get(key), source = texture.getSourceImage();
  if (!texture.has(name)) texture.add(name, 0,
    Math.round(x * source.width / 941), Math.round(y * source.height / 1672),
    Math.round(w * source.width / 941), Math.round(h * source.height / 1672));
  return name;
}
const CHARACTERS = [
  { id: 'xiaoqian', name: '小錢', art: 'character-art', intro: '來自台北的熱血少年小錢，\n動作靈活、反應超快，\n用閃身步穿越城市障礙！' },
  { id: 'kaka', name: '咔咔', art: 'kaka-character-art', intro: '咔咔綁著長長的雙辮，\n穿上水手服輕巧閃身，\n和小錢一起奔向終點！' },
];
export default class CharacterScene extends Phaser.Scene {
  constructor() { super('CharacterScene'); }
  create() {
    this.background = artBackground(this, 'character-art');
    artHotspot(this, 'back-menu', 14, 40, 198, 90, () => this.scene.start('MenuScene'));
    const openShop = () => {
      const result = selectCharacter(this.selectedCharacter);
      if (result.ok) this.scene.start('ShopScene'); else this.status.setText(result.message);
    };

    primaryButton(this,{name:'confirm-character-shop',y:1170,
      label:'外觀商店 ▶',action:openShop});
    // Remove baked-in cards and the permanently selected first-card arrow.
    const strip = frame(this, 'jinlongRoad-art', 'selection-strip', 0, 325, 941, 232);
    this.add.image(0, 249, 'jinlongRoad-art', strip).setOrigin(0).setDisplaySize(720, 178);
    const arrowCover = frame(this, 'jinlongRoad-art', 'arrow-cover', 65, 555, 100, 43);
    this.add.image(50, 425, 'jinlongRoad-art', arrowCover).setOrigin(0).setDisplaySize(77, 33);
    this.cards = [];
    for (let i = 0; i < 5; i++) this.createCard(i);
    // Keep the illustrated neon ability panel, replace its paragraph with live text.
    artPanel(this, 578, 1230, 310, 123, 0x071a36, 0.96);
    this.intro = this.add.text(450, 946, '', { fontFamily: 'system-ui, Microsoft JhengHei',
      fontSize: '18px', color: '#ffffff', lineSpacing: 9, wordWrap: { width: 225 } });
    artPanel(this, 555, 1375, 363, 40, 0x071a36, 0.94);
    artLabel(this, 736, 1395, '能力相同 · 能力條僅為展示', 17, '#bdefff');
    this.status = this.add.text(360,1245,'',{fontFamily:'system-ui',fontSize:'20px',color:'#ffcc99'}).setOrigin(.5);
    this.previewCharacter(loadProfile().character);
  }
  createCard(index) {
    const data = CHARACTERS[index], x = 22 + index * 139, y = 266, w = 122, h = 143;
    const points = [{x:x+13,y},{x:x+w-13,y},{x:x+w,y:y+13},{x:x+w,y:y+h-13},
      {x:x+w-13,y:y+h},{x:x+13,y:y+h},{x,y:y+h-13},{x,y:y+13}];
    this.add.graphics().fillStyle(0x102947).fillPoints(points,true);
    if (data) {
      const head = frame(this, data.art, 'card-portrait', 42, 340, 164, 154);
      // The headshot includes its original sunny street backdrop.
      this.add.image(x+w/2, y+57, data.art, head).setDisplaySize(w-12, 108);
    } else {
      const locked = frame(this, 'character-art', 'locked-'+index, 405+(index-2)*174, 350, 155, 125);
      this.add.image(x+w/2, y+57, 'character-art', locked).setDisplaySize(w-12, 108);
    }
    const band = this.add.rectangle(x+w/2, y+h-17, w-8, 28, 0x132742);
    this.add.text(x+w/2, y+h-17, data?.name ?? '敬請期待', { fontFamily:'system-ui',
      fontSize:data?'25px':'19px',fontStyle:'bold',color:'#ffffff',stroke:'#10243c',strokeThickness:3 }).setOrigin(0.5);
    const border = this.add.graphics().lineStyle(3,0x6485b4).strokePoints(points,true);
    const glow = this.add.graphics();
    for(const [width,alpha] of [[20,0.10],[12,0.18],[7,0.6],[3,1]])
      glow.lineStyle(width,0xffd33d,alpha).strokePoints(points,true);
    glow.lineStyle(1,0xffffdf,1).strokePoints(points,true);
    const arrow = this.add.triangle(x+w/2,y+h+15,0,12,12,0,24,12,0xffdf42).setStrokeStyle(2,0xffffd3);
    const tween = this.tweens.add({ targets:glow, alpha:0.55, duration:750, yoyo:true, repeat:-1 });
    this.cards.push({id:data?.id,band,border,glow,arrow,tween});
    if(data) this.add.zone(x+w/2,y+h/2,w,h).setName(data.id+'-card')
      .setInteractive({useHandCursor:true}).on('pointerdown',()=>this.previewCharacter(data.id));
  }
  previewCharacter(id) {
    const data = CHARACTERS.find(c=>c.id===id) ?? CHARACTERS[0];
    this.selectedCharacter = data.id;
    this.background.setTexture(data.art, '__BASE').setDisplaySize(720,1280);
    for(const card of this.cards) {
      const selected = card.id===data.id;
      card.glow.setVisible(selected); card.arrow.setVisible(selected);
      card.border.setVisible(!selected); card.band.setFillStyle(selected?0xb5770b:0x132742);
      if(selected) card.tween.resume(); else card.tween.pause();
    }
    this.intro.setText(data.intro);
    this.status.setText('');
  }
}


