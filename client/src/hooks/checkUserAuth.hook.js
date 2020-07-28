import React from "react";
import {Redirect} from 'react-router-dom';

// Проверяем авторизован ли пользователь
const checkUserAuth = (logged, roomId) => {
    if (logged === true)
        return <Redirect to={`/room/${roomId}`}/>;
    return <Redirect to={'/auth'}/>
}

export default checkUserAuth