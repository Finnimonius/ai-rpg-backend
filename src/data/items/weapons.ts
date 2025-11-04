export const WEAPONS = {
    KUKRI: {
    id: 'kukri',
    name: 'Кукри',
    type: 'weapon' as const,
    rarity: 'common' as const,
    value: 10,
    requiredLevel: 1,
    damage: { min: 5, max: 9 },
    stats: { strength: 2, dexterity: 1 },
    weaponType: 'dagger'
  },
  ROGUE_DAGGER: {
    id: 'rogue_dagger',
    name: 'Кинжал Разбойника',
    type: 'weapon' as const,
    rarity: 'common' as const,
    value: 12,
    requiredLevel: 1,
    damage: { min: 5, max: 10 },
    stats: { dexterity: 1, luck: 1 },
    weaponType: 'dagger'
  },
  BOWIE_KNIFE: {
    id: 'bowie_knife',
    name: 'Нож Боуи',
    type: 'weapon' as const,
    rarity: 'uncommon' as const,
    value: 25,
    requiredLevel: 3,
    damage: { min: 6, max: 10 },
    stats: { dexterity: 1 },
    weaponType: 'dagger'
  },
  BONE_CARVER: {
    id: 'bone_carver',
    name: 'Резчик Костей',
    type: 'weapon' as const,
    rarity: 'uncommon' as const,
    value: 25,
    requiredLevel: 3,
    damage: { min: 6, max: 10 },
    stats: { strength: 2 },
    weaponType: 'dagger'
  },
  VENOM_FANG: {
    id: 'venom_fang',
    name: 'Ядовитый Клык',
    type: 'weapon' as const,
    rarity: 'rare' as const,
    value: 32,
    requiredLevel: 4,
    damage: { min: 7, max: 13 },
    stats: { dexterity: 2 },
    weaponType: 'dagger'
  },
  CRYSTAL_SHARD: {
    id: 'crystal_shard',
    name: 'Осколок Кристалла',
    type: 'weapon' as const,
    rarity: 'epic' as const,
    value: 50,
    requiredLevel: 5,
    damage: { min: 8, max: 12 },
    stats: { intelligence: 2 },
    weaponType: 'dagger'
  },
  SHADOW_BLADE: {
    id: 'shadow_blade',
    name: 'Клинок Теней',
    type: 'weapon' as const,
    rarity: 'legendary' as const,
    value: 100,
    requiredLevel: 6,
    damage: { min: 10, max: 14 },
    stats: { dexterity: 3 },
    weaponType: 'dagger'
  },
}