import React from "react"
import { Switch }  from "@mui/material"


export function Header(){
    return(
        <div className="header__container">
            <div className="left__elements">
              <img className="podcast__img" src="./src/assets/mic.png" alt="mic icon"></img>
              <h1 className="podcast__name">Podify</h1>
            </div>
            <div className="right__elements">
              <button className="search__button">
               <img className="search__bar" src="./src/assets/searching-bar.png" alt="search bar icon"></img>
              </button>
              <Switch className="toggle__switch" />
            </div>
        </div>

    )
}