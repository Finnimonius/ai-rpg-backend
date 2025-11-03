import { BaseStats, DerivedStats } from '../../types/character.types';
import { EquipmentStats } from './equipmentUtils';

export const calculateDerivedStats = (baseStats: BaseStats, equipmentStats: EquipmentStats, level: number): DerivedStats => {
    const totalStats: BaseStats = {
        strength: baseStats.strength + equipmentStats.stats.strength,
        dexterity: baseStats.dexterity + equipmentStats.stats.dexterity,
        intelligence: baseStats.intelligence + equipmentStats.stats.intelligence,
        wisdom: baseStats.wisdom + equipmentStats.stats.wisdom,
        constitution: baseStats.constitution + equipmentStats.stats.constitution,
        luck: baseStats.luck + equipmentStats.stats.luck,
    };

    return {
        health: Math.round(50 + (level * 5) + totalStats.constitution),
        maxHealth: Math.round(50 + (level * 5) + totalStats.constitution),
        mana: Math.round(30 + (totalStats.intelligence * 2) + (totalStats.wisdom * 1)),
        maxMana: Math.round(30 + (totalStats.intelligence * 2) + (totalStats.wisdom * 1)),
        attackMin: Math.round(equipmentStats.damage.min + (totalStats.dexterity * 0.3)),
        attackMax: Math.round(equipmentStats.damage.max + (totalStats.dexterity * 0.3)),
        defense: Math.round(equipmentStats.defense + (totalStats.dexterity * 0.2)),
        critChance: Math.round(5 + (totalStats.dexterity * 0.2) + (totalStats.luck * 0.1)),
        evasion: Math.round(10 + (totalStats.dexterity * 0.4) + (totalStats.luck * 0.2)),
    };
};