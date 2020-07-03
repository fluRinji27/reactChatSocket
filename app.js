const express = require('express');
const mongoose = require('mongoose');
const socket = require('socket.io');
const config = require('config');

//Константа которая получает порт сервера из config
const PORT = config.get('PORT');

//Инициализируем константу нашего сервера
const app = express();

app.use(express.json({extended: true}));
app.use(express.urlencoded({extended: true}));
app.use('/api/room', require('./routes/room.routes'));

//Инициализируем http сервер для сокетов
const server = require('http').Server(app);

//Инициализируем сокеты
const io = socket(server);

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
        //Прослушиваем каждое подключение

        await io.on('connection', socket => {
            let socketUserData;
            // Подключение сокета к комнате
                socket.on('ROOM:JOIN', data => {
                        console.log("ROOM:JOIN");

                        const roomId = data.roomId;
                        const userName = data.userName;

                        socketUserData = data;

                    if (!rooms.has(roomId)) {
                        rooms.set(roomId, new Map([
                            ['users', new Map()],
                            ['messages', []]
                        ]))
                    }

                    // Создаем комнату в сокетах
                        socket.join(roomId);

                    rooms.get(roomId).get('users').set(socket.id, userName)

                    const users = [...rooms.get(roomId).get('users').values()];

                    // Оповещаем клиент о входе пользователя
                    socket.to(roomId).broadcast.emit('ROOM:SET_USERS', users);

                        console.log('user connected', socket.id)
                    }
                );

            // Получение сообщения
            socket.on('ROOM:NEW_MESSAGE', ({roomId, userName, text}) => {
                const obj = {
                    userName,
                    text
                }

                rooms.get(roomId).get('messages').push(obj)

                socket.to(roomId).broadcast.emit('ROOM:NEW_MESSAGE', obj)
            })

            // Отключения сокета
            socket.on('disconnecting', () => {

                rooms.forEach((value, roomId) => {
                    if (value.get('users').delete(socket.id)) {
                        const users = [...rooms.get(roomId).get('users').values()];
                        socket.to(socketUserData.roomId).broadcast.emit('ROOM:SET_USERS', users)
                    }
                })

            })

            }
        );


        //Прослушка на порт
        server.listen(PORT, () => console.log('Server has ben started on port: ', PORT));


    } catch
        (e) {
        process.exit(1)
    }

};

start();

module.exports.rooms = rooms