import React, {useEffect, useRef, useState} from "react";

import Messages from "./Messages"
import NavBar from "../Navbar/Navbar";
import ChatInput from "./ChatInput";

import socket from "../../hooks/socket.hook";
import './style.css'


const Chat = ({disconnectUser, users, messages, userName, roomId, onAddMessages}) => {

    // Стейты
    const [allMessages, setAllMessages] = useState([]);

    // Ссылки
    const messageRef = useRef(null);

    // Инициалищация модальных окон
    window.M.AutoInit();

    // Отправка сообщений
    const onSendMessage = async (textArea) => {
        try {
            const message = {
                roomId,
                userName,
                text: textArea
            };
            setAllMessages([...messages, messages]);
            //Отправляем сообщение в корневой файл
            onAddMessages(message);
            // Оповещам соекеты о новом сообщении
            socket.emit('ROOM:NEW_MESSAGE', message);

        } catch (e) {
            throw e
        }

    };

    const scrollMessages = () => {
        messageRef.current.scrollTo(0, messageRef.current.scrollHeight)
    };

    useEffect(() => {
        // скролл на последнее сообщение
        scrollMessages()
    }, [messages]);


    return (

        <div className="Chat">
            <NavBar disconnectUser={disconnectUser} roomId={roomId} userName={userName}/>
            <div className="row Main">
                <div className=" usersContainer">
                    <div className="col s12 m12 users">
                        <button data-target="modal1" className="btn modal-trigger btn-open-user-modal">Пользователей:
                            {' ' + users.length}
                        </button>
                        <ul className={'userModal hide-on-med-and-down'}>
                            {users.map((user, index) => (
                                    <li key={user + index}>
                                        <div className="chip">
                                            <img src="#" alt=""/>
                                            <span>{user}</span>
                                        </div>
                                    </li>
                                )
                            )}
                        </ul>
                        <div id="modal1" className="modal">
                            <div className="modal-content">
                                <h4>Пользователей: {users.length}</h4>
                                <ul>
                                    {users.map((user, index) => (
                                        <li key={user + index}>
                                            <div className="chip">
                                                <img src="#" alt="img"/>
                                                <span>{user}</span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col s12 m12 messageContainer">

                    <div ref={messageRef} className="messageBox">

                        <Messages allMessages={allMessages} socketMessages={messages}/>

                    </div>

                    <ChatInput onSendMessage={onSendMessage}/>
                </div>

            </div>

        </div>

    )
};


export default Chat


