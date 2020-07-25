import React, {useEffect, useRef, useState} from "react";

const ChatInput = ({onSendMessage}) => {

    const [textArea, setTextArea] = useState('');
    const textAreaRef = useRef(null);


    //Автоматическая адаптация размера под содержимое тектсового поля
    useEffect(() => {
        const clientHeight = 42;
        const scrollHeight = textAreaRef.current.scrollHeight;

        if (clientHeight < scrollHeight && scrollHeight < 95) {
            textAreaRef.current.style.height = scrollHeight + 'px';
        } else if (textAreaRef.current.value.length === 0) {
            textAreaRef.current.style.height = clientHeight + 'px';
        }

    }, [textArea]);

    return (
        <div className="col s12 m12  messageInput">

                    <textarea ref={textAreaRef} placeholder='Введите ваше сообщение.' value={textArea}
                              onChange={e => setTextArea(e.target.value)} cols="30" rows="5">

                    </textarea>

            <button className={'btn'} onClick={() => {
                onSendMessage(textArea);
                // Очищаем поле ввода
                setTextArea('')
            }}><i className={"material-icons right"}>send</i>
            </button>

        </div>
    )
};

export default ChatInput