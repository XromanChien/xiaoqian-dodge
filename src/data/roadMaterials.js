// 與 stages.js 的 backgroundKey 對應；僅控制道路外觀，不改變跑道或速度。
// 色彩使用 RGB 整數，讓轉場可逐欄混色；marking 控制公路白線。
export const ROAD_MATERIALS = Object.freeze({
  jinlongRoad:      { base: 0x82888b, light: 0xa7abad, shadow: 0x687278, line: 0xfff7dd, shoulder: 0xb7aca0, type: 'asphalt', marking: true },
  jinlongTunnel:    { base: 0x847966, light: 0xb4a183, shadow: 0x5e584f, line: 0xffe5a8, shoulder: 0xa29579, type: 'asphalt', marking: true },
  miramar:          { base: 0x939497, light: 0xbab9b5, shadow: 0x73777f, line: 0xfff4da, shoulder: 0xbab0a0, type: 'asphalt', marking: true },
  dazhiBridge:      { base: 0x91999d, light: 0xbac0be, shadow: 0x707e88, line: 0xfff9e7, shoulder: 0xb8bdba, type: 'asphalt', marking: true },
  grandHotel:       { base: 0xa39787, light: 0xc6b9a4, shadow: 0x7e786e, line: 0xffedc5, shoulder: 0xb9ab8f, type: 'paving', marking: false },
  shilinMarket:     { base: 0x625c63, light: 0x998b84, shadow: 0x393f4d, line: 0xe9c79a, shoulder: 0x817472, type: 'paving', marking: false },
  tamsuiMetro:      { base: 0x92989a, light: 0xb7bbb4, shadow: 0x6f7a80, line: 0xfff5d9, shoulder: 0xb7ae94, type: 'asphalt', marking: true },
  zhoumeiExpressway:{ base: 0x8a959d, light: 0xafbac0, shadow: 0x697884, line: 0xffffea, shoulder: 0xb5b4a9, type: 'asphalt', marking: true },
  tamsuiLightRail:  { base: 0xa29783, light: 0xc8bca2, shadow: 0x7b7b70, line: 0xffefd0, shoulder: 0xbcae8e, type: 'paving', marking: false },
  fishermansWharf:  { base: 0xa17850, light: 0xd2a46c, shadow: 0x6f5845, line: 0xffdf9c, shoulder: 0xb99161, type: 'wood', marking: false },
  danjiangBridge:   { base: 0x8f99a0, light: 0xb7bec0, shadow: 0x6c7a87, line: 0xfff5d9, shoulder: 0xb6b6ad, type: 'asphalt', marking: true },
  baliOldStreet:    { base: 0xb19572, light: 0xd9bb8b, shadow: 0x84745e, line: 0xffe3af, shoulder: 0xc6a679, type: 'paving', marking: false },
});
