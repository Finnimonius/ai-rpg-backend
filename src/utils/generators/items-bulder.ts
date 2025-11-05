import { classConfigs } from "../../data/items/starterGear";
import { ClassId } from "../../types/character.types";
import { Equipment } from "../../types/inventory.types";

export const getStartingEquipment = (classId: ClassId): Equipment => {
    return classConfigs[classId].equipment;
};