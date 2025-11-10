import { config } from "../config/env";
import { AiServiceError } from "../errors/AppError";

export const aiService = {
    async generateText(prompt: string, temperature: number = 0.7, maxTokens: number = 250) {
        try {
            const response = await fetch('https://llm.api.cloud.yandex.net/foundationModels/v1/completion', {
                method: 'POST',
                headers: {
                    'Authorization': `Api-Key ${config.yandex.apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "modelUri": `gpt://${config.yandex.folderId}/yandexgpt/latest`,
                    "completionOptions": {
                        "stream": false,
                        "temperature": temperature,
                        "maxTokens": maxTokens
                    },
                    "messages": [
                        {
                            "role": "user",
                            "text": prompt
                        }
                    ]
                })
            });

            if (!response.ok) {
                throw new AiServiceError(`YandexGPT error: ${response.status}`);
            }

            const data = await response.json();
            return data.result.alternatives[0].message.text;
        } catch (error) {
            console.error('Ошибка YandexGPT:', error);

            if (error instanceof AiServiceError) {
                throw error;
            }

            throw new AiServiceError(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}