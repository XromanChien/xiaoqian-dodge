// Shared home-style capsule skin and feedback. All coordinates are game pixels.
export function neonButton(scene,{name,x,y,width=360,height=100,label,action,tone='gold',fontSize=30,disabled=false}) {
  const skin=scene.add.image(x,y,'neon-buttons',tone).setDisplaySize(width,height);
  const text=scene.add.text(x,y,label,{fontFamily:'system-ui, Microsoft JhengHei',fontSize:fontSize+'px',fontStyle:'bold',
    color:'#ffffff',stroke:tone==='gold'?'#702000':'#041c68',strokeThickness:Math.max(2,fontSize/9)}).setOrigin(.5);
  const zone=scene.add.zone(x,y,width*.92,Math.max(72,height*.82)).setName(name);
  if(disabled){skin.setAlpha(.5);text.setAlpha(.65);}else{
    zone.setInteractive({useHandCursor:true});
    zone.on('pointerover',()=>skin.setTint(0xfff2c7));
    zone.on('pointerout',()=>skin.clearTint());
    zone.on('pointerdown',()=>{skin.setTint(0xffdf91);action?.();});
    zone.on('pointerup',()=>skin.clearTint());
  }
  return zone;
}

