import {useCallback, useState} from 'react'

export const useHttp = () => {
    //Создаем состояние загрузки из сервера, ставим начальное значение false
    const [loading, setLoading] = useState(false);
    // Состояние которое хранит в себе ошибки по умолчанию null
    const [error, setError] = useState(null);

    // оболочка для более удобной работы с запросами
    const request = useCallback(async (url, method = 'GET', body = null, headers = {}) => {

        // Начинаем загрузку
        setLoading(true);

        try {
            // Приводим body в json формат
            if (body) {

                body = JSON.stringify(body);

                // Оповещаем сервер, о том что отпраляем json
                headers['Content-Type'] = 'application/json';

            }
            //Делаем запрос
            const res = await fetch(url, {method, body, headers});

            //Обрабатываем запрос
            const data = await res.json();

            //Если в response ошибка, то выводим её
            if (!res.ok) {

                // Заканчиваем загрузку
                setLoading(false);

                throw new Error(data.message || 'Что-то пошло не так...')
            }


            // Заканчиваем загрузку
            setLoading(false);

            return data

        } catch (e) {
            // Заканчиваем загрузку
            setLoading(false);

            // Определяем ошибку
            setError(e.message);

            throw e
        }
    }, []);
    return {loading, error, request}
};