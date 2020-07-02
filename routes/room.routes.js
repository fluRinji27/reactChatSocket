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

            console.log('rooms event');

            if (rooms.roomId === roomId) {

                let allUsers = rooms.users;

                for (let i = 0; i < rooms.users.length; i++) {


                    if (rooms.users[i].Name === userName && rooms.users[i].socketId !== socketId) {

                        let findUser = allUsers.find(user => user.Name === userName);
                        findUser.socketId = socketId;

                        console.log(findUser);

                        let newUser = allUsers.find(user => user.Name === findUser.Name);

                        if (allUsers[i].name === newUser.Name) {
                            allUsers[i].push(newUser)
                        }

                    }

                }


                Room.findOneAndUpdate({roomId: roomId}, {$set: {users: allUsers}}, (err, res) => {
                        if (err) throw err;

                        console.log('add new user', res)

                    }
                );
            }

            if (rooms.roomId === roomId) {

                let allUsers = rooms.users;

                for (let i = 0; i < rooms.users.length; i++) {

                    if (rooms.users[i].Name !== userName) { // Если пользователя нет, то создаем его в данной комнате


                        console.log('before pushing', allUsers);

                        const newUser = rooms.users.map((user, i) => {

                            const finishNewUser = {
                                _id: '213213213',
                                Name: userName,
                                socketId: socketId
                            };
                            return finishNewUser
                        });

                        allUsers.push(newUser[0]);

                        console.log('after pushing', allUsers);

                        console.log('PRE-SEND DATA NEW USER', allUsers);


                    }
                }
                Room.findOneAndUpdate({roomId: roomId}, {$set: {users: allUsers}}, (err, res) => {
                        if (err) throw err;

                        console.log('add new user', res)

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