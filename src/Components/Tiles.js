import React, { useState } from 'react';
import Tile from './Tile';
import Scroller from './Scroller';
import '../styles/Tiles.css';
import '../styles/Sorter.css';

const Tiles = (props) => {
    const [tileData, setTileData] = useState(props.data.slice(0, 10));
    const [isFetching, setIsFetching] = Scroller(fetchMoreListItems);
    const [filteredData] = useState(props.data);
    const [audioPlaying, setAudioPlaying] = useState(false);
    const [c, setC] = useState(10);

    function fetchMoreListItems() {
        setTileData((prevState) => ([...prevState, props.data.slice(c, c + 10)].flat()));
        setIsFetching(false);
        setC(c + 10)
    }

    const searcher = (event) => {
        let items = filteredData;
        items = items.filter((item) => {
            return item.title.toLowerCase().search(event.target.value.toLowerCase()) !== -1;
        });
        setTileData(items);
    }
    const searchDate = () => {
        let items = filteredData;
        items = items.sort((a, b) => {
            return Date.parse(a.date) - Date.parse(b.date);
        });
        setTileData(items);
    }
    const searchSpeaker = () => {
        let items = filteredData;
        items = items.sort((a, b) => {
            return (a.speaker > b.speaker) ? 1 : (a.speaker < b.speaker) ? -1 : 0;
        });
        setTileData(items);
    }
    const searchSeen = () => {
        let items = filteredData;
        items = items.filter((item) => {
            return item.unseen ? true : false;
        });
        setTileData(items);
    }

    const playerHandle = () => {
        setAudioPlaying(!audioPlaying)
    }

    return (
        <div className='tiles'>
            <div className="sorter">
                <input id="text" type="text" placeholder="Search" name="search" onKeyUp={searcher}></input>
                <label>Sort by</label>
                <input id="btn-date" type="button" name="date" value="Date" onClick={searchDate}></input>
                <label>Sort by</label>
                <input id="btn-speaker" type="button" name="speaker" value="Speaker" onClick={searchSpeaker}></input>
                <label>Sort by</label>
                <input id="btn-unseen" type="button" name="unseen" value="Unseen" onClick={searchSeen}></input>
            </div>
            {tileData.map((x) => <Tile action={playerHandle} audioPlaying={audioPlaying} key={x.id} data={x} />)}
            {isFetching && <h3>Fetching Data</h3>}
        </div>
    );
}

export default Tiles