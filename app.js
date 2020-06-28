const express = require('express');
const socket = require('socket.io');
const config = require('config');

//Константа которая получает порт сервера из config
const PORT = config.get('PORT');

//Инициализируем константу нашего сервера
const app = express();

//Инициализируем http сервер для сокетов
const server = require('http').Server(app);

//Инициализируем сокеты
const io = socket(server);

//Создаем начальнйы роут
app.get('/', (req, res) => {
    res.send()
});

//Прослушка на порт и отловка ошибок
server.listen(PORT, err => {
    if (err) {
        throw Error(err)
    }
    console.log('Server has ben started on port: ', PORT)
});

//Прослушиваем каждое подключение
io.on('connection', socket => {
    console.log('Пользователь подключился:', socket)
});