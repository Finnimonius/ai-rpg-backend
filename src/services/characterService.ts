import { ObjectId } from "mongodb";
import { CreateCharacterDto } from "../dtos/CreateCharacterDto";
import { Character } from "../models/Character";
import { CLASSES } from "../data/character/classes";
import { getStartingEquipment, getStartingInventory } from "../utils/generators/items-bulder";

// export const characterService = {
//     async createCharacter(userId: string, createData: CreateCharacterDto) {
//         const characterClass = CLASSES.find(c => c.id === createData.classId);
//         if(!characterClass) throw new Error("Класс не найден");

//         const startingEquipment = getStartingEquipment(createData.classId);
//         const startingInventory = getStartingInventory(createData.classId);
        
        
//         const characterData: Character = {
//             userId: new ObjectId(userId),
//             classId: characterClass.id,
//             backgroundId: createData.backgroundId,
//             level: 1,
//             stats: characterClass.baseStats,
//             derivedStats: 
//         }
//     }
// }