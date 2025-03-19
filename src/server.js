const express = require('express');
const cors = require('cors');
const bot = require('./bot/bot');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Простой эндпоинт для проверки работы сервера
app.get('/', (req, res) => {
    res.send('Telegram Casino Bot Server is running');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}); 