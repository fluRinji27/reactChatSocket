const express = require('express');
const mongoose = require('mongoose');
const socket = require('socket.io');
const config = require('config');

//Константа которая получает порт сервера из config
const PORT = config.get('PORT');

//Инициализируем константу нашего сервера
const app = express();

app.use(express.json({extended: true}));
app.use('/api/room', require('./routes/room.routes'));

//Инициализируем http сервер для сокетов
const server = require('http').Server(app);

//Инициализируем сокеты
const io = socket(server);

const start = async () => {
    try {
        //Подключаемся к бае данных
        await mongoose.connect(config.get('mongoUri'), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });

        //Прослушиваем каждое подключение
        await io.on('connection', socket => {
            console.log('Пользователь подключился:', socket.id)
        });

        //Прослушка на порт
        server.listen(PORT, () => console.log('Server has ben started on port: ', PORT));
    } catch (e) {
        process.exit(1)
    }

};

start();
