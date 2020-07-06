const {Schema, model, Types} = require('mongoose');

const schema = new Schema({
    roomId: {type: String, required: true, unique: true},
    users: [{
        Name: String,
        socketId: String
    }],
    messages: [{
        Name: String,
        text: String
    }]

});

module.exports = model('Room', schema);


// roomId: {type: String, required: true, unique: true},
// users: {type: Array, require: true, unique: true},
