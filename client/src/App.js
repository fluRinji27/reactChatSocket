import React, {useEffect, useReducer, useState} from 'react';

import JoinRoom from "./components/JoinRoom/JoinRoom";
import Chat from "./components/Chat/Chat";
import reducer from "./redux/reducer";
import socket from "./hooks/socket.hook";


function App() {
    const [state, dispatch] = useReducer(reducer, {
        Joined: false,
        roomId: null,
        userName: null,
        socketId: null,
        users: [],
        messages: []

    });
    const onLogin = (userData) => {
        dispatch({
            type: 'JOINED',
            payload: userData
        });

        // Отправяем по сокета данные о попытке входа в комнате
        socket.emit('ROOM:JOIN', userData)
    };

    useEffect(() => {
        // Фиксируем вход пользователя в комнату
        socket.on('ROOM:JOINED', users => {
            dispatch({
                    type: 'SET_USERS',
                    payload: users
                }
            );

            socket.emit('ROOM:JOINED', users)
            console.log('ROOM:JOINED', users)
        })
    }, []);

    console.log(state)

    return (
        <div className="App">
            {!state.Joined ? <JoinRoom onLogin={onLogin} socket={socket}/> : <Chat users={state}/>}

        </div>
    );
}

export default App;
