import React from "react";
import Plot from 'react-plotly.js';

class MyPlot extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
  }
  
  componentDidMount() {
  }

  render() {
    return (
      <Plot
        data={[
          {
            x: this.props.x,
            y: this.props.y,
            type: 'scatter',
            mode: 'lines+points',
            marker: {color: 'red'},
          },
          {type: 'bar', x: this.props.x, y: this.props.y},
        ]}
        layout={ {width: 640, height: 480, title: this.props.title} }
      />
    );
  }
}

export default MyPlot;