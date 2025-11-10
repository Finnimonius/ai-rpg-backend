import { TreasureContainer, TreasureType } from "../../types/game.types";

export const treasureRewards: Record<TreasureType, TreasureContainer> = {
  chest: {
    rewards: [
      { type: 'weapon', chance: 30 },
      { type: 'armor', chance: 40 },
      { type: 'shopItem', category: 'any', chance: 20 },
    ],
  },
  large_chest: {
    rewards: [
      { type: 'weapon', chance: 50 },
      { type: 'armor', chance: 50 },
    ],
  },
  gemstones: {
    rewards: [
      { type: 'shopItem', category: 'gemstones', chance: 100 },
    ],
  },
  bag: {
    rewards: [
      { type: 'shopItem', category: 'gold', chance: 100 },
      { type: 'consumable', chance: 50 },
    ],
  },
};