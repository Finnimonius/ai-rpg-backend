import { Equipment } from "./inventory.types";

export type ClassId = 'grey_wanderer';

export interface BaseStats {
  strength: number,
  dexterity: number,
  intelligence: number,
  wisdom: number,
  constitution: number,
  luck: number
}

export interface DerivedStats {
  health: number,
  maxHealth: number,
  mana: number,
  maxMana: number,
  attackMin: number,
  attackMax: number,
  defense: number,
  critChance: number,
  evasion: number,
}

export interface ClassConfig {
  equipment: Equipment
}

export interface Ability {
  id: string,
  name: string,
  description: string,
  type: 'damage' | 'utility',
  target: 'enemy' | 'self',
  cost: {
    ap: number,
    mana?: number,
    leads?: number,
  };
  damage?: {
    base: number,
    multiplier: number,
    isWeapon: boolean
  },
  effects?: Array<{
    type: 'ADD_LEADS' | 'SELF_BUFF' | 'STUN',
    stat?: keyof DerivedStats,
    value?: number,
    chance?: number,
    duration?: number
  }>,
  cooldown?: number,
  requirements?: {
    level: number,
    subclass?: string,
  };
}