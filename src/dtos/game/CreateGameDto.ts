import { ALL_LOCATIONS } from "../../data/locations/allLocations";

export interface CreateGameDto {
    currentDungeon: keyof typeof ALL_LOCATIONS
}