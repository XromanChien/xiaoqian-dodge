// 距離單位：m；baseSpeed 單位：m/s。關卡與路段由資料定義，速度為可調整的原型值。
const definitions = [
  { id: 1, name: '金龍路', length: 200, baseSpeed: 18, obstacleTypes: ['crate'], backgroundKey: 'jinlongRoad', exitTurn: 'right' },
  { id: 2, name: '金龍隧道', length: 200, baseSpeed: 19, obstacleTypes: ['crate', 'cone'], backgroundKey: 'jinlongTunnel',
    sections: [
      { name: '隧道前道路', startOffset: 0, endOffset: 27, backgroundKey: 'jinlongRoad' },
      { name: '隧道內', startOffset: 27, endOffset: 200, backgroundKey: 'jinlongTunnel' },
    ] },
  { id: 3, name: '美麗華', length: 300, baseSpeed: 20, obstacleTypes: ['cone', 'barrier'], backgroundKey: 'miramar' },
  { id: 4, name: '大直橋', length: 400, baseSpeed: 21, obstacleTypes: ['barrier', 'cone'], backgroundKey: 'dazhiBridge' },
  { id: 5, name: '圓山飯店', length: 500, baseSpeed: 22, obstacleTypes: ['crate', 'barrier'], backgroundKey: 'grandHotel' },
  { id: 6, name: '士林夜市', length: 600, baseSpeed: 23, obstacleTypes: ['crate', 'cone'], backgroundKey: 'shilinMarket' },
  { id: 7, name: '捷運淡水線', length: 700, baseSpeed: 24, obstacleTypes: ['barrier', 'crate'], backgroundKey: 'tamsuiMetro' },
  { id: 8, name: '洲美快速道路', length: 800, baseSpeed: 25, obstacleTypes: ['cone', 'barrier'], backgroundKey: 'zhoumeiExpressway' },
  { id: 9, name: '淡水輕軌', length: 900, baseSpeed: 26, obstacleTypes: ['barrier', 'cone'], backgroundKey: 'tamsuiLightRail' },
  { id: 10, name: '漁人碼頭', length: 1000, baseSpeed: 27, obstacleTypes: ['crate', 'cone'], backgroundKey: 'fishermansWharf' },
  { id: 11, name: '淡江大橋', length: 900, baseSpeed: 28, obstacleTypes: ['barrier', 'cone'], backgroundKey: 'danjiangBridge' },
  { id: 12, name: '八里老街', length: 500, baseSpeed: 24, obstacleTypes: ['crate', 'barrier'], backgroundKey: 'baliOldStreet' },
];

let startDistance = 0;
export const STAGES = Object.freeze(definitions.map(definition => {
  const stage = Object.freeze({ ...definition,
    sections: definition.sections ? Object.freeze(definition.sections.map(section => Object.freeze(section))) : undefined,
    obstacleTypes: Object.freeze([...definition.obstacleTypes]),
    startDistance, endDistance: startDistance + definition.length });
  startDistance = stage.endDistance;
  return stage;
}));
export const TOTAL_DISTANCE = startDistance;
if (TOTAL_DISTANCE !== 7000) throw new Error('關卡總長必須為 7000m');
export default STAGES;
