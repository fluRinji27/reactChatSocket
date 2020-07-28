import React, {useEffect, useState} from "react";
import {Redirect} from "react-router-dom";
import "./style.css"
import socket from "../../hooks/socket.hook";

export const NavBar = ({roomId, userName, disconnectUser}) => {

    const [exitChat, setExitChat] = useState(false);
    const [redirect, setRedirect] = useState(false);

    // Оключаем пользователя от комнаты
    const disconnect = () => {
        console.log('click');
        if (exitChat) {
            socket.emit('ROOM:USER_LEFT');
            console.log('user disconnect');
            disconnectUser();
            setRedirect(true)
        }
    };

    useEffect(() => {
        disconnect();
        if (redirect)
            setRedirect(false)
    }, [exitChat]);

    return (
        <nav>
            <div className="nav-wrapper">
                <a href="#" className="brand-logo">Комната: {roomId}</a>
                <ul id="nav-mobile" className="right ">
                    <li className={'hide-on-small-only'}>
                        <div className="profile">
                            <div className="chip">
                                <img src="#" alt=""/>
                                <span>{userName}</span>
                            </div>
                        </div>
                    </li>
                    <li>
                        <button className={"btn_noStyle"} onClick={() => setExitChat(true)}>
                            {redirect ? <Redirect to='/auth'/> : <i className={"material-icons right"}>exit_to_app</i>}


                        </button>

                    </li>
                </ul>
            </div>
        </nav>
    )
};

export default NavBar