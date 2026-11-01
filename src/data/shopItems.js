export const EQUIPMENT_SLOTS = [
  { id: 'head', name: '頭部' },
  { id: 'outfit', name: '服裝' },
  { id: 'bottoms', name: '下裝' },
  { id: 'shoes', name: '鞋子' },
  { id: 'accessory', name: '配件' },
  { id: 'effect', name: '特效' },
];
// 只有外觀資料，沒有速度、生命或其他能力加成。
export const SHOP_ITEMS = [
  { id: 'street-cap', name: '潮流棒球帽', slot: 'head', price: 880, color: 0xe62d44 },
  { id: 'magic-hat', name: '魔術師禮帽', slot: 'head', price: 1280, color: 0x292536 },
  { id: 'blue-beanie', name: '毛線針織帽', slot: 'head', price: 980, color: 0x356fee },
  { id: 'yellow-bucket', name: '黃色漁夫帽', slot: 'head', price: 980, color: 0xffce41 },
  { id: 'street-outfit', name: '街頭跑者', slot: 'outfit', price: 1280, color: 0xc62740 },
  { id: 'magic-outfit', name: '魔術師外套', slot: 'outfit', price: 1580, color: 0x322b44 },
  { id: 'smile-hoodie', name: '笑臉連帽T', slot: 'outfit', price: 1280, color: 0xffcd42 },
  { id: 'black-sneakers', name: '黑白運動鞋', slot: 'shoes', price: 880, color: 0x343847 },
  { id: 'shoulder-bag', name: '斜背包', slot: 'accessory', price: 980, color: 0x393346 },
  { id: 'microphone', name: '主持麥克風', slot: 'accessory', price: 1280, color: 0xd3ae66 },
  { id: 'cube-charm', name: '魔方吊飾', slot: 'accessory', price: 880, color: 0x64c983 },

  { id: 'mint-cap', name: '薄荷帽', slot: 'head', price: 50, color: 0x68d5bc },
  { id: 'blue-outfit', name: '晴空上衣', slot: 'outfit', price: 80, color: 0x71baff },
  { id: 'rose-outfit', name: '玫瑰上衣', slot: 'outfit', price: 80, color: 0xef9aaa },
  { id: 'red-scarf', name: '珊瑚圍巾', slot: 'accessory', price: 100, color: 0xff795e },
];
export const ITEM_BY_ID = Object.fromEntries(SHOP_ITEMS.map(item => [item.id, item]));
