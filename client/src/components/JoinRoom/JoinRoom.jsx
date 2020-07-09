import React, {useEffect, useState} from "react";
import {useHttp} from "../../hooks/http.hook";
import {useMessage} from "../../hooks/message.hook"
import "./style.css"


const JoinRoom = ({onLogin, socket}) => {

    const message = useMessage();

    // Состояние которое хранит в себе номер комнаты
    const [roomId, setRoomId] = useState('');

    // Состояние которое хранит в себе имя пользователя
    const [userName, setUserName] = useState('');

    const [isLoading, setLoading] = useState(false);

    // http хук который отправляет запросы на сервер
    const {request, error, clearError, loading} = useHttp();

    useEffect(() => {
        console.log(error);
        message(error);
        clearError()
    }, [error, message]);

    // Асинхронная функция которая при нажатии на кнопку войти отправляет данные
    const onJoin = async () => {
        setLoading(true);
        try {

            // Получаем id сокет соединения
            let socketId = socket.id;

            // Обьект который содержит в себе данные пользователя
            const userData = {
                roomId,
                userName,
                socketId
            };

            // Отправка данных на сервер
            const data = await request('/api/room/join', 'POST', userData);

            // Вызываем функцию которая подтверждает вход в комнату  и передаем ей данный для входа
            onLogin(userData);


        } catch (e) {
            setLoading(false)


        }
    };

    return (
        <div className="container center-align">
            <div className="row input-field__auth">
                <div className="input-field  col s6">
                    <input id="icon_prefix" type="text" className="validate"
                           value={roomId}
                           onChange={e => setRoomId(e.target.value)}/>
                    <label htmlFor="icon_prefix">Номер комнаты</label>
                </div>
            </div>
            <div className="row input-field__auth">
                <div className="input-field col  s6">
                    <input id="icon_telephone" type="tel" className="validate"
                           onChange={e => setUserName(e.target.value)}/>
                    <label htmlFor="icon_telephone">Имя пользователя</label>
                </div>

            </div>
            <div className="row">
                <button className="btn waves-effect waves-light" disabled={loading} onClick={onJoin}>{loading ?
                    <span>Вход...</span>
                    : <span>Войти<i className="material-icons right">send</i></span>}</button>
            </div>


        </div>


    )
};

export default JoinRoom

