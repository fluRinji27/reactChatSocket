import React from "react";
import "./style.css"

export const NavBar = ({roomId, userName}) => {
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
                        <button className={"btn_noStyle"}><i
                            className={"material-icons right"}>exit_to_app</i>
                        </button>
                    </li>
                </ul>
            </div>
        </nav>
    )
}

export default NavBar