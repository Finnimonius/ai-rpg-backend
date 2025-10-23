import { Router } from "express"; // Router - класс для создания группы маршрутов
import { config } from "../config/env";

const router = Router(); // Создание роутера

router.get('/health', (req, res) => { // health - путь относительно /api/ai/health
    res.json({
        status: 'OK',
        message: 'AI Сервер работает',
        timestamp: new Date().toISOString()
    });
});

router.post('/generate', async (req, res) => {
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
                    "temperature": req.body.temperature || 0.7,
                    "maxTokens": req.body.maxTokens || 1000
                },
                "messages": [
                    {
                        "role": "user",
                        "text": req.body.prompt
                    }
                ]
            })
        });

        if (!response.ok) {
            throw new Error(`YandexGPT error: ${response.status}`);
        }

        const data = await response.json();

        res.json(data)
    } catch (error) {
        console.error('Ошибка:', error);
        res.status(500).json({ error: String(error) })
    }
});

export default router;