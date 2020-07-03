export default (state, action) => {
    switch (action.type) {
        case 'JOINED':
            return {
                ...state,
                Joined: true,
                roomId: action.payload.roomId,
                userName: action.payload.userName,
                socketId: action.payload.socketId,
            };
        case 'SET_USERS':
            return {
                ...state,
                users: action.payload
            };
        case 'NEW_MESSAGE':
            return {
                ...state,
                messages: [...state.messages, action.payload]
            };

        default:
            return state;
    }
}