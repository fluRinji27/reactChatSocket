import React, {useState} from "react";

import './style.css'

const Chat = (state) => {
    const [textArea, setTextArea] = useState('');
    // console.log(users)
    console.log(state.users.users)
    return (
        <div className="Chat">
            <div className="users">
                <h2>В чате ({state.users.users.length}) : </h2>
                <ul>
                    {state.users.users}
                </ul>
            </div>
            <div className="messageBox">
                <div className="message">
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cum, eligendi.</p>
                    <span>Пользователь 1</span>
                </div>
                <div className="message">
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cum, eligendi.</p>
                    <span>Пользователь 1</span>
                </div>

            </div>
            <div className="messageInput">
                <textarea value={textArea} onChange={e => setTextArea(e.target.value)} cols="30" rows="5">

                </textarea>
                <button>Оправить</button>
            </div>

        </div>
    )
}

export default Chat