import React from 'react';
import './src/styles/App.css';
import Tiles from './src/Components/Tiles';
import axios from 'axios';


class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
    };
  }

  componentDidMount() {
    const getAPI = async () => {
      try {
        // let res = await axios.get('http://localhost:5000/updateDB')
        // console.log(res);
        const res = await axios.get('http://localhost:5000/');
        const data = await res.data
        this.setState({
          response: data,
          filteredData: data,
          isLoading: false,
        });
      } catch (err) {
        console.log(err);
      }
    }
    getAPI();
  }

  render() {
    if (this.state.isLoading) {
      return (<div><h2>Data is loading...</h2></div>);
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
