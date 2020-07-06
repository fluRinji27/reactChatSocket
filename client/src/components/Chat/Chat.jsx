import React, {useEffect, useRef, useState} from "react";

import socket from "../../hooks/socket.hook";
import './style.css'
import Messages from "./Messages"

const Chat = ({users, messages, userName, roomId, onAddMessages, allMessages}) => {

    const [textArea, setTextArea] = useState('');
    const messageRef = useRef(null);

    const onSendMessage = async () => {
        try {
            const message = {
                roomId,
                userName,
                text: textArea
            };
            //Отправляем сообщение в корневой файл
            onAddMessages(message);
            // Оповещам соекеты о новом сообщении
            socket.emit('ROOM:NEW_MESSAGE', message);
            // Очищаем поле ввода
            setTextArea('')

        } catch (e) {
            throw e
        }

    };
    useEffect(() => {
        // Фокус на последнее сообщение
        messageRef.current.scrollTo(0, 99999)
    }, [messages]);


    return (
        <div className="Chat">
            <div className="users">
                <h1>Комната: {roomId}</h1>
                <h2>В чате ({users.length}) : </h2>
                <ul>
                    {users.map((user, index) => <li key={user + index}><span>{user}</span></li>)}
                </ul>
            </div>
            <div ref={messageRef} className="messageBox">

                <Messages allMessages={allMessages} socketMessages={messages}/>


            </div>
            <div className="messageInput">
                    <textarea placeholder='Введите ваше сообщение.' value={textArea}
                              onChange={e => setTextArea(e.target.value)} cols="30" rows="5">

                    </textarea>
                <button onClick={onSendMessage}>Оправить</button>
            </div>

        </div>
    )
}

export default Chat
