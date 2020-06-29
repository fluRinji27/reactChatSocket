const express = require('express');
const mongoose = require('mongoose');
const socket = require('socket.io');
const config = require('config');
const Room = require('./models/Room');


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
                socket.on('ROOM:JOIN', data => {

                    const roomId = data.roomId;
                    socket.join(roomId);
                    const userName = data.userName;

                    const users = [{
                        Name: userName,
                        socketId: socket.id
                    }];

                    Room.updateOne({roomId: roomId}, {$push: {users}}, (err, result) => {
                        if (err) throw err;

                        console.log('данные добавлены')
                    });

                    Room.find({roomId}).exec((err, result) => {
                        result.map(user => {
                            const users = user.get('users');
                            for (let i = 0; i < users.length; i++) {
                                console.log(users[i].Name)
                            }
                        })
                    })


                });
                console.log('Пользователь подключился:', socket.id)
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


// .exec((err, result) => {
//     if (err) throw err;
//
//     return result.map((user) => {
//         return  user.users
//     })
// })