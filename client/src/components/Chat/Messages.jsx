import React, {useEffect, useState} from "react";

const Messages = (props) => {
    const [isLoaded, setLoading] = useState(false);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        setMessages(props.socketMessages);
        setLoading(true)
    }, [props.socketMessages]);

    return (
        <React.Fragment>
            {
                isLoaded ? messages.map((message, x) => (

                        <div key={message.userName + x} className='message'>
                            <p>{message.text}</p>
                            <span>{message.userName}</span>
                        </div>

                    )
                ) : <h1>No Message</h1>
            }
        </React.Fragment>


    )
}

export default Messages


