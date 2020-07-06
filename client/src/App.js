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

    const [allMessages, setAllMessages] = useState([])

    const onLogin = async (userData) => {
        try {
            dispatch({
                type: 'JOINED',
                payload: userData
            });

            // Отправяем по сокета данные о попытке входа в комнате
            socket.emit('ROOM:JOIN', userData);

            // Получаем массив пользвателей который находятся в комнате
            const data = await request(`/api/room/join/${userData.roomId}`, 'GET').then(serverData => {
                setUsers(serverData.users)
                console.log('app user data', serverData)
            })

            console.log('STATE', state)


        } catch (e) {
            throw new Error(e)
        }


    };

    // Добавляем пользователей в стейт
    const setUsers = users => {
        dispatch({
                type: 'SET_USERS',
                payload: users
            }
        );
        console.log('USER ADD TO STATE', state.users)
    };
    // Добавляем сообщения в стейт
    const addMessage = messages => {
        setAllMessages([...state.messages, messages])

        dispatch({
            type: 'NEW_MESSAGE',
            payload: messages
        })
        console.log('MESSAGE ADD TO STATE', state.messages)
    }


// console.log(state.messages)

    useEffect(() => {
        // Фиксируем вход пользователя в комнату
        socket.on('ROOM:SET_USERS', setUsers);
        socket.on('ROOM:NEW_MESSAGE', addMessage)
    }, []);

    return (
        <div className="App">

            {!state.Joined ? <JoinRoom onLogin={onLogin} socket={socket}/> :

                <Chat {...state} allMessages={allMessages} onAddMessages={addMessage}/>}

        </div>
    );
}

export default App;
