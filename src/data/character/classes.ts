import { GREY_WANDERER_ABILITIES } from "./abilities";

export const CLASSES = [
    {
    id: 'grey_wanderer' as const,
    name: 'Серый странник',
    description: 'Мастер скрытности и манипуляций, использующий иллюзии и хитрость',

    baseStats: {
      strength: 8,
      dexterity: 16,
      intelligence: 12,
      wisdom: 10,
      constitution: 10,
      luck: 14
    },

    levelUpStats: {
      dexterity: 1,
      luck: 0.5
    },

    weaponTypes: ['dagger', 'short_sword', 'crossbow'],
    armorTypes: ['light', 'cloth'],
    resource: 'leads' as const,

    abilities: GREY_WANDERER_ABILITIES
  }
];