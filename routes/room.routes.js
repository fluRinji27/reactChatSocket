const {Router} = require('express');
const config = require('config');
const router = Router();
const Room = require('../models/Room');

// api/room/join
router.post('/join', async (req, res) => {
    try {

        const {roomId, userName} = req.body;

        const rooms = await Room.findOne({roomId});

        if (rooms) {
            return res.status(200).json({message: "Вход в комнату выполнен"})
        }

        const users = [{
            Name: userName,
            socketId: null
        }];

        console.log(users);

        const room = new Room({roomId, users});


        await room.save();

        res.status(201).json({message: "Комната создана"})
    } catch (e) {

    }
});

module.exports = router;