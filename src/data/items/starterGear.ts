import { ClassConfig, ClassId } from "../../types/character.types";

export const STARTER_WEAPONS = {
  DAGGER: {
    id: 'starter_dagger',
    name: 'Базовый Кинжал',
    type: 'weapon' as const,
    rarity: 'legendary' as const,
    value: 15,
    requiredLevel: 1,
    damage: { min: 4, max: 8 },
    stats: { dexterity: 1 },
    weaponType: 'dagger'
  }
};

export const STARTER_ARMOR = {
  LEATHER_CAP: {
    id: 'leather_cap',
    name: 'Кожаный Капюшон',
    type: 'armor' as const,
    rarity: 'common' as const,
    value: 15,
    requiredLevel: 1,
    defense: 3,
    stats: { dexterity: 1 },
    armorType: 'light',
    slot: 'helmet' as const
  },

  LEATHER_ARMOR: {
    id: 'leather_armor',
    name: 'Кожаный Доспех',
    type: 'armor' as const,
    rarity: 'uncommon' as const,
    value: 35,
    requiredLevel: 1,
    defense: 6,
    stats: { dexterity: 2 },
    armorType: 'light',
    slot: 'chest' as const
  },

  LEATHER_GLOVES: {
    id: 'leather_gloves',
    name: 'Кожаные Перчатки',
    type: 'armor' as const,
    rarity: 'rare' as const,
    value: 12,
    requiredLevel: 1,
    defense: 2,
    stats: { dexterity: 1 },
    armorType: 'light',
    slot: 'gloves' as const
  },

  LEATHER_PANTS: {
    id: 'leather_pants',
    name: 'Кожаные Штаны',
    type: 'armor' as const,
    rarity: 'common' as const,
    value: 20,
    requiredLevel: 1,
    defense: 3,
    stats: { dexterity: 1 },
    armorType: 'light',
    slot: 'legs' as const
  },

  LEATHER_BOOTS: {
    id: 'leather_boots',
    name: 'Кожаные Сапоги',
    type: 'armor' as const,
    rarity: 'epic' as const,
    value: 18,
    requiredLevel: 1,
    defense: 2,
    stats: { dexterity: 1 },
    armorType: 'light',
    slot: 'boots' as const
  }
};

export const STARTER_ACCESORIES = {
    SUN_RING: {
      id: 'sun_ring',
      name: 'Кольцо солнца',
      type: 'accessory' as const,
      rarity: 'legendary' as const,
      value: 20,
      requiredLevel: 1,
      stats: {dexterity: 1, wisdom: 2, luck: 2},
      slot: 'ring' as const,
    },
    RING_WITH_SEAL: {
      id: 'ring_with_seal',
      name: 'Кольцо с печатью',
      type: 'accessory' as const,
      rarity: 'rare' as const,
      value: 22,
      requiredLevel: 1,
      stats: {intelligence: 2, wisdom: 1},
      slot: 'ring' as const,
    },
    STORM_AMULET: {
      id: 'storm_amulet',
      name: 'Амулет бури',
      type: 'accessory' as const,
      rarity: 'epic' as const,
      value: 22,
      requiredLevel: 1,
      damage: { min: 1, max: 1 },
      stats: {strength: 2, intelligence: 2},
      slot: 'amulet' as const,
    },
}

export const STARTER_CONSUMABLES = {
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

export const classConfigs: Record<ClassId, ClassConfig> = {
  // === СЕРЫЙ СТРАННИК ===
  grey_wanderer: {
    equipment: {
      weapon_mainId: STARTER_WEAPONS.DAGGER.id,
      weapon_offId: STARTER_WEAPONS.DAGGER.id,
      helmetId: STARTER_ARMOR.LEATHER_CAP.id,
      chestId: STARTER_ARMOR.LEATHER_ARMOR.id,
      glovesId: STARTER_ARMOR.LEATHER_GLOVES.id,
      legsId: STARTER_ARMOR.LEATHER_PANTS.id,
      bootsId: STARTER_ARMOR.LEATHER_BOOTS.id,
      ring_1Id: STARTER_ACCESORIES.SUN_RING.id,   
      ring_2Id: STARTER_ACCESORIES.RING_WITH_SEAL.id,   
      amuletId: STARTER_ACCESORIES.STORM_AMULET.id
    },
    inventory: [
      { itemId: STARTER_CONSUMABLES.HEALTH_POTION.id, quantity: 5 },
      { itemId: STARTER_CONSUMABLES.MANA_POTION.id, quantity: 3 },
      { itemId: STARTER_CONSUMABLES.BASIC_FOOD.id, quantity: 10 }
    ]
  },
};