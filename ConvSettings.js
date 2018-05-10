import React from 'react';
import MySaveButton from './MySaveButton';
import MySelect from './MySelect';
import MyInput from './MyInput';
import Checkbox from './Checkbox';

class ConvSettings extends React.Component {
  constructor () {
    super()
    this.state = {
      nrOflayers: [1],
      activeLayer: 0,
      filterSize: ['5'],
      nrOfFilters: ['8'],
      strides: ['1'],
      activationFunction: ['relu'],
      filterInitializer: ['varianceScaling'],
      poolLayer: ['1'],
      hidePoolLayerConfig: false,
      poolSize: ['2'],
      poolStrides: ['2'],
      saveButtonBackgroundColor: 'black',
      saveButtonText: 'Save'
    }
    
    this.activationFunctions = ['relu', 'elu', 'hardsigmoid', 'linear', 'relu6', 'selu', 'sigmoid', 'softmax', 'softplus', 'softsign', 'tanh', 'none'];
    this.filterInitialisers = ['varianceScaling', 'constant', 'glorotNormal', 'glorotUniform', 'heNormal', 'identity', 'leCunNormal', 'ones', 'orthogonal', 'randomNormal', 'randomUniform', 'truncatedNormal', 'zeros', 'none'];
    this.poolLayerCheckbox = true;
    
    this.activeLayerConfigChanged = this.activeLayerConfigChanged.bind(this);
  }
  
  unsetSaveButton(){
    this.setState({saveButtonBackgroundColor: 'black'});
    this.setState({saveButtonText: 'Save'});
  }
  
  handleFilterSizeChange(event) {
    var filterSizeArray = this.state.filterSize;
    filterSizeArray[this.state.activeLayer] = event.target.value;
    this.setState({filterSize: filterSizeArray}, function () {
      this.unsetSaveButton();
    });
  }
  
  handleNrOfFiltersChange(event) {
    var nrOfFiltersArray = this.state.nrOfFilters;
    nrOfFiltersArray[this.state.activeLayer] = event.target.value;
    this.setState({nrOfFilters: nrOfFiltersArray}, function () {
      this.unsetSaveButton();
    });
  }
  
  handleStridesChange(event) {
    var stridesArray = this.state.strides;
    stridesArray[this.state.activeLayer] = event.target.value;
    this.setState({strides: stridesArray}, function () {
      this.unsetSaveButton();
    });
  }
  
  activationFuncChange(event){
    var activationFunctionArray = this.state.activationFunction;
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
  
  activeLayerConfigChanged(event) {
    this.setState({activeLayer: event.target.value-1}, function () {
      //Not sure if something should be done here
    });
  }
  
  savePoolingOption(label) {
    this.poolLayerCheckbox = !this.poolLayerCheckbox;
    if(this.poolLayerCheckbox && this.state.poolLayer[this.state.activeLayer] === '1') {
      //do nothing we have already correct settings
    }
    else if(!this.poolLayerCheckbox && this.state.poolLayer[this.state.activeLayer] === '0'){
      //do nothing we have already correct settings
    }
    else {
      let newPoolLayerArray = this.state.poolLayer;
      if(this.state.poolLayer[this.state.activeLayer] === '0') {
        newPoolLayerArray[this.state.activeLayer] = '1';
      }
      else {
        newPoolLayerArray[this.state.activeLayer] = '0';
      }
      this.setState({poolLayer: newPoolLayerArray}, function () {
        this.unsetSaveButton();
      });
    }
  }
  
  saveClickedLabelFeedback(label) {
    //Do nothing
  }
  
  decreaseNrOfLayers(){
    if(this.state.nrOflayers.length > 1){
      if(this.state.nrOflayers.length === this.state.activeLayer + 1){//To not delete the displayed layer
        let newActiveState = this.state.activeLayer - 1;
        this.setState({activeLayer: newActiveState}, function () {
          //Decrease number of layers
          let newNrOfLayersArray = this.state.nrOflayers;
          newNrOfLayersArray.pop();
          //Decrease also all the other arrays
          let newFilterSizeArray = this.state.filterSize;
          newFilterSizeArray.pop();
          let newNrOfFoltersArray = this.state.nrOfFilters;
          newNrOfFoltersArray.pop();
          let newStrides = this.state.strides;
          newStrides.pop();
          let newActivationFunctionArray = this.state.activationFunction;
          newActivationFunctionArray.pop();
          let newFilterInitializerArray = this.state.filterInitializer;
          newFilterInitializerArray.pop();
          let newPoolLayerArray = this.state.poolLayer;
          newPoolLayerArray.pop();
          let newPoolSizeArray = this.state.poolSize;
          newPoolSizeArray.pop();
          let newpoolStridesArray = this.state.poolStrides;
          newpoolStridesArray.pop();
          /*
          this.setState({
            nrOflayers: newNrOfLayersArray,
            filterSize: newFilterSizeArray,
            nrOfFilters: newNrOfFoltersArray,
            strides: newStrides,
            activationFunction: newActivationFunctionArray,
            filterInitializer: newFilterInitializerArray,
            poolLayer: newPoolLayerArray,
            poolSize: newPoolSizeArray,
            poolStrides: newpoolStridesArray
          });
          */
          this.setState({
            nrOflayers: newNrOfLayersArray,
            filterSize: newFilterSizeArray,
            nrOfFilters: newNrOfFoltersArray,
            strides: newStrides,
            activationFunction: newActivationFunctionArray,
            filterInitializer: newFilterInitializerArray,
            poolLayer: newPoolLayerArray,
            poolSize: newPoolSizeArray,
            poolStrides: newpoolStridesArray}, function () {
              this.unsetSaveButton();
          });
        });
      }
      else {
        //Decrease number of layers
        let newNrOfLayersArray = this.state.nrOflayers;
        newNrOfLayersArray.pop();
        //Decrease also all the other arrays
        let newFilterSizeArray = this.state.filterSize;
        newFilterSizeArray.pop();
        let newNrOfFoltersArray = this.state.nrOfFilters;
        newNrOfFoltersArray.pop();
        let newStrides = this.state.strides;
        newStrides.pop();
        let newActivationFunctionArray = this.state.activationFunction;
        newActivationFunctionArray.pop();
        let newFilterInitializerArray = this.state.filterInitializer;
        newFilterInitializerArray.pop();
        let newPoolLayerArray = this.state.poolLayer;
        newPoolLayerArray.pop();
        let newPoolSizeArray = this.state.poolSize;
        newPoolSizeArray.pop();
        let newpoolStridesArray = this.state.poolStrides;
        newpoolStridesArray.pop();
        this.setState({
          nrOflayers: newNrOfLayersArray,
          filterSize: newFilterSizeArray,
          nrOfFilters: newNrOfFoltersArray,
          strides: newStrides,
          activationFunction: newActivationFunctionArray,
          filterInitializer: newFilterInitializerArray,
          poolLayer: newPoolLayerArray,
          poolSize: newPoolSizeArray,
          poolStrides: newpoolStridesArray}, function () {
            this.unsetSaveButton();
        });
      }
    }
  }
  
  increaseNrOfLayers(){
    //Increase number of layers with one
    let currentNrOfLayers = this.state.nrOflayers.length;
    let newNrOfLayers = currentNrOfLayers+1;
    let newNrOfLayersArray = this.state.nrOflayers;
    newNrOfLayersArray.push(newNrOfLayers);
    //Expand also all the other arrays (use default values)
    let newFilterSizeArray = this.state.filterSize;
    newFilterSizeArray.push('5');
    let newNrOfFoltersArray = this.state.nrOfFilters;
    newNrOfFoltersArray.push('8');
    let newStrides = this.state.strides;
    newStrides.push('1');
    let newActivationFunctionArray = this.state.activationFunction;
    newActivationFunctionArray.push('relu');
    let newFilterInitializerArray = this.state.filterInitializer;
    newFilterInitializerArray.push('varianceScaling');
    let newPoolLayerArray = this.state.poolLayer;
    newPoolLayerArray.push('1');
    let newPoolSizeArray = this.state.poolSize;
    newPoolSizeArray.push('2');
    let newpoolStridesArray = this.state.poolStrides;
    newpoolStridesArray.push('2');
    this.setState({
      nrOflayers: newNrOfLayersArray,
      filterSize: newFilterSizeArray,
      nrOfFilters: newNrOfFoltersArray,
      strides: newStrides,
      activationFunction: newActivationFunctionArray,
      filterInitializer: newFilterInitializerArray,
      poolLayer: newPoolLayerArray,
      poolSize: newPoolSizeArray,
      poolStrides: newpoolStridesArray
    }, function () {
      this.unsetSaveButton();
    });
  }
  
  handlePoolsizeChange(event){
    var poolSizeArray = this.state.poolSize;
    poolSizeArray[this.state.activeLayer] = event.target.value;
    this.setState({poolSize: poolSizeArray}, function () {
      this.unsetSaveButton();
    });
  }
  
  handlePoolStridesChange(event){
    var poolStridesArray = this.state.poolStrides;
    poolStridesArray[this.state.activeLayer] = event.target.value;
    this.setState({poolStrides: poolStridesArray}, function () {
      this.unsetSaveButton();
    });
  }
  
  feedBackSettings() {
    this.props.saveSettings(this.state.nrOflayers,
                            this.state.filterSize,
                            this.state.nrOfFilters,
                            this.state.strides,
                            this.state.activationFunction,
                            this.state.filterInitializer,
                            this.state.poolLayer,
                            this.state.poolSize,
                            this.state.poolStrides);
    this.setState({saveButtonBackgroundColor: 'green'});
    this.setState({saveButtonText: 'Saved'});
  }

  render() {
    var smallFont = {
      fontSize: 12
    };
    var bigFont = {
      fontSize: 22,
      fontWeight: 'bold',
      textAlign: 'center'
    };
    var exactWidth = {
      width: '50px',
      display: 'inline-block'
    };
    var smallBoldFont = {
      fontWeight: 'bold',
      fontSize: 12
    };
    var filterSizeTooltipText = <p style={smallFont}>
          The size of the sliding 
          <a href="https://developers.google.com/machine-learning/glossary/#convolutional_filter"> convolutional filter
          </a> window(s) to be applied to the input data.
        </p>;
    var nrOfFiltersTooltipText = <p style={smallFont}>The number of filter windows of size 
          'filter size' to apply to the input data.
        </p>
    var stridesTooltipText = <p style={smallFont}>The "step size" of the sliding window, i.e. 
          how many pixels the filter will shift each time it moves over the image. 
          E.g. when we specify strides of 1, it means that the filter will slide over the image in 
          steps of 1 pixel.
        </p>;
    var actFuncTooltipText = <p style={smallFont}>The 
          <a href="https://developers.google.com/machine-learning/glossary/#activation_function"> activation function </a>
          to apply to the data after the convolution is complete. Recommendation is to apply a 
          <a href="https://developers.google.com/machine-learning/glossary/#ReLU"> Rectified Linear Unit (ReLU) function</a>
          , which is a very common activation function in machine learning.
        </p>;
    var filterInitTooltipText = <p style={smallFont}>The method to use for randomly initializing the 
          model weights, which is very important to training dynamics. VarianceScaling is generally 
          a good <a href="https://js.tensorflow.org/api/latest/index.html#class:initializers.Initializer"> initializer </a>
          choice.
        </p>;
    var poolzieToolTipText = <p style={smallFont}>The size of the sliding pooling windows to be applied 
          to the input data. If set to e.g. 2, a poolSize of [2,2] will be applied. 
          Which means that the pooling layer will apply 2x2 windows to the input data.
        </p>;
    var poolStridesToolTipText = <p style={smallFont}>The "step size" of the sliding pooling window, 
          i.e., how many pixels the window will shift each time it moves over the input data. 
          E.g. if we specify strides of [2, 2], then the filter will slide over the image in steps 
          of 2 pixels in both horizontal and vertical directions.
        </p>;
    return(
      <div className="controlPanelLanel">
        <h4>Convolutional layer(s)</h4>
        <hr />
        <p style={smallFont}>Here you can configure 2D 
          <a href="https://developers.google.com/machine-learning/glossary/#convolution"> convolutional </a>
          layer(s). Each layer can be configured with settings according to below.
        </p>
        <p style={smallFont}>The first configured layer will have a fixed input shape which will 
          match the size of the input data (i.e. input shape is equal to image heigth and width).
          More layers will have 'auto' input shape.
        </p>
        <p style={smallBoldFont}>Number of Convolutional layers</p>
        <div style={bigFont}>
          <span onClick={this.decreaseNrOfLayers.bind(this)}>-</span>
          <span style={exactWidth}>{this.state.nrOflayers.length}</span>
          <span onClick={this.increaseNrOfLayers.bind(this)}>+</span>
        </div>
        <br/>
        <p style={smallBoldFont}>Layer configuration</p>
        <MySelect name="activeLayer" label="Active Layer Config: "
                  onChange={this.activeLayerConfigChanged}
                  items={this.state.nrOflayers}/>
        <MyInput name="filterSize" label="Filter Size: "
                 onChange={this.handleFilterSizeChange.bind(this)} type="number"
                 tooltip={true} tooltiptext={filterSizeTooltipText}
                 value={this.state.filterSize[this.state.activeLayer]}/>
        <MyInput name="nrOfFilters" label="Filter(s): "
                 onChange={this.handleNrOfFiltersChange.bind(this)} type="number"
                 tooltip={true} tooltiptext={nrOfFiltersTooltipText}
                 value={this.state.nrOfFilters[this.state.activeLayer]}/>
        <MyInput name="strides" label="Strides: "
                 onChange={this.handleStridesChange.bind(this)} type="number"
                 tooltip={true} tooltiptext={stridesTooltipText}
                 value={this.state.strides[this.state.activeLayer]}/>
        <MySelect name="activationFunc" label="Activation Func: "
                  onChange={this.activationFuncChange.bind(this)}
                  items={this.activationFunctions} 
                  value={this.state.activationFunction[this.state.activeLayer]}
                  tooltip={true} tooltiptext={actFuncTooltipText}/>
        <MySelect name="filterInit" label="Filter Initialiser: "
                  onChange={this.filterInitChange.bind(this)}
                  items={this.filterInitialisers}
                  value={this.state.filterInitializer[this.state.activeLayer]}
                  tooltip={true} tooltiptext={filterInitTooltipText}/>
        <p></p>
        <Checkbox label='poolingEnabled'
                  handleCheckboxChange={this.savePoolingOption.bind(this)}
                  clickedLabel={this.saveClickedLabelFeedback}/>
        {this.state.poolLayer[this.state.activeLayer] === '1' && 
          <MyInput name="poolSize" label="Poolsize: "
                   onChange={this.handlePoolsizeChange.bind(this)} type="number"
                   tooltip={true} tooltiptext={poolzieToolTipText}
                   value={this.state.poolSize[this.state.activeLayer]}/>}
        {this.state.poolLayer[this.state.activeLayer] === '1' && 
          <MyInput name="poolStrides" label="Strides: "
                   onChange={this.handlePoolStridesChange.bind(this)} type="number"
                   tooltip={true} tooltiptext={poolStridesToolTipText}
                   value={this.state.poolStrides[this.state.activeLayer]}/>}
        <MySaveButton buttonBackground={this.state.saveButtonBackgroundColor}
                      buttonText={this.state.saveButtonText}
                      onClick={this.feedBackSettings.bind(this)}/>
      </div>
    );
  }
}
 
export default ConvSettings;