import { ClassId } from "../types/character.types";

export interface CreateCharacterDto {
    classId: ClassId,
    backgroundId: string,
}