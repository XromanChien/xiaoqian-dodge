export const OBSTACLE_DRAWERS = {
  crate(shape) {
    shape.fillStyle(0xe66d58).fillRect(-45, -96, 90, 96);
    shape.fillStyle(0xffb080).fillPoints([{x:-45,y:-96},{x:-29,y:-112},{x:61,y:-112},{x:45,y:-96}], true);
    shape.fillStyle(0xad4d48).fillPoints([{x:45,y:-96},{x:61,y:-112},{x:61,y:-16},{x:45,y:0}], true);
    shape.fillStyle(0xffd8a0).fillRect(-45, -60, 90, 14);
  },
  cone(shape) {
    shape.fillStyle(0x543f39).fillRect(-48, -12, 96, 12);
    shape.fillStyle(0xff9854).fillTriangle(0, -110, -38, -12, 38, -12);
    shape.fillStyle(0xffedbf).fillPoints([{x:-12,y:-80},{x:12,y:-80},{x:19,y:-60},{x:-19,y:-60}], true);
  },
  barrier(shape) {
    shape.fillStyle(0x596d80).fillRect(-44, -80, 12, 80).fillRect(32, -80, 12, 80);
    shape.fillStyle(0xf2cc68).fillRect(-58, -100, 116, 56);
    shape.fillStyle(0x514b46);
    for (let x = -48; x < 50; x += 30) shape.fillRect(x, -95, 13, 46);
  },
};
