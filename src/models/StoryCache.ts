import { ObjectId } from "mongodb";

export interface StoryCache {
    _id?: ObjectId,
    locationKey: string,
    availableStories: StoryEntry[],
    totalStories: number,
    lastGenerated: Date 
}

export interface StoryEntry {
    text: string,
    usedBy: ObjectId[],
    usageCount: number,
    createdAt: Date
}