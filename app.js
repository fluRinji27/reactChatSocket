const express = require('express');
const mongoose = require('mongoose');
const socket = require('socket.io');
const config = require('config');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const https = require('https');

//Константа которая получает порт сервера из config
const PORT = process.env.PORT || config.get('PORT') || 5000;

const ssl = {
    key: fs.readFileSync('./ssl/privateKey.key'),
    cert: fs.readFileSync('./ssl/certificate.crt')
};


//Инициализируем константу нашего сервера
const app = express();

const httpsServer = https.createServer(ssl, app);

app.use(express.json({extended: true}));
app.use(express.urlencoded({extended: true}));
app.use('/api/room', require('./routes/room.routes'));

if (process.env.NODE_ENV === 'production') {
    app.disable('x-powered-by');
    app.use(morgan('common'));

    app.use('/', express.static(path.resolve(__dirname, 'client', 'build')));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}

//Инициализируем сокеты
const io = socket(httpsServer);

let rooms = new Map();
const start = async () => {
    try {
        //Подключаемся к бае данных
        await mongoose.connect(config.get('mongoUri'), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });
        // Подключаемся к сокетам
        await io.on('connection', socket => {
            let socketUserData;
            // Подключение пользователя к комнате
                socket.on('ROOM:JOIN', data => {
                    console.log('user connect', socket.id)
                    const roomId = data.roomId
                    const userName = data.userName;

                        socketUserData = data;
                    // Если комнаты с введеным id не существут, то создадим новую
                    if (!rooms.has(roomId)) {
                        rooms.set(roomId, new Map([
                            ['users', new Map()],
                            ['messages', []]
                        ]))
                    }
                    // Создаем комнату в сокетах
                        socket.join(roomId);
                    // В созданную комнату вносим данные пользователя
                    rooms.get(roomId).get('users').set(socket.id, userName)
                    // Получаем внесенные данные
                    const users = [...rooms.get(roomId).get('users').values()];
                    // Оповещаем клиент о входе пользователя
                    socket.to(roomId).broadcast.emit('ROOM:SET_USERS', users);
                    }
                );
            // Получение сообщения
            socket.on('ROOM:NEW_MESSAGE', ({roomId, userName, text}) => {
                const obj = {
                    userName,
                    text
                };
                // В объект rooms пушим в масив сообщений сообщение
                rooms.get(roomId).get('messages').push(obj);
                // Оповещаем клиент о сообщении
                socket.to(roomId).broadcast.emit('ROOM:NEW_MESSAGE', obj)
            });
            // Отключения клиента
            socket.on('disconnecting', () => {
                // При отключении клиента удаляем его из комнаты
                rooms.forEach((value, roomId) => {
                    if (value.get('users').delete(socket.id)) {
                        const users = [...rooms.get(roomId).get('users').values()];
                        // Повоещаем клиет о новом кол-во пользователей
                        socket.to(socketUserData.roomId).broadcast.emit('ROOM:SET_USERS', users)
                    }
                })
            })
            }
        );


        //Прослушка на порт
        httpsServer.listen(PORT, () => console.log('Server has ben started on port: ', PORT));


    } catch
        (e) {
        process.exit(1)
    }

};

start();

module.exports.rooms = rooms;
