import React from 'react';
import '../styles/Tile.css';
import eyeRegular from '../../../public/eye-regular';
import eyeSolid from '../../../public/eye-solid';
// import ls from 'local-storage';
import axios from 'axios';

class Tile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            audioPlaying: this.props.audioPlaying,
            isClicked: false,
            isSeen: false
        };
        this.handleClick = this.handleClick.bind(this);
        this.toggleSeen = this.toggleSeen.bind(this);
        this.saveAudioTime = this.saveAudioTime.bind(this);
    }

    // componentDidMount() {
    //     fetch(URL)
    //     .then(response => response.json())
    //     .then(json => this.setState({
    //       articles: json.results,
    //       seen: ls.get('seen') || [],
    //       savedDuration: ls.get('savedDuration') || []
    //     }));
    //     this.startInterval()
    //   }

    handleClick() {
        this.setState({
            audioPlaying: !this.state.audioPlaying,
            isClicked: !this.state.isClicked,
            isSeen: this.state.isSeen
        });
        this.props.action();
        async function getUser() {
            try {
                const response = await axios.get('/user?ID=12345');
                console.log(response);
            } catch (error) {
                console.error(error);
            }
        }
        async function postUser() {
            try {
                const res = await axios.post('/user', {
                    seen: this.state.isSeen
                });
                console.log(res)
            } catch (err) {
                console.log(err)
            }
        }
    }
    saveAudioTime() {
        let player = document.getElementById("audio");
        let duration = player.duration;
        let currentTime = player.currentTime;
        console.log(duration, currentTime);
    }
    toggleSeen() {
        this.setState({
            isSeen: !this.state.isSeen,
            isClicked: this.state.isClicked,
            audioPlaying: this.state.audioPlaying
        });
    }
    render() {
        return (
            <div className={this.state.isSeen ? "tile-seen" : "tile"}>
                <div className="container" onClick={this.handleClick}>
                    <div className="title">
                        {this.props.data.title}
                    </div>
                    <div className="date">
                        {this.props.data.date}
                    </div>
                    <div className="speaker">
                        {this.props.data.speaker}
                    </div>
                    <div className="category">
                        {this.props.data.category}
                    </div>
                </div>
                <div className="icon" onClick={this.toggleSeen}>
                    <img className="eye" src={this.state.isSeen ? eyeSolid : eyeRegular}></img>
                </div>

                {(this.state.isClicked && !this.state.audioPlaying) &&
                    <audio id="audio" controls onProgress={this.saveAudioTime}>
                        <source src={this.props.data.audio} type="audio/mpeg"></source>
                    </audio>
                }
            </div>
        )
    }
}

export default Tile;