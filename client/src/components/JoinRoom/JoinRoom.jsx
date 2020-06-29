import React, {useState} from "react";
import {useHttp} from "../../hooks/http.hook";

const JoinRoom = ({onLogin}) => {

    // Состояние которое хранит в себе номер комнаты
    const [roomId, setRoomId] = useState('');

    // Состояние которое хранит в себе имя пользователя
    const [userName, setUserName] = useState('');

    // http хук который отправляет запросы на сервер
    const {request} = useHttp();

    // Асинхронная функция которая при нажатии на кнопку войти отправляет данные
    const onJoin = async () => {
        try {
            // console.log('data', roomId, userName);

            // Обьект который содержит в себе данные пользователя
            const userData = {
                roomId,
                userName
            };

            // Отправка данных на сервер
            const data = await request('/api/room/join', 'POST', userData);

            // Вызываем функцию которая подтверждает вход в комнату  и передаем ей данный для входи
            onLogin(userData);

        } catch (e) {

            throw e.message || console.log('Ошибка отправки данных.')

        }
    };

    return (
        <div className="joinMenu">
            <input type="text"
                   placeholder='Номер комнаты'
                   value={roomId}
                   onChange={
                       e => setRoomId(e.target.value)
                   }
            />
            <input type="text"
                   placeholder='Имя пользователя'
                   value={userName}
                   onChange={
                       e => {
                           setUserName(e.target.value)
                       }
                   }
            />
            <button onClick={onJoin}>Войти</button>
        </div>
    )
};

export default JoinRoom

