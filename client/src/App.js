import React, {useEffect, useReducer, useState} from 'react';
import {Route, Switch, Redirect} from 'react-router-dom';


import JoinRoom from "./components/JoinRoom/JoinRoom";
import Chat from "./components/Chat/Chat";
import reducer from "./redux/reducer";

import checkUserAuth from "./hooks/checkUserAuth.hook";
import socket from "./hooks/socket.hook";
import {useHttp} from "./hooks/http.hook";

import "materialize-css";


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

    const [roomId, setRoomId] = useState(null);

    const onLogin = async (userData) => {
        try {
            setRoomId(userData.roomId);
            // Доабвляем в стейт данные о пользователе
            dispatch({
                type: 'JOINED',
                payload: userData
            });

            // Отправяем по сокета данные о попытке входа в комнате
            socket.emit('ROOM:JOIN', userData);

            // Получаем массив пользвателей который находятся в комнате
            const data = await request(`/api/room/join/${userData.roomId}`, 'GET').then(serverData => {
                setUsers(serverData.users)

            });


        } catch (e) {
            // throw new Error(e) || console.log('Ошибка входа в комнату!')
        }


    };

    // Добавляем пользователей в стейт
    const setUsers = users => {
        dispatch({
                type: 'SET_USERS',
                payload: users
            }
        );
    };

    // Добавляем сообщения в стейт
    const addMessage = messages => {
        setAllMessages([...state.messages, messages])

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


    return (
        <div className="App">

            {// Проверяем авторизован ли пользователь
                checkUserAuth(state.Joined, roomId)
            }
            <Switch>
                <Route path={`/auth`}>
                    <JoinRoom onLogin={onLogin} socket={socket}/>
                </Route>
                <Route path={`/room/${roomId}`}>
                    <Chat {...state} onAddMessages={addMessage} allMessages={allMessages}/>
                </Route>
                <Redirect from={"/"} to={"/auth"}/>
            </Switch>
        </div>
    );
}

{/*<Chat {...state} onAddMessages={addMessage} allMessages={allMessages}/>*/
}

export default App;
