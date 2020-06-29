const {Router} = require('express')
const config = require('config')
const router = Router()


// api/room/join
router.post('/join', async (req, res) => {
    try {
        console.log('body,', req.body);

        const {roomId, userName} = req.body;

        res.status()
    } catch (e) {

    }
});

module.exports = router;