import React, {useEffect, useReducer, useState} from 'react';

import JoinRoom from "./components/JoinRoom/JoinRoom";
import Chat from "./components/Chat/Chat";
import reducer from "./redux/reducer";
import socket from "./hooks/socket.hook";
import {useHttp} from "./hooks/http.hook";


function App() {
    const {request} = useHttp();
    const [state, dispatch] = useReducer(reducer, {
        Joined: false,
        roomId: null,
        userName: null,
        socketId: null,
        users: [],
        messages: []

    });
    const onLogin = async (userData) => {
        dispatch({
            type: 'JOINED',
            payload: userData
        });

        // Отправяем по сокета данные о попытке входа в комнате
        socket.emit('ROOM:JOIN', userData);

        // Получаем массив пользвателей который находятся в комнате
        const data = await request(`/api/room/join/${userData.roomId}`, 'GET');

        // Заносим пользователей в стейт
        setUsers(data.users)


    };
    // Заносим пользователей в стейт
    const setUsers = users => {
        dispatch({
                type: 'SET_USERS',
                payload: users
            }
        );
    };

    const addMessage = messages => {
        dispatch({
            type: 'NEW_MESSAGE',
            payload: messages
        })
    }

    useEffect(() => {
        // Фиксируем вход пользователя в комнату
        socket.on('ROOM:SET_USERS', setUsers);
        socket.on('ROOM:NEW_MESSAGE', addMessage)
    }, []);

    console.log(state.messages)

    return (
        <div className="App">
            {!state.Joined ? <JoinRoom onLogin={onLogin} socket={socket}/> :
                <Chat {...state} onAddMessages={addMessage}/>}

        </div>
    );
}

export default App;
