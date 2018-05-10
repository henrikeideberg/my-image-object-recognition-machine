import React from 'react';

class ModelCtrl extends React.Component {
  constructor () {
    super()
    this.state = {
      inputGalleryIsHidden: true
    }
  }
  
  toggleLog() {
    this.props.toggleLog();
  }
  
  generateInput() {
    this.props.generateInput();
    this.setState({inputGalleryIsHidden: false});
  }
  
  toggleGallery(label) {
    this.props.toggleGallery(label, label);
  }

  createMachine() {
    this.props.createModel();
  }
  
  trainMachine() {
    this.props.trainModel();
  }

  render() {
    var buttonWidth = {
      width: '150px'
    };
    var smallFont = {
      fontSize: 13,
      width: '150px'
    };
    var spanWidth = {
      width: '75px',
      display: 'inline-block'
    };
    return(
      <div className="controlPanelLanel">
        <h4>Model Control</h4>
        <hr />
        <button style={buttonWidth} onClick={this.toggleLog.bind(this)} >
          Show log
        </button>
        <button style={buttonWidth} onClick={this.generateInput.bind(this)} >
          Generate input
        </button>
        {!this.state.inputGalleryIsHidden && <div style={smallFont}>
          <p>Click below categories to view the images selected for training and test</p>
          <span style={spanWidth} onClick={() => {this.toggleGallery('training')}}>Training</span>
          <span onClick={() => {this.toggleGallery('test')}}>Test</span>
        </div>}
        <br />
        <button style={buttonWidth} onClick={this.createMachine.bind(this)} >
          Create Machine
        </button>
        <button style={buttonWidth} onClick={this.trainMachine.bind(this)} >
          Train Machine
        </button>
      </div>
    );
  }
}
 
export default ModelCtrl;