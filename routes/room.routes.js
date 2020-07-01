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

                for (let i = 0; i < rooms.users.length; i++) {

                    let allUsers = rooms.users;

                    if (rooms.users[i].Name === userName && rooms.users[i].socketId !== socketId) {

                        const result = rooms.users.map((user, i) => {

                            console.log(user);
                            if (user.Name === userName) {
                                console.log(`Ид пользователя №${i} устарел!`);

                                console.log(`Старый ид ${user.socketId}      новый ид ${socketId}`);

                                return {
                                    Name: userName,
                                    socketId: socketId
                                }

                            }


                        });

                        const newUser = result.map((item, i) => {
                            if (result[i] !== null) {
                                console.log(result[i]);
                                return {
                                    result: result[i],
                                    index: i
                                }
                            }
                        })

                        allUsers[newUser.index].pop()
                        allUsers[newUser.index].push(newUser.result)

                        console.log(allUsers)

                    }

                    // Room.findOneAndUpdate({roomId: roomId}, {$set: {users: allUsers}}, (err, res) => {
                    //         if (err) throw err
                    //
                    //         console.log('add new user', res)
                    //
                    //     }
                    // );


                    break

                }
            }


            for (let i = 0; i < rooms.users.length; i++) {
                if (rooms.users[i].Name !== userName) { // Если пользователя нет, то создаем его в данной комнате
                    break
                    let allUsers = rooms.users;

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

                    Room.findOneAndUpdate({roomId: roomId}, {$set: {users: allUsers}}, (err, res) => {
                            if (err) throw err;

                            console.log('add new user', res)

                        }
                    );
                    break

                }
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