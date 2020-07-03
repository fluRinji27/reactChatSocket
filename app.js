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
            useCreateIndex: true,
            useFindAndModify: false
        });
        //Прослушиваем каждое подключение

        await io.on('connection', socket => {
            let socketUserData;
            let users = [];
                socket.on('ROOM:JOIN', data => {
                        console.log("ROOM:JOIN");

                        const roomId = data.roomId;
                        const userName = data.userName;

                        socketUserData = data;

                        users.push(userName);
                        socket.join(roomId);

                        console.log(users);

                        socket.to(roomId).emit('ROOM:JOINED', users)

                        console.log('user connected', socket.id)
                    }
                );


            socket.on('disconnecting', () => {
                if (socketUserData) {
                    const userDisconnected = users.find(user => user === socketUserData.userName);
                    users.pop(userDisconnected)
                    console.log('User socket disconnect', socketUserData, users)

                }


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


// Room.findOneAndUpdate(
//     {
//         $and: [
//             {roomId: roomId, users: [{Name: userName}]}
//         ]
//     }, {
//         $set: {
//             users: [{
//                 Name: userName,
//                 socketId: socket.id
//             }]
//         }
//     }, (err, result) => {
//         if (err) throw err
//         console.log('Данные изменены', result);
//         return
//     }
// );


// for (let i = 0; i < usersArray.length; i++) {
//     if (userName === usersArray[i].Name) {
//         console.log('Пользователь существует!', usersArray[i].Name);
//         console.log('userName ', userName);
//         console.log('roomId ', roomId);
//
//         Room.findOne(
//             {roomId: roomId}, (err, res) => {
//                 if (res === null || err) throw err;
//                 console.log('user name', res.users[i].Name);
//             })
//     } else {
//         const users = [{
//             Name: userName,
//             socketId: socket.id
//         }];
//
//         Room.updateOne({roomId: roomId}, {$push: {users}}, (err, result) => {
//             if (err) throw err;
//
//             console.log('данные добавлены');
//         });
//     }
// }