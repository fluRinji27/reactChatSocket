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
            getAllUserInRoom(roomId).then(usersArray => {
                usersArray.map((user, i) => {
                    if (rooms.roomId === roomId) {
                        if (user.Name === userName && user.socketId !== socketId || user.Name === userName) {

                            // rooms.updateOne({users}, {$set: {users}}, (err, res) => {
                            //     if (err) throw err;
                            //     console.log(res)
                            // });

                            console.log(rooms);
                            console.log(`Ид пользователя №${i} устарел!`)
                            // console.log(`Старый ид ${user.socketId}      новый ид ${socketId}`)

                        } else if (user.Name === userName) {
                            console.log('Такой пользователь существет!')

                        }
                    }


                })

                // for (let i = 0; i < usersArray.length; i++) {
                //     const cloneUser = usersArray[i];
                //
                //     if (usersArray[i].Name !== users[0].Name) {
                //         console.log(cloneUser)
                //         Room.findOne({users: cloneUser}, (err, res) => {
                //             if (err) throw err;
                //             console.log("user pushed on DB");
                //
                //         });
                //
                //
                //         //  Room.findOneAndUpdate({users: cloneUser}, {$push: {users}}, (err, res) => {
                //         //     if (err) throw err;
                //         //     console.log("user pushed on DB");
                //         //     console.log('pushed data', res);
                //         //
                //         // });
                //         return
                //     }
                //
                //     if (usersArray[i].Name === users[0].Name) {
                //         console.log('ПОЛЬЗОВАТЕЛЬ СУЩЕСТВУЕТ!')
                //         console.log(cloneUser)
                //         return
                //     }
                //
                // }


            })


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