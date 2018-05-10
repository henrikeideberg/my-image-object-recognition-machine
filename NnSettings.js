import React from 'react';
import MySaveButton from './MySaveButton';
import MySelect from './MySelect';
import MyInput from './MyInput';

class NnSettings extends React.Component {
  constructor () {
    super()
    this.state = {
      nrOfLayers: ['1'],
      activeLayer: 0,
      nrOfNeurons: ['6'],
      activationFunction: ['relu'],
      filterInitializer: ['varianceScaling'],
      layerConfigIsHidden: false,
      saveButtonBackgroundColor: 'black',
      saveButtonText: 'Save'
    }
    
    this.activationFunctions = ['softmax', 'relu', 'elu', 'hardsigmoid', 'linear', 'relu6', 'selu', 'sigmoid', 'softplus', 'softsign', 'tanh', 'none'];
    this.filterInitialisers = ['varianceScaling', 'constant', 'glorotNormal', 'glorotUniform', 'heNormal', 'identity', 'leCunNormal', 'ones', 'orthogonal', 'randomNormal', 'randomUniform', 'truncatedNormal', 'zeros', 'none'];
  }
  
  unsetSaveButton(){
    this.setState({saveButtonBackgroundColor: 'black'});
    this.setState({saveButtonText: 'Save'});
  }
  
  decreaseNrOfLayers(){
    if(this.state.nrOfLayers.length > 1){
      if(this.state.nrOfLayers.length === this.state.activeLayer + 1){//To not delete the displayed layer
        let newActiveState = this.state.activeLayer - 1;
        this.setState({activeLayer: newActiveState}, function () {
          //Decrease number of layers
          let newNrOfLayersArray = this.state.nrOflayers;
          newNrOfLayersArray.pop();
          //Decrease also all the other arrays
          let nrOfNeuronsArray = this.state.nrOfNeurons;
          nrOfNeuronsArray.pop();
          let newActivationFunctionArray = this.state.activationFunction;
          newActivationFunctionArray.pop();
          let newFilterInitializerArray = this.state.filterInitializer;
          newFilterInitializerArray.pop();
          this.setState({
            nrOfLayers: newNrOfLayersArray,
            nrOfNeurons: nrOfNeuronsArray,
            activationFunction: newActivationFunctionArray,
            filterInitializer: newFilterInitializerArray}, function () {
              this.unsetSaveButton();
              if(this.state.nrOfLayers.length === 0){
                this.setState({layerConfigIsHidden: true});
              }
          });
        });
      }
      else {
        //Decrease number of layers
        let newNrOfLayersArray = this.state.nrOfLayers;
        newNrOfLayersArray.pop();
        //Decrease also all the other arrays
        let nrOfNeuronsArray = this.state.nrOfNeurons;
        nrOfNeuronsArray.pop();
        let newActivationFunctionArray = this.state.activationFunction;
        newActivationFunctionArray.pop();
        let newFilterInitializerArray = this.state.filterInitializer;
        newFilterInitializerArray.pop();
        this.setState({
          nrOfLayers: newNrOfLayersArray,
          nrOfNeurons: nrOfNeuronsArray,
          activationFunction: newActivationFunctionArray,
          filterInitializer: newFilterInitializerArray}, function () {
            this.unsetSaveButton();
            if(this.state.nrOfLayers.length === 0){
              this.setState({layerConfigIsHidden: true});
            }
        });
      }
    }
  }
  
  increaseNrOfLayers(){
    //Increase number of layers with one
    let currentNrOfLayers = this.state.nrOfLayers.length;
    let newNrOfLayers = currentNrOfLayers+1;
    let newNrOfLayersArray = this.state.nrOfLayers;
    newNrOfLayersArray.push(newNrOfLayers);
    //Expand also all the other arrays (use default values)
    let nrOfNeuronsArray = this.state.nrOfNeurons;
    nrOfNeuronsArray.push('6');
    let newActivationFunctionArray = this.state.activationFunction;
    newActivationFunctionArray.push('relu');
    let newFilterInitializerArray = this.state.filterInitializer;
    newFilterInitializerArray.push('varianceScaling');
    this.setState({
      nrOflayers: newNrOfLayersArray,
      nrOfNeurons: nrOfNeuronsArray,
      activationFunction: newActivationFunctionArray,
      filterInitializer: newFilterInitializerArray}, function () {
        this.unsetSaveButton();
        this.setState({layerConfigIsHidden: false});
    });
  }
  
