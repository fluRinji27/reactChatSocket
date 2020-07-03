const {Schema, model, Types} = require('mongoose');

const schema = new Schema({
    roomId: {type: String, required: true, unique: true},
    users: [{
        Name: String,
        socketId: String
    }],
    messages: {type: Array}

});

module.exports = model('Room', schema);


// roomId: {type: String, required: true, unique: true},
// users: {type: Array, require: true, unique: true},
