import React, {useReducer} from 'react';
import JoinRoom from "./components/JoinRoom/JoinRoom";
import reducer from "./redux/reducer";
import socket from "./hooks/socket.hook";


function App() {
    const [state, dispatch] = useReducer(reducer, {
        Joined: false,
        roomId: null,
        userName: null

    });

    const onLogin = (userData) => {
        dispatch({
            type: 'JOINED',
            payload: userData
        });
        socket.emit('ROOM:JOIN', userData)
    };

    console.log(state);

    return (
        <div className="App">
            {!state.Joined && <JoinRoom onLogin={onLogin}/>}
        </div>
    );
}

export default App;
