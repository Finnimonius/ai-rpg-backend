export const CONSUMABLES = {
  HEALTH_POTION: {
    id: 'health_potion',
    name: 'Зелье Здоровья',
    type: 'consumable' as const,
    rarity: 'common' as const,
    value: 25,
    requiredLevel: 1,
    effect: { type: 'HEAL' as const, value: 50 }
  },

  MANA_POTION: {
    id: 'mana_potion',
    name: 'Зелье Маны',
    type: 'consumable' as const,
    rarity: 'common' as const,
    value: 30,
    requiredLevel: 1,
    effect: { type: 'MANA_RESTORE' as const, value: 30 }
  },

  BASIC_FOOD: {
    id: 'basic_food',
    name: 'Простая Еда',
    type: 'consumable' as const,
    rarity: 'common' as const,
    value: 5,
    requiredLevel: 1,
    effect: { type: 'OUT_OF_COMBAT_HEAL' as const, value: 20 }
  }
};