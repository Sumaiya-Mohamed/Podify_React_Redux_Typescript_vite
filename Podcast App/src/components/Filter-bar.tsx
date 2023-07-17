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
          <option>Option 1</option>
          <option>Option 2</option>
          <option>Option 3</option>
        </select>
        </div>
        </div>
    )
}