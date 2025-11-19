import { CombatRewardType } from "../../types/combat.types";
import { TreasureContainer } from "../../types/game.types";

export const COMBAT_REWARD: Record<CombatRewardType, TreasureContainer> = {
  chest: {
    rewards: [
      { type: 'weapon', chance: 30 },
      { type: 'armor', chance: 40 },
      { type: 'shopItem', category: 'any', chance: 20 },
    ],
  },
};