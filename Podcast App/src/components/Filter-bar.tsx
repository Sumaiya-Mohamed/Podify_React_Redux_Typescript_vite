import React from "react"


export function FilterBar(){

    return(
        <div>
            <h3 className="heading__check">Check out our available shows!</h3>
        <div className="filter__bar">
        <div className="filter__heading">
         <p>Sort By:</p>
        </div>
        <select className="filter__select">
          <option>A-Z</option>
          <option>Z-A</option>
          <option>MOST RECENT</option>
          <option>LEAST RECENT</option>
        </select>
        </div>
        </div>
    )
}