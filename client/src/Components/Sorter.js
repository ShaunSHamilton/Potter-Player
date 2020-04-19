import React, { useState, useEffect } from 'react';
import '../styles/Sorter.css';

const Sorter = (props) => {
    const [filteredData, setFilteredData] = useState(props.data);
    // useEffect(() => {
    //     searcher();
    // })
    const searcher = (event) => {
        let items = filteredData;
        items = items.filter((item) => {
            return item.title.toLowerCase().search(event.target.value.toLowerCase()) !== -1;
        });
        setFilteredData(items);
    }
    return (
        <div className="sorter">
            <input id="text" type="text" placeholder="Search" name="search" onKeyUp={searcher}></input>
            <label>Sort by</label>
            <input type="button" name="date" value="Date"></input>
            <label>Sort by</label>
            <input type="button" name="speaker" value="Speaker"></input>
            {props.children}
        </div>
    );
}

export default Sorter;