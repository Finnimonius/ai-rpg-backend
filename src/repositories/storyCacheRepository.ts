import { getDataBase } from "../config/database"
import { StoryCache, StoryEntry } from "../models/StoryCache"
import { MongoId, toObjectId } from "../types/mongodb";

const COLLECTION_NAME = 'stories'

export class StoryCacheRepository {
    private getCollection() {
        return getDataBase().collection<StoryCache>(COLLECTION_NAME);
    }

    async createCache(storyData: StoryCache): Promise<StoryCache> {
        const collection = this.getCollection();

        const result = await collection.insertOne(storyData);

        const createdStory: StoryCache = {
            ...storyData,
            _id: result.insertedId
        }

        return createdStory
    }

    async findByLocationKey(locationKey: string): Promise<StoryCache | null> {
        const collection = this.getCollection();

        const result = await collection.findOne({ locationKey: locationKey });

        return result
    }

    async addStory(userId: MongoId, locationKey: string, storyText: string): Promise<StoryCache | null> {
        const collection = this.getCollection();
        const objectId = toObjectId(userId);

        const result = await collection.findOneAndUpdate(
            { locationKey: locationKey },
            {
                $push: {
                    availableStories: {
                        text: storyText,
                        usedBy: [objectId],
                        usageCount: 1,
                        createdAt: new Date()
                    }
                },
                $inc: { totalStories: 1 },
                $set: { lastGenerated: new Date() }
            },
            { returnDocument: 'after' }
        )

        return result
    }

    async markStoryAsUsed(userId: MongoId, locationKey: string, storyText: string): Promise<StoryCache | null> {
        const collection = this.getCollection();

        const result = await collection.findOneAndUpdate(
            {
                locationKey: locationKey,
                "availableStories.text": storyText
            },
            {
                $addToSet: { "availableStories.$.usedBy": toObjectId(userId) },
                $inc: { "availableStories.$.usageCount": 1 }
            },
            { returnDocument: 'after' }
        );

        return result;
    }

    async findUnusedStory(userId: MongoId, locationKey: string): Promise<StoryEntry | null> {
        const collection = this.getCollection();
        const objectId = toObjectId(userId);

        const result = await collection.aggregate<StoryEntry>([
            { $match: { locationKey } },
            { $unwind: "$availableStories" },
            {
                $match: {
                    "availableStories.usedBy": { $not: { $elemMatch: { $eq: objectId } } }
                }
            },
            { $sample: { size: 1 } },
            {
                $project: {
                    text: "$availableStories.text",
                    usedBy: "$availableStories.usedBy",
                    usageCount: "$availableStories.usageCount",
                    createdAt: "$availableStories.createdAt"
                }
            }
        ]).toArray();

        return result[0] || null;
    }
}

export const storyCacheRepository = new StoryCacheRepository();