import React, {useState} from "react";

const ChatInput = ({onSendMessage}) => {
    const [textArea, setTextArea] = useState('');
    return (
        <div className="col s12 m12  messageInput">

                    <textarea placeholder='Введите ваше сообщение.' value={textArea}
                              onChange={e => setTextArea(e.target.value)} cols="30" rows="5">

                    </textarea>

            <button className={'btn'} onClick={() => {
                onSendMessage(textArea)
                // Очищаем поле ввода
                setTextArea('')
            }}><i className={"material-icons right"}>send</i>
            </button>

        </div>
    )
};

export default ChatInput