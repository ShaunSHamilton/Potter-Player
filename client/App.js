import React from 'react';
import './src/styles/App.css';
import Tiles from './src/Components/Tiles';
//import { getAllSermons } from '../../server/app';


class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
    };
  }

  componentDidMount() {
    const getAPI = async () => {
      const res = await getAllSermons();
      const data = await res.json();
      this.setState({
        response: data,
        filteredData: data,
        isLoading: false,
      });
    }
    //getAPI();
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
