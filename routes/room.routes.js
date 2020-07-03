const {Router} = require('express');
const config = require('config');
const router = Router();
const Room = require('../models/Room');

const getAllUserInRoom = async roomId => {
    try {
        const allUser = await Room.findOne({roomId})
        return allUser.users.map(user => {
            return user
        })

    } catch (e) {
        throw e
    }
};


// api/room/join
router.post('/join', async (req, res) => {
    try {
        console.log(req.body)
        const {roomId, userName, socketId} = req.body;

        const users = [{
            Name: userName,
            socketId: socketId
        }];


        const rooms = await Room.findOne({roomId});


        if (rooms) {


            if (rooms.roomId === roomId) {

                let allUsers = rooms.users;

                for (let i = 0; i < rooms.users.length; i++) {

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

                    const findEdentUser = allUsers.find(user => user.Name === userName);

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
})
;

router.get('/join', async (req, res) => {
    return res.status(200)
});

module.exports = router;