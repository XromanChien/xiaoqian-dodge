import { ITEM_BY_ID } from '../data/shopItems.js';
import { EQUIPMENT_ANCHORS } from '../data/equipmentAnchors.js';

// Code-native cosmetic layers: retain the underlying sprite's fabric shading.
// Only rebuilt on pose changes; no textures, timers or per-frame allocations accumulate.
export default class EquipmentRenderer {
  constructor(scene, rig, sprite, profile, anchors = EQUIPMENT_ANCHORS) {
    this.anchors = anchors;
    this.sprite = sprite;
    this.items = Object.fromEntries(Object.entries(profile.equipped).map(([slot,id])=>[slot,ITEM_BY_ID[id]]));
    this.root = scene.add.container();
    this.fabric = scene.add.graphics().setBlendMode('MULTIPLY');
    this.details = scene.add.graphics();
    this.root.add([this.fabric,this.details]);
    rig.add(this.root);
  }
  draw(pose) {
    const a = this.anchors[pose] || this.anchors.run;
    const s = this.sprite, f = this.fabric, g = this.details;
    f.clear(); g.clear();
    this.root.setPosition((s.flipX ? s.width-s.displayOriginX : -s.displayOriginX)*s.scaleX, -s.displayOriginY*s.scaleY);
    this.root.setScale((s.flipX?-1:1)*s.width*s.scaleX/1000,s.height*s.scaleY/1000);
    const poly=(graphics,points,color,alpha=1)=>graphics.fillStyle(color,alpha).fillPoints(points.map(([x,y])=>({x:x*1000,y:y*1000})),true);
    const {outfit,shoes,head,accessory}=this.items;
    if(outfit){
      // Inset panels stay inside the shirt silhouette; original sleeves and folds remain visible.
      const center = a.shirt.reduce((c,p)=>[c[0]+p[0]/a.shirt.length,c[1]+p[1]/a.shirt.length],[0,0]);
      const panel = a.shirt.map(([x,y])=>[center[0]+(x-center[0])*.78,center[1]+(y-center[1])*.88]);
      poly(f,panel,outfit.color,.88);
      // Small tailoring accents keep the original folds, strap and bag readable.
      const [nx,ny]=a.neck;
      g.lineStyle(3,0xffffff,.38).lineBetween((nx-.09)*1000,(ny+.025)*1000,(nx+.07)*1000,(ny+.045)*1000);
      if(outfit.id==='street-outfit'){
        poly(g,[[nx-.17,ny+.09],[nx-.12,ny+.06],[nx-.07,ny+.12],[nx-.12,ny+.14]],0xf4f4f4,.8);
      }else if(outfit.id==='magic-outfit'){
        g.lineStyle(4,0xe2be73,.85).lineBetween((nx-.10)*1000,(ny+.05)*1000,(nx-.04)*1000,(ny+.16)*1000);
        g.fillStyle(0xe8c785).fillCircle((nx-.06)*1000,(ny+.12)*1000,4);
      }else if(outfit.id==='smile-hoodie'){
        g.fillStyle(0xe8b52c,.85).fillEllipse(nx*1000,(ny+.035)*1000,145,50);
        g.lineStyle(3,0xffe791,.8).strokeEllipse(nx*1000,(ny+.035)*1000,145,50);
      }
    }
    if(shoes)for(const [x,y,w,h] of a.shoes){
      f.fillStyle(shoes.color,.92).fillEllipse(x*1000,y*1000,w*1000,h*1000);
      g.lineStyle(4,0xffffff,.85).lineBetween((x-w*.3)*1000,(y+h*.24)*1000,(x+w*.3)*1000,(y+h*.24)*1000);
    }
    if(accessory){
      const [bx,by]=a.bag, x=bx*1000,y=by*1000;
      if(accessory.id==='red-scarf'){
        const [nx,ny]=a.neck;
        poly(g,[[nx-.10,ny],[nx+.06,ny],[nx+.08,ny+.025],[nx-.10,ny+.025]],0xff795e);
        poly(g,[[nx-.08,ny+.02],[nx-.23,ny+.12],[nx-.19,ny+.06],[nx-.12,ny+.015]],0xdd4b39);
      }else if(accessory.id==='cube-charm'){
        g.lineStyle(4,0xd9c595).lineBetween(x,y,x+16,y+45);
        const cx=x+16,cy=y+48;
        g.fillStyle(0x122332).fillRoundedRect(cx-28,cy-10,59,59,5);
        const colors=[0xffd643,0xf14c42,0x4dc5df,0x69d681,0xffffff,0xffa837,0x4dc5df,0xffd643,0x69d681];
        colors.forEach((c,i)=>g.fillStyle(c).fillRect(cx-24+(i%3)*18,cy-6+Math.floor(i/3)*18,15,15));
      }else if(accessory.id==='microphone'){
        g.lineStyle(18,0x202733).lineBetween(x+8,y+16,x+28,y-53);
        g.lineStyle(7,0xcba459).lineBetween(x+8,y+16,x+19,y-22);
        g.fillStyle(0xc3cad4).fillEllipse(x+30,y-63,42,38);
        g.lineStyle(3,0x4e596a,.9);
        for(let i=-10;i<=10;i+=10)g.lineBetween(x+13,y-63+i,x+46,y-63+i);
      }else if(accessory.id==='shoulder-bag'){
        // Upgrade the bag already painted on the character instead of adding a second bag.
        g.lineStyle(4,0xd5b877,.85).strokeRoundedRect(x-47,y-22,91,57,12);
        g.fillStyle(0xf4d98d).fillCircle(x+44,y-9,6);
        g.fillStyle(0xc8d3e5,.8).fillTriangle(x-10,y-4,x+8,y-4,x,y+13);
      }
    }
    if(head){
      // Preserve circular/rounded proportions despite portrait-frame normalization.
      g.save();
      g.translateCanvas(a.head[0]*1000,a.head[1]*1000);
      g.scaleCanvas(1,s.width/s.height);
      this.drawHat(g,[0,0,a.head[2]],head);
      g.restore();
    }
  }
  drawHat(g,[cx,cy,width],item){
    const x=cx*1000,y=cy*1000,w=width*1000;
    g.fillStyle(0x101722,.28).fillEllipse(x,y+w*.24,w*1.08,w*.25);
    if(item.id==='magic-hat'){
      g.fillStyle(0x181c29).fillEllipse(x,y+w*.28,w*1.42,w*.24);
      g.fillStyle(0x292536).fillRoundedRect(x-w*.47,y-w*.58,w*.94,w*.86,12);
      g.fillStyle(0x514861).fillEllipse(x,y-w*.56,w*.94,w*.22);
      g.fillStyle(0xae2249).fillRect(x-w*.47,y+w*.08,w*.94,w*.14);
      g.lineStyle(3,0xe8b465,.8).lineBetween(x-w*.44,y+w*.22,x+w*.44,y+w*.22);
    }else if(item.id==='yellow-bucket'){
      g.fillStyle(0xb88420).fillEllipse(x,y+w*.25,w*1.45,w*.36);
      g.fillStyle(item.color).fillRoundedRect(x-w*.46,y-w*.25,w*.92,w*.54,20);
      g.fillStyle(0xffe88d).fillEllipse(x,y-w*.24,w*.9,w*.23);
      g.lineStyle(3,0xf6e3a5,.7).strokeEllipse(x,y+w*.26,w*1.34,w*.22);
    }else if(item.id==='blue-beanie'){
      g.fillStyle(0x2149a8).fillEllipse(x,y,w*1.06,w*.83);
      g.fillStyle(item.color).fillRoundedRect(x-w*.53,y+w*.08,w*1.06,w*.25,13);
      g.lineStyle(3,0x82aeff,.6);
      for(let i=-4;i<=4;i++)g.lineBetween(x+i*w*.10,y-w*.25,x+i*w*.10,y+w*.28);
      g.fillStyle(0xffd64b).fillCircle(x+w*.20,y+w*.17,w*.10);
      g.fillStyle(0x152957).fillCircle(x+w*.17,y+w*.15,3).fillCircle(x+w*.23,y+w*.15,3);
    }else{
      g.fillStyle(item.color).fillEllipse(x,y,w*1.03,w*.72);
      g.fillStyle(0xffffff,.15).fillEllipse(x-w*.16,y-w*.12,w*.6,w*.34);
      g.fillStyle(0x101c32,.6).fillRoundedRect(x-w*.20,y+w*.12,w*.4,w*.16,8);
      g.lineStyle(3,0xffffff,.5).lineBetween(x,y-w*.30,x,y+w*.08);
      g.fillStyle(0xe7d7b5).fillRoundedRect(x-w*.13,y+w*.22,w*.26,w*.055,3);
      g.fillStyle(item.color).fillEllipse(x,y-w*.34,w*.10,w*.06);
    }
  }
}
