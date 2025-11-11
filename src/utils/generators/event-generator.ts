import { GAME_CONFIG } from "../../config/game-config";
import { EVENTS } from "../../data/events/allEvents";
import { treasureEvents } from "../../data/events/treasureEvent";
import { ALL_ITEMS_BY_TYPE_AND_RARITY } from "../../data/items/allItems";
import { treasureRewards } from "../../data/rewards/treasureReward";
import { CurrentEvent, EventType, Treasure } from "../../types/game.types";
import { AnyItem, Rarity } from "../../types/items.types";

export function getRandomEvent(): EventType {
    const eventsCopy = [...EVENTS];
    const index = Math.floor(Math.random() * eventsCopy.length);

    return eventsCopy[index]
}

export function generateEvent(type: EventType) {
    switch (type) {
        case 'treasure':
            return generateTreasureEvent(type)
    }
}

function generateTreasureEvent(type: EventType): CurrentEvent {
    const randomTreasureEvent = treasureEvents[Math.floor(Math.random() * treasureEvents.length)];
    const randomRewardType = randomTreasureEvent.container[Math.floor(Math.random() * randomTreasureEvent.container.length)];

    const treasureContainer = treasureRewards[randomRewardType];
    const treasureReward = getRandomTreasureReward(treasureContainer.rewards);

    const eligibleItems = getEligibleItems(treasureReward);
    
    if (eligibleItems.length === 0) {
        throw new Error(`Предметы не найдены для ${treasureReward.type}${treasureReward.category ? ` категория: ${treasureReward.category}` : ''}`);
    }

    const itemsByRarity = groupItemsByRarity(eligibleItems);
    const selectedRarity = selectRarityByWeight();

    let finalRarity = selectedRarity;
    if (!itemsByRarity[selectedRarity] || itemsByRarity[selectedRarity].length === 0) {
        finalRarity = findAvailableRarity(itemsByRarity, selectedRarity);
    }

    const items = itemsByRarity[finalRarity];
    const reward = items[Math.floor(Math.random() * items.length)];

    return {
        eventType: type,
        ...randomTreasureEvent,
        reward: reward,
        isOpened: false,
        isTaken: false
    };
}

function groupItemsByRarity(items: AnyItem[]): Record<Rarity, AnyItem[]> {
    const result: Record<Rarity, AnyItem[]> = {
        common: [], uncommon: [], rare: [], epic: [], legendary: []
    };

    items.forEach(item => {
        result[item.rarity].push(item);
    });

    return result;
}

function getEligibleItems(treasureReward: Treasure): AnyItem[] {
    const itemsByRarity = ALL_ITEMS_BY_TYPE_AND_RARITY[treasureReward.type];
    const allItems = Object.values(itemsByRarity).flat();
    
    return allItems.filter(item => {
        if (treasureReward.type === 'shopItem' && treasureReward.category) {
            if (treasureReward.category === 'any') return true;
            return (item as any).category === treasureReward.category;
        }
        return true;
    });
}

function selectRarityByWeight(): Rarity {
    const rarities = Object.keys(GAME_CONFIG.RARITY_CHANCES) as Rarity[];
    const chances = Object.values(GAME_CONFIG.RARITY_CHANCES);
    
    const totalChance = chances.reduce((sum, chance) => sum + chance, 0);
    const random = Math.random() * totalChance;

    let currentChance = 0;
    for (let i = 0; i < rarities.length; i++) {
        currentChance += chances[i];
        if (random <= currentChance) {
            return rarities[i];
        }
    }

    return 'common';
}

function findAvailableRarity(itemsByRarity: Record<Rarity, AnyItem[]>, originalRarity: Rarity): Rarity {
    const rarityOrder = GAME_CONFIG.RARITY_ORDER;
    const originalIndex = rarityOrder.indexOf(originalRarity);
    
    for (let i = originalIndex - 1; i >= 0; i--) {
        if (itemsByRarity[rarityOrder[i]]?.length > 0) {
            return rarityOrder[i];
        }
    }
    
    for (let i = originalIndex + 1; i < rarityOrder.length; i++) {
        if (itemsByRarity[rarityOrder[i]]?.length > 0) {
            return rarityOrder[i];
        }
    }
    
    return Object.keys(itemsByRarity).find(r => itemsByRarity[r as Rarity]?.length > 0) as Rarity;
}

function getRandomTreasureReward(rewards: Treasure[]): Treasure {
    const totalChance = rewards.reduce((sum, reward) => sum + reward.chance, 0);

    const random = Math.random() * totalChance;

    let currentChance = 0;

    for (const reward of rewards) {
        currentChance += reward.chance
        if (random <= currentChance) {
            return reward
        }
    }

    return rewards[rewards.length - 1];
}
