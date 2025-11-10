export const GAME_CONFIG = {
  INVENTORY_SIZE: 14,
  MAX_EQUIPMENT_SLOTS: 10,
  MAX_STACK_SIZE: 99,
  STARTING_GOLD: 100,
  STARTING_LEVEL: 1,
  STARTING_STAT_POINTS: 0,
  RARITY_CHANCES: {
    common: 48,
    uncommon: 23, 
    rare: 15,
    epic: 9,
    legendary: 5
  } as const,
  RARITY_ORDER: ['legendary', 'epic', 'rare', 'uncommon', 'common'] as const
} as const;