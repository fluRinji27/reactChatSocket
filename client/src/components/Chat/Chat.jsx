import React, {useState} from "react";
import socket from "../../hooks/socket.hook";
import './style.css'
import {useHttp} from "../../hooks/http.hook";


const Chat = ({users, messages, userName, roomId, onAddMessages}) => {
    const [textArea, setTextArea] = useState('');

    const onSendMessage = () => {
        socket.emit('ROOM:NEW_MESSAGE', {
            roomId,
            userName,
            text: textArea
        });

        onAddMessages({
            roomId,
            userName,
            text: textArea
        });

        setTextArea('')
    };

    return (
        <div className="Chat">
            <div className="users">
                <h2>В чате ({users.length}) : </h2>
                <ul>
                    {users.map((user, index) => <li key={user + index}>{user}</li>)}
                </ul>
            </div>
            <div className="messageBox">
                {messages.map((message) => (
                    <div className="message">
                        <p>{message.text}</p>
                        <span> {message.userName}</span>
                    </div>
                ))}
            </div>
            <div className="messageInput">
                <textarea value={textArea} onChange={e => setTextArea(e.target.value)} cols="30" rows="5">

                </textarea>
                <button onClick={onSendMessage}>Оправить</button>
            </div>

        </div>
    )
}

export default Chat