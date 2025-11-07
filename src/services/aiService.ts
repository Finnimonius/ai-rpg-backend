import { config } from "../config/env";

export const aiService = {
    async generateText(prompt: string, temperature: number = 0.7, maxTokens: number = 300) {
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
                throw new Error(`YandexGPT error: ${response.status}`);
            }

            const data = await response.json();
            return data.result.alternatives[0].message.text;
        } catch (error) {
            console.error('Ошибка:', error);
            throw error;
        }
    }
}