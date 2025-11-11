import { NotFoundError, ValidationError } from "../errors/AppError";
import { Game } from "../models/Game";
import { gameRepository } from "../repositories/gameRepository"

export const eventService = {
    async openTreasure(userId: string): Promise<Game | null> {
        const game = await gameRepository.findGameById(userId);
        if (!game) throw new NotFoundError('Игра');
        if (!game._id) throw new Error("Отсутствует ID игры в базе данных");

        const lastHistoryIndex = game.gameHistories.length - 1;

        const isOpened = game.gameHistories[lastHistoryIndex]?.currentEvent?.isOpened;
        if (isOpened) throw new ValidationError("Уже открыто");


        return gameRepository.updateGame(game._id, {
            [`gameHistories.${lastHistoryIndex}.currentEvent.isOpened`]: true
        })
    },

    async takeReward(userId: string): Promise<Game | null> {
        const game = await gameRepository.findGameById(userId);
        if (!game) throw new NotFoundError('Игра');
        if (!game._id) throw new Error("Отсутствует ID игры в базе данных");

        const lastHistoryIndex = game.gameHistories.length - 1;
        const isTaken = game.gameHistories[lastHistoryIndex]?.currentEvent?.isTaken;
        if (isTaken) throw new ValidationError("Уже получили награду");

        return gameRepository.updateGame(game._id, {
            [`gameHistories.${lastHistoryIndex}.currentEvent.isTaken`]: true
        })
    }
}