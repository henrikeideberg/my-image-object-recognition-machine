import React from 'react';

class Log extends React.Component {
  render() {
    var smallFont = {
      fontSize: 12
    };

    //var consoleEntries = this.props.textToAdd.reverse();
    var consoleEntries = this.props.textToAdd;
    var consoleItems;
    if (typeof consoleEntries !== 'undefined') {
      //Every iteratively created element must have a unique key
      //https://stackoverflow.com/questions/38364400/index-inside-map-function
      consoleItems = consoleEntries.map((currElement, index) => {
        return <span key={index}>{currElement}<br/></span>
      });
    }
    else consoleItems = null;

    return(
      <div className="console">
        <h3>Log (latest event at bottom)</h3>
        <hr />
        <p style={smallFont}>{consoleItems}</p>
      </div>
    );
  }
}
 
export default Log;