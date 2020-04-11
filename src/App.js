import React from 'react';
import logo from './logo.svg';
import './styles/App.css';
import Tiles from './Components/Tiles';
// import sermon_data from './data/sermon_data.json';

const endpoint = "https://raw.githubusercontent.com/Sky020/Potter-Player/master/src/data/sermon_data.json";
class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
    };
  }
  // Get JSON from PythonAnywhere API
  componentDidMount() {
    const getAPI = async () => {
      const res = await fetch(`${endpoint}`);
      const data = await res.json();
      this.setState({
        response: data,
        filteredData: data,
        isLoading: false,
      });
    }
    getAPI();
  }
  render() {
    if (this.state.isLoading) {
      return (<div><h2>Data is loading...</h2><img src={logo} alt="Reactjs"></img></div>);
    }
    return (
      <div className='app'>
        {this.state.isLoading && <h2>Loading Data</h2>}
        <Tiles data={this.state.filteredData} />
      </div>
    );
  }
}

export default App;