  handleNrOfNeuronsChange(event){
    let nrOfNeuronsArray = this.state.nrOfNeurons;
    nrOfNeuronsArray[this.state.activeLayer] = event.target.value;
    this.setState({nrOfNeurons: nrOfNeuronsArray}, function () {
      this.unsetSaveButton();
    });
  }
  
  activationFuncChange(event){
    let activationFunctionArray = this.state.activationFunction;
    activationFunctionArray[this.state.activeLayer] = event.target.value;
    this.setState({activationFunction: activationFunctionArray}, function () {
      this.unsetSaveButton();
    });
  }
  
  filterInitChange(event) {
    var filterInitArray = this.state.filterInitializer;
    filterInitArray[this.state.activeLayer] = event.target.value;
    this.setState({filterInitializer: filterInitArray}, function () {
      this.unsetSaveButton();
    });
  }
  
  feedBackSettings() {
    this.props.saveSettings(this.state.nrOfLayers,
                            this.state.nrOfNeurons,
                            this.state.activationFunction,
                            this.state.filterInitializer);
    this.setState({saveButtonBackgroundColor: 'green'});
    this.setState({saveButtonText: 'Saved'});
  }
  
  activeLayerConfigChanged(event) {
    this.setState({activeLayer: event.target.value-1}, function () {
    });
  }

  render() {
    var bigFont = {
      fontSize: 22,
      fontWeight: 'bold',
      textAlign: 'center'
    };
    var exactWidth = {
      width: '50px',
      display: 'inline-block'
    };
    var smallFont = {
      fontSize: 12
    };
    var smallBoldFont = {
      fontWeight: 'bold',
      fontSize: 12
    };
    return(
      <div className="controlPanelLanel">
        <h4>Neural layer(s)</h4>
        <hr />
        <p style={smallFont}>The machine will be configured with a flatten layer 
          (to flatten the output from the convolutional layers) and a 'final' 
          <a href="https://developers.google.com/machine-learning/glossary/#dense_layer"> dense 
          layer (fully connected layer)</a> with number of 
          <a href="https://developers.google.com/machine-learning/glossary/#neuron"> neurons </a>
          set to number of selected categories.
        </p>
        <p style={smallFont}>Between the flatten layer and the 'final' dense layer, 'n' dense 
          layer(s) can be configured according to below:
        </p>
        <p style={smallBoldFont}>Number of dense layers</p>
        <div style={bigFont}>
          <span onClick={this.decreaseNrOfLayers.bind(this)}>-</span>
          <span style={exactWidth}>{this.state.nrOfLayers.length}</span>
          <span onClick={this.increaseNrOfLayers.bind(this)}>+</span>
        </div>
        <br/>
        {!this.state.layerConfigIsHidden && <div>
          <MySelect name="activeLayer" label="Active Layer Config: "
                    onChange={this.activeLayerConfigChanged.bind(this)}
                    items={this.state.nrOfLayers}/>
          <MyInput name="nrOfNeurons" label="Neurons: "
                   onChange={this.handleNrOfNeuronsChange.bind(this)} type="number"
                   value={this.state.nrOfNeurons[this.state.activeLayer]}/>
          <MySelect name="activationFunc" label="Activation Func: "
                    onChange={this.activationFuncChange.bind(this)}
                    items={this.activationFunctions} 
                    value={this.state.activationFunction[this.state.activeLayer]}/>
          <MySelect name="filterInit" label="Filter Initialiser: "
                    onChange={this.filterInitChange.bind(this)}
                    items={this.filterInitialisers}
                    value={this.state.filterInitializer[this.state.activeLayer]}/>
          <MySaveButton buttonBackground={this.state.saveButtonBackgroundColor}
                        buttonText={this.state.saveButtonText}
                        onClick={this.feedBackSettings.bind(this)}/>
        </div>}
      </div>
    );
  }
}
 
export default NnSettings;