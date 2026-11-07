import { primaryButton } from '../ui/navigationUi.js';
import { neonButton } from '../ui/neonButton.js';
import Phaser from 'phaser';
import { SHOP_ITEMS, ITEM_BY_ID, EQUIPMENT_SLOTS } from '../data/shopItems.js';
import { SHOP_ART_CARDS } from '../data/shopArtLayout.js';
import { loadProfile, purchaseItem, equipItem } from '../storage/profileStorage.js';
import { createCharacterAppearance } from '../world/characterAppearance.js';
const FONT = 'system-ui, Microsoft JhengHei';
export default class ShopScene extends Phaser.Scene {
  constructor() { super('ShopScene'); }
  text(x,y,text,size=24,color='#ffffff') { return this.add.text(x,y,text,{fontFamily:FONT,fontSize:size+'px',color,align:'center'}).setOrigin(.5); }
  button(name,x,y,w,h,label,action,color=0x164d79,disabled=false) {
    return neonButton(this,{name,x,y,width:w,height:h,label,action,disabled,
      tone:[0xbb7c0b,0x97620b,0x745315].includes(color)?'gold':'blue',fontSize:h<50?19:24});
  }
  create({category='head',page=0,message=''}={}) {
    this.profile=loadProfile(); this.category=category; this.page=page;
    this.add.image(360,640,'shop-background','__BASE').setDisplaySize(720,1280);
    this.button('back-character',76,47,140,65,'‹ 選角色',()=>this.scene.start('CharacterScene'));
    this.add.graphics().fillStyle(0x061e50,.92).fillRoundedRect(496,25,204,50,22).lineStyle(2,0x4fdcff).strokeRoundedRect(496,25,204,50,22);
    this.text(598,50,'金幣 '+this.profile.totalCoins,24,'#ffe16b');
    this.preview=createCharacterAppearance(this,this.profile).setPosition(315,625).setScale(1.8);
    this.preview.setRunFrame(0);
    this.add.graphics().fillStyle(0x071d4c,.86).fillRoundedRect(472,255,225,295,20).lineStyle(2,0x66dfff).strokeRoundedRect(472,255,225,295,20);
    this.text(585,279,this.profile.character==='kaka'?'咔咔':'小錢',32,'#ffe16b');
    this.text(585,320,'目前穿搭',21,'#bdefff');
    EQUIPMENT_SLOTS.forEach((slot,i)=>{
      const id=this.profile.equipped[slot.id];
      this.text(585,357+i*32,slot.name+'：'+(ITEM_BY_ID[id]?.name??'預設'),17);
    });
    this.add.graphics().fillStyle(0x061e50,.9).fillRoundedRect(35,655,650,40,18);
    this.text(360,675,message||'道具共用 · 穿搭分開保存 · 外觀不影響能力',19,'#e1f7ff').setWordWrapWidth(620);
    EQUIPMENT_SLOTS.forEach((slot,i)=>this.button('tab-'+slot.id,65+i*118,729,112,60,slot.name,
      ()=>this.scene.restart({category:slot.id}),category===slot.id?0x97620b:0x123653));
    const choices=[{id:null,slot:category,name:'預設外觀',price:0},...SHOP_ITEMS.filter(item=>item.slot===category)];
    const pages=Math.max(1,Math.ceil(choices.length/6)); this.page=Math.min(page,pages-1);
    choices.slice(this.page*6,this.page*6+6).forEach((item,i)=>this.itemCard(item,i));
    this.text(360,1157,(this.page+1)+' / '+pages,20);
    if(pages>1){
      this.button('previous-page',215,1157,120,52,'上一頁',()=>this.scene.restart({category,page:(this.page+pages-1)%pages}));
      this.button('next-page',505,1157,120,52,'下一頁',()=>this.scene.restart({category,page:(this.page+1)%pages}));
    }
    primaryButton(this,{name:'start-game',y:1220,label:'開始遊戲 ▶',action:()=>this.scene.start('GameScene')});
  }
  itemCard(item,index) {
    const x=126+index%3*234,y=853+Math.floor(index/3)*197;
    const equipped=this.profile.equipped[item.slot]===item.id;
    const g=this.add.graphics();
    for(const [width,alpha] of [[10,.12],[5,.35],[2,1]]) g.lineStyle(width,equipped?0xffdf67:0x62baff,alpha).strokeRoundedRect(x-106,y-94,212,188,18);
    g.fillStyle(0x102a69,.90).fillRoundedRect(x-105,y-93,210,186,18);
    const card=SHOP_ART_CARDS.find(c=>c.id===item.id&&(item.id||c.slot===item.slot));
    if(card){
      const tex=this.textures.get('shop-art'),source=tex.getSourceImage(),name='product-'+(item.id??item.slot);
      if(!tex.has(name))tex.add(name,0,Math.round((card.x+8)*source.width/941),Math.round((card.y+6)*source.height/1672),
        Math.round((card.w-16)*source.width/941),Math.round(Math.min(110,card.h-110)*source.height/1672));
      this.add.image(x,y-43,'shop-art',name).setDisplaySize(152,87);
    }else this.text(x,y-45,item.id?'✦':'—',46,'#8cdfff');
    this.text(x,y+17,item.name,20);
    const owned=!item.id||this.profile.ownedItems.includes(item.id);
    this.text(x,y+45,owned?'已擁有':item.price+' 金幣',18,'#ffe16b');
    this.button('item-'+(item.id??'default'),x,y+74,196,38,equipped?'✓ 裝備中':owned?'裝備':this.profile.totalCoins<item.price?'金幣不足':'購買',()=>{
      if(equipped)return;
      const result=owned?equipItem(item.slot,item.id):purchaseItem(item.id);
      this.scene.restart({category:this.category,page:this.page,message:result.ok?(owned?'已裝備 ':'已購買，點裝備穿上：')+item.name:result.message});
    },equipped?0x12699b:0x745315,equipped||(!owned&&this.profile.totalCoins<item.price));
  }
  update(time) { if(this.preview) this.preview.setRunFrame(Math.floor(time/180)%4); }
}

