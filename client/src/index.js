import React from 'react';
import ReactDOM from 'react-dom';
import {Route, BrowserRouter} from 'react-router-dom'
import App from './App';


ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>

            <Route path="/">
                <App/>
            </Route>

        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById('root')
);


