const TelegramBot = require('node-telegram-bot-api');
const config = require('../config').default;

// Создаем бота
const bot = new TelegramBot(config.BOT_TOKEN, {
    polling: true // Используем polling вместо webhook для простоты
});

// Команда start
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    
    const keyboard = {
        inline_keyboard: [
            [
                {
                    text: '🎰 Открыть казино',
                    web_app: { url: config.WEBAPP_URL }
                }
            ]
        ]
    };

    bot.sendMessage(chatId, 
        `🎲 Добро пожаловать в Казино!\n\n` +
        `Нажмите на кнопку ниже, чтобы открыть казино:`,
        {
            reply_markup: keyboard
        }
    );
});

module.exports = bot; 