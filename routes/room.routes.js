const {Router} = require('express');
const router = Router();
const Room = require('../models/Room');
const app = require('../app');

// api/room/join
router.post('/join', async (req, res) => {
    try {
        // Создаем новую комнату и добавляем пользователя
        console.log(req.body)

        // Получаем данные от клиента
        const {roomId, userName, socketId} = req.body;

        const users = [{
            Name: userName,
            socketId: socketId
        }];


        const rooms = await Room.findOne({roomId});

        // Елт комната существует, то мы проводим в ней операции
        if (rooms) {

            if (rooms.roomId === roomId) {

                let allUsers = rooms.users;

                for (let i = 0; i < rooms.users.length; i++) {
                    // Изменяем socket id пользователя
                    if (rooms.users[i].Name === userName && rooms.users[i].socketId !== socketId) {

                        //Ищем пользователя в комнате по имени и присваиваем ноывй сокет ид
                        let findUser = allUsers.find(user => user.Name === userName);
                        findUser.socketId = socketId;

                        // Создаем новуы объект с внесенными изменениями
                        let newUser = allUsers.find(user => user.Name === findUser.Name);

                        if (allUsers[i].name === newUser.Name) {

                            allUsers[i].push(newUser)

                        }

                    }
                    ////////////////// Добавляем новго пользователя в комнату

                    // Ищем пользователя исходя из имени пришедшего от клиента
                    const findEdentUser = allUsers.find(user => user.Name === userName);

                    // Если такого имени нету, то создаем объект с новым пользователем и добавляем его в массив пользователей
                    if (!findEdentUser) {

                        const newUser = {
                            Name: userName,
                            socketId: socketId
                        };

                        allUsers.push(newUser)
                    }

                }

                // Добавляем изменения в базу
                Room.findOneAndUpdate({roomId: roomId}, {$set: {users: allUsers}}, (err, res) => {
                        if (err) throw err;
                    }
                );
            }


            res.status(200).json({message: "Вход в комнату выполнен"})
        }

        const room = new Room({roomId, users});

        await room.save();

        res.status(201).json({message: "Комната создана"})
    } catch
        (e) {

    }
});

router.get('/join/:id', async (req, res) => {
    const {id: roomId} = req.params
    const obj = app.rooms.has(roomId) ? {
        users: [...app.rooms.get(roomId).get('users').values()],
        messages: [...app.rooms.get(roomId).get('messages').values()]
    } : {users: [], messages: []}
    //
    // const repeatUsers = app.users.some((users) => users === app.users)
    //
    // if (repeatUsers) res.status(500)
    console.log(obj)
    res.json(obj)

});

module.exports = router;