import { ALL_LOCATIONS } from "../data/locations/allLocations";
import { storyCacheRepository } from "../repositories/storyCacheRepository";
import { toObjectId } from "../types/mongodb";
import { aiService } from "./aiService";

export const storyCacheService = {
    async getLocationStory(userId: string, dungeonId: keyof typeof ALL_LOCATIONS, locationId: string, aiPrompt: string, eventId?: string) {
        let locationKey;
        if (eventId) {
            locationKey = `${dungeonId}:${eventId}`;
        } else {
            locationKey = `${dungeonId}:${locationId}`;
        }
        const unusedStory = await storyCacheRepository.findUnusedStory(userId, locationKey);

        if (unusedStory) {
            await storyCacheRepository.markStoryAsUsed(userId, locationKey, unusedStory.text)
            return unusedStory.text
        }

        const existingCache = await storyCacheRepository.findByLocationKey(locationKey);

        if (existingCache) {
            const newStory = await aiService.generateText(aiPrompt);
            await storyCacheRepository.addStory(userId, locationKey, newStory);
            return newStory
        } else {
            const newStory = await aiService.generateText(aiPrompt);
            const objectId = toObjectId(userId);
            await storyCacheRepository.createCache({
                locationKey: locationKey,
                availableStories: [{
                    text: newStory,
                    usedBy: [objectId],
                    usageCount: 1,
                    createdAt: new Date()
                }],
                totalStories: 1,
                lastGenerated: new Date()
            })
            return newStory
        }
    }
}