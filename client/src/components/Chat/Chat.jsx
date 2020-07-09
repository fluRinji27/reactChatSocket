import React, {useEffect, useRef, useState} from "react";

import socket from "../../hooks/socket.hook";
import './style.css'
import Messages from "./Messages"

const Chat = ({users, messages, userName, roomId, onAddMessages}) => {

    const [textArea, setTextArea] = useState('');
    const messageRef = useRef(null);
    const [allMessages, setAllMessages] = useState([]);

    const onSendMessage = async () => {
        try {
            const message = {
                roomId,
                userName,
                text: textArea
            };
            setAllMessages([...messages, messages])
            //Отправляем сообщение в корневой файл
            onAddMessages(message);
            // Оповещам соекеты о новом сообщении
            socket.emit('ROOM:NEW_MESSAGE', message);
            scrollBottom(messageRef);
            // Очищаем поле ввода
            setTextArea('')

        } catch (e) {
            throw e
        }

    };

    const scrollBottom = (ref) => {
        let lastDiv;
        console.log('Scrolling...');

    }
    console.log(messages);
    console.log(users);
    useEffect(() => {

        // Фокус на последнее сообщение
        messageRef.current.scrollTo = messageRef.scrollHeight
    }, [messages]);


    return (
        <div className="container Chat">
            <div className="row">
                <div className="col s12 m2 center-align users">

                    <h5>Комната: {roomId}</h5>
                    <span>В чате ({users.length}) : </span>
                    <ul>
                        {users.map((user, index) => <li key={user + index}>
                            <div className="chip">
                                <img src="#" alt="img"/>
                                <span>{user}</span>
                            </div>
                        </li>)}
                    </ul>
                </div>
                <div ref={messageRef} className="col s10 messageBox">

                    <Messages allMessages={allMessages} socketMessages={messages}/>

                </div>
                <div className="col s12 m6 messageInput">
                    <textarea placeholder='Введите ваше сообщение.' value={textArea}
                              onChange={e => setTextArea(e.target.value)} cols="30" rows="5">

                    </textarea>
                    <button onClick={onSendMessage}>Оправить</button>
                </div>
            </div>


        </div>
    )
}

export default Chat
