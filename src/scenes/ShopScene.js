import Phaser from 'phaser';
import { ITEM_BY_ID, EQUIPMENT_SLOTS } from '../data/shopItems.js';
import { SHOP_ART_CARDS } from '../data/shopArtLayout.js';
import { loadProfile, purchaseItem, equipItem } from '../storage/profileStorage.js';
import { artBackground, artHotspot, artLabel, artPanel, ax, ay } from '../ui/artUi.js';

export default class ShopScene extends Phaser.Scene {
  constructor() { super('ShopScene'); }
  create({ message = '', selected = 'default-head', category = 'all', equipment = false } = {}) {
    this.profile = loadProfile();
    this.selected = selected;
    this.category = category;
    artBackground(this, 'shop-art');
    artHotspot(this, 'back-menu', 38, 33, 95, 77, () => this.scene.start('MenuScene'));
    // 原圖餘額與加號由真實餘額及裝備管理入口取代，不提供充值。
    artPanel(this, 700, 34, 147, 57, 0x071e4c, 1);
    artLabel(this, 773, 64, this.profile.totalCoins.toLocaleString(), 27);
    artPanel(this, 851, 34, 61, 57, 0x112f60, 1);
    artLabel(this, 882, 63, '裝備', 16);
    artHotspot(this, 'equipment', 851, 34, 61, 57, () => this.refresh({ equipment: true }));
    artHotspot(this, 'character-select', 768, 314, 129, 130, () => this.scene.start('CharacterScene'));
    ['street-cap', 'magic-hat', 'blue-beanie'].forEach((id, i) => {
      artHotspot(this, 'preview-' + id, 770, 456 + i * 105, 125, 97, () => this.refresh({ selected: id }));
    });
    this.cards = SHOP_ART_CARDS.map(card => ({ ...card, ...(card.id ? ITEM_BY_ID[card.id] : {}), key: card.id ?? 'default-' + card.slot }));
    const selectedCard = this.cards.find(card => card.key === selected) ?? this.cards[0];
    artPanel(this, 640, 790, 270, 74, 0x09204c, 1);
    artLabel(this, 775, 810, selectedCard.name, 18, '#bdefff');
    artLabel(this, 775, 842, this.actionLabel(selectedCard), 23, '#ffe570');
    artHotspot(this, 'selected-action', 640, 790, 270, 74, () => this.act(selectedCard));
    // 清除原圖固定的帽子高亮，改為真正的分類按鈕。
    const tabs = [{id:'head',name:'帽子'}, {id:'outfit',name:'上衣'}, {id:'bottoms',name:'下裝'},
      {id:'shoes',name:'鞋子'}, {id:'accessory',name:'配件'}, {id:'effect',name:'特效'}];
    tabs.forEach((tab, i) => {
      const x = 18 + i * 153;
      artPanel(this, x, 887, 145, 72, category === tab.id ? 0x725716 : 0x082656, 1);
      artLabel(this, x + 72, 924, tab.name, 25, category === tab.id ? '#ffe570' : '#ffffff');
      artHotspot(this, 'tab-' + tab.id, x, 887, 145, 72,
        () => this.refresh({ category: category === tab.id ? 'all' : tab.id }));
    });
    for (const card of this.cards) {
      const active = category === 'all' || category === card.slot;
      const key = card.key;
      // 圖案與名稱沿用原圖；價格與按鈕狀態由存檔即時計算。
      artPanel(this, card.x + 6, card.y + card.h - 77, card.w - 12, 72, 0x081b42, 1);
      artLabel(this, card.x + card.w / 2, card.y + card.h - 61,
        card.id ? card.price.toLocaleString() + ' 金幣' : '預設外觀', 16, '#ffe570');
      const equipped = this.profile.equipped[card.slot] === card.id;
      artPanel(this, card.x + 9, card.y + card.h - 43, card.w - 18, 34, equipped ? 0x086bbd : 0x80601c, 1);
      artLabel(this, card.x + card.w / 2, card.y + card.h - 26, this.actionLabel(card), 18);
      if (!active) {
        this.add.rectangle(ax(card.x + card.w/2), ay(card.y + card.h/2), ax(card.w), ay(card.h), 0x051122, 0.75);
      } else {
        artHotspot(this, 'select-' + key, card.x, card.y, card.w, card.h - 80, () => this.refresh({ selected: key }));
        artHotspot(this, 'action-' + key, card.x + 8, card.y + card.h - 44, card.w - 16, 38, () => this.act(card));
      }
      if (selected === key) this.add.rectangle(ax(card.x+card.w/2),ay(card.y+card.h/2),ax(card.w),ay(card.h))
        .setFillStyle(0xffffff, 0).setStrokeStyle(3, 0xffed88);
    }
    const hint = message || (['bottoms','effect'].includes(category) ? '此分類敬請期待 · 再點一次可顯示全部' : '外觀不影響能力 · 點分類可篩選，再點恢復全部');
    artPanel(this, 30, 742, 590, 46, 0x061832, 0.92);
    artLabel(this, 325, 765, hint, 16).setWordWrapWidth(ax(560));
    if (equipment) this.showEquipment(message);
  }

  actionLabel(card) {
    if (this.profile.equipped[card.slot] === card.id) return '裝備中';
    if (!card.id || this.profile.ownedItems.includes(card.id)) return '裝備';
    return this.profile.totalCoins >= card.price ? '購買' : '金幣不足';
  }

  act(card) {
    const owned = !card.id || this.profile.ownedItems.includes(card.id);
    const result = owned ? equipItem(card.slot, card.id) : purchaseItem(card.id);
    this.refresh({ selected: card.key, message: result.ok
      ? owned ? '已裝備 ' + card.name : '已購買 ' + card.name + '，再點一次裝備'
      : result.message });
  }

  refresh(data = {}) {
    this.scene.restart({ selected: this.selected, category: this.category, ...data });
  }

  showEquipment(message) {
    // 最上層輸入遮罩，避免操作裝備時誤觸下方商品。
    this.add.rectangle(360, 640, 720, 1280, 0x020b19, 0.9).setInteractive();
    artPanel(this, 60, 260, 821, 1030, 0x0b2042, 1);
    artLabel(this, 470, 330, '我的裝備', 36, '#ffe570');
    artLabel(this, 470, 395, '包含舊版已購買道具 · 僅影響外觀', 20);
    EQUIPMENT_SLOTS.forEach((slot, index) => {
      const y = 500 + index * 112;
      const current = this.profile.equipped[slot.id];
      artLabel(this, 400, y, slot.name + '：' + (ITEM_BY_ID[current]?.name ?? '預設外觀'), 23);
      const choices = [null, ...this.profile.ownedItems.filter(id => ITEM_BY_ID[id].slot === slot.id)];
      artPanel(this, 670, y-33, 140, 66);
      artLabel(this, 740, y, choices.length > 1 ? '切換' : '預設', 23);
      if (choices.length > 1) artHotspot(this, 'equip-' + slot.id, 670, y-33, 140, 66, () => {
        const result = equipItem(slot.id, choices[(choices.indexOf(current)+1)%choices.length]);
        this.refresh({ equipment: true, message: result.ok ? '裝備已更新' : result.message });
      });
    });
    artLabel(this, 470, 1135, message || '點選切換可循環穿戴／卸下', 18).setWordWrapWidth(570);
    artPanel(this, 320, 1190, 300, 70, 0x175b90);
    artLabel(this, 470, 1225, '返回商店', 26);
    artHotspot(this, 'close-equipment', 320, 1190, 300, 70, () => this.refresh());
  }
}
