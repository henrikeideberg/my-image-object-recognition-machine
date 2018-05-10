import React, { Component } from 'react';
import './App.css';
import Gallery from './Gallery';
import InputSetting from './InputSetting';
import ModelSettings from './ModelSettings';
import ConvSettings from './ConvSettings';
import NnSettings from './NnSettings';
import ModelCtrl from './ModelCtrl';
import Log from './Log';
import {getImageUrls_color, getImageUrls_gray, getImageUrls_binary} from './ImageUrls';
import {Model} from './Model';
import {ImageData} from './Data';
import MyPlot from './MyPlot';

class App extends Component {
  constructor(props, context) {//Class constructor
    super(props, context);
    
    //Class state variables which will trigger rerendering when changed
    this.state = {
      galleryUrls: [],
      galleryLabels: [],
      galleryFormat: 'gray',
      galleryIsHidden: true,
      predictionGalleryIsHidden: true,
      controlPanelIsHidden: false,
      logIsHidden: true,
      outputIsHidden: true,
      trainingIsComplete: false,
      modelData: null,
      model: null,
      trainingHistory: null,
      predictedLabelsData: [],
      predictionGalleryLabels: [],
      predictionRatio: null,
      trainProgress: 0,
      console: [],
    }

    this.initModel = this.initModel.bind(this);
    this.toggleGallery = this.toggleGallery.bind(this);
    this.saveFeedbackFromInputSettings = this.saveFeedbackFromInputSettings.bind(this);
    this.saveFeedbackFromModelSettings = this.saveFeedbackFromModelSettings.bind(this);
    this.saveFeedbackFromConvSettings = this.saveFeedbackFromConvSettings.bind(this);
    this.saveFeedbackFromNnSettings = this.saveFeedbackFromNnSettings.bind(this);
    this.toggleLog = this.toggleLog.bind(this);
    this.createModel = this.createModel.bind(this);
    this.trainModel = this.trainModel.bind(this);
    this.logToConsole = this.logToConsole.bind(this);

    //Model related variables. Initialise them here. They can be updated later on
    this.inputSettings = {
      categories: new Set(),
      format: 'gray',
      ratio: '90',
      batchSize: 10
    };
    this.modelSettings = {
      learningRate: '0.00001',
      optimizer: 'SGD',
      lossMetrics: 'categoricalCrossentropy',
      evalMetrics: 'accuracy',
      iterations: '1'
    };
    this.convSettings = {
      nrOfLayers: ['1'],
      filterSize: ['5'],
      nrOfFilters: ['8'],
      strides: ['1'],
      activationFunction: ['relu'],
      filterInitializer: ['varianceScaling'],
      poolLayer: ['1'],
      poolSize: ['2'],
      poolStrides: ['2']
    };
    this.nnSettings = {
      nrOfLayers: ['1'],
      neurons: ['6'],
      activationFunction: ['relu'],
      filterInitializer: ['varianceScaling']
    };
  }
  
  componentDidMount() {
    this.initModel();
  }
  
  //Init data so that one can run the machine with default settings
  initModel() {
    //Init input setting variable
    this.inputSettings.categories.add('crayfish');
    this.inputSettings.categories.add('elephant');
    this.inputSettings.categories.add('flamingo');
    this.inputSettings.categories.add('hedgehog');
    this.inputSettings.categories.add('kangaroo');
    this.inputSettings.categories.add('leopards');
    this.saveFeedbackFromInputSettings(this.inputSettings.format,
                                       this.inputSettings.categories,
                                       this.inputSettings.ratio,
                                       parseInt(this.inputSettings.batchSize, 10));
    
    //Init general model settings
    this.saveFeedbackFromModelSettings(this.modelSettings.learningRate, this.modelSettings.iterations);

    //Init Convolutional layer settings
    this.saveFeedbackFromConvSettings(this.convSettings.nrOfLayers,
                                      this.convSettings.filterSize,
                                      this.convSettings.nrOfFilters,
                                      this.convSettings.strides,
                                      this.convSettings.activationFunction,
                                      this.convSettings.filterInitializer,
                                      this.convSettings.poolLayer,
                                      this.convSettings.poolSize,
                                      this.convSettings.poolStrides);

    //Init NN layer settings
    this.saveFeedbackFromNnSettings(this.nnSettings.nrOfLayers,
                                    this.nnSettings.neurons,
                                    this.nnSettings.activationFunction,
                                    this.nnSettings.filterInitializer);
  }
  
  toggleGallery(label, format) {
    if((this.state.galleryLabels === label) && 
       (this.state.galleryFormat === format) &&
       (this.state.galleryIsHidden === false)){
      this.setState({
        galleryIsHidden: true
      });
    }
    else {
      var urls = [];
      var labels = label;
      switch(format) {
        case 'color':
          urls = getImageUrls_color(label);
          break;
        case 'gray':
          urls = getImageUrls_gray(label);
          break;
        case 'binary':
          urls = getImageUrls_binary(label);
          break;
        case 'training':
          urls = this.state.modelData.getTrainingUrls();
          labels = this.state.modelData.getTrainingLabels();
          break;
        case 'test':
          urls = this.state.modelData.getTestUrls();
          labels = this.state.modelData.getTestLabels();
          break;
        default:
          urls = getImageUrls_color(label);
      }

      this.setState({galleryUrls: urls,
                     galleryFormat: format,
                     galleryLabels: labels}, function () {
        this.setState({galleryIsHidden: false});
      });
    }
  }

  logToConsole(string) {
    var currentConsole = this.state.console;
    currentConsole.push(string);
    this.setState({console: currentConsole});
  }

  saveFeedbackFromInputSettings(format, categories, ratio, batchSize) {
    var consoleFeedback = 'Please add at least two categories';
    if(categories.size > 1) {
      //Set the inputSettings class variable
      this.inputSettings.format = format;
      this.inputSettings.categories = categories;
      this.inputSettings.ratio = ratio;
      this.inputSettings.batchSize = parseInt(batchSize, 10);;
      consoleFeedback = 'Input data configurarion saved: \n Format: ' + 
                        format + ' \n Categories: ' + categories.size + ' \n Ratio: ' + ratio +
                        ' \n Batchsize: ' + batchSize + ' \n ';
      this.logToConsole(consoleFeedback);
    }
    else {
      this.logToConsole(consoleFeedback);
    }
  }

  saveFeedbackFromModelSettings(learningRate, iterations) {
    //Set the modelSettings class variable
    this.modelSettings.learningRate = learningRate;
    this.modelSettings.iterations = iterations;
    //Update log
    var consoleFeedback = 'General Model Settings saved: \n Learning rate: ' + learningRate + 
                           ' \n Iterations: ' + iterations + ' \n ';
    this.logToConsole(consoleFeedback);
  }

  saveFeedbackFromConvSettings(nrOfLayers,
                               filterSize,
                               nrOfFilters,
                               strides,
                               activationFunction,
                               filterInitializer,
                               poolLayer,
                               poolSize,
                               poolStrides) {

    //Set the convSettings class variable
    this.convSettings.nrOfLayers = nrOfLayers;
    this.convSettings.filterSize = filterSize;
    this.convSettings.nrOfFilters = nrOfFilters;
    this.convSettings.strides = strides;
    this.convSettings.activationFunction = activationFunction;
    this.convSettings.filterInitializer = filterInitializer;
    this.convSettings.poolLayer = poolLayer;
    this.convSettings.poolSize = poolSize;
    this.convSettings.poolStrides = poolStrides;
    var consoleFeedback = 'Convolutional layer settings saved: \n Nr of layers: ' +
                          nrOfLayers.length + ' \n Filter size: ' + filterSize +
                          ' \n Nr of filters: ' + nrOfFilters + ' \n Strides: ' + strides +
                          ' \n Activation function: ' + activationFunction +
                          ' \n Filter initializer: ' + filterInitializer +
                          ' \n Pool layer (1=active)' + poolLayer + ' \n Pool size: ' + poolSize +
                          ' \n Pool strides: ' + poolStrides + ' \n ';
    this.logToConsole(consoleFeedback);
  }

  saveFeedbackFromNnSettings(nrOfLayers,
                             nrOfNeurons,
                             activationFunction,
                             filterInitializer){
    //Set the nNSettings variable
    this.nnSettings.nrOfLayers = nrOfLayers;
    this.nnSettings.nrOfNeurons = nrOfNeurons;
    this.nnSettings.activationFunction = activationFunction;
    this.nnSettings.filterInitializer = filterInitializer;
    var consoleFeedback = 'Neural layer settings saved: \n Nr of layers: ' + nrOfLayers.length +
                          ' \n Nr of neurons: ' + nrOfNeurons + ' \n Activation function: ' +
                          activationFunction + ' \n Filter initializer: ' + filterInitializer +
                          ' \n ';
    this.logToConsole(consoleFeedback);
  }
  
  toggleLog(){
    this.setState({logIsHidden: !this.state.logIsHidden});
  }
  
  generateInput() {
    this.setState({modelData: new ImageData()}, function () {
      //console.log('this.inputSettings.batchSize: ', this.inputSettings.batchSize);
      this.state.modelData.load(this.inputSettings.format,
                                this.inputSettings.categories,
                                this.inputSettings.ratio,
                                this.inputSettings.batchSize);
    });
  }

  createModel() {
    this.setState({model: new Model()}, function () {
      var modelStatus = this.state.model.createAndCompileModel(this.inputSettings,
                                                               this.modelSettings,
                                                               this.convSettings,
                                                               this.nnSettings);
      if(modelStatus.length !== 1){
        this.logToConsole('Model created sucessfully \n ');
        this.logToConsole(modelStatus);
      }
      else {
        this.logToConsole('Something went wrong. Please check browser console/developers tab \n ');
        console.log(modelStatus[0]);
      }
    });
  }
  
  trainingProgressCallback(input) {
    this.setState({trainProgress: input});
  }
  
  trainingResultCallback(result) {
    this.setState({trainingHistory: result});
  }

  trainModel() {
    if((this.state.model !== null) && (this.state.modelData !== null)){
      this.setState({controlPanelIsHidden: true,
                     logIsHidden: true,
                     galleryIsHidden: true,
                     outputIsHidden: false}, function () {
        if((this.state.model !== null) && (this.state.modelData !== null)){
          this.state.model.train(this.state.modelData,
                                 this.modelSettings.iterations,
                                 this.trainingProgressCallback.bind(this),
                                 this.trainingResultCallback.bind(this)).then(() => this.setState({
              trainingHistory: this.state.model.history,
              trainingIsComplete: true,
              predictionGalleryLabels: this.state.modelData.getTestLabels(),
              predictionGalleryIsHidden: false
            }));
        }
      });
    }
    else{
      this.logToConsole('Please generate input data and create model before starting \n ');
    }
  }
  
  analysePrediction(input){
    //console.log('input: ', input);
    if(input.length % this.inputSettings.categories.size === 0) {
      var i = 0;
      while(i<input.length) {
        var predictedLabel = [];
        for(let j=0; j<this.inputSettings.categories.size; j++){
          predictedLabel.push(input[i+j]);
        }
        this.state.predictedLabelsData.push(predictedLabel);
        i = i + this.inputSettings.categories.size;
      }
    }
    
    //clean up the prediceted labels
    var cleanArray = this.state.predictedLabelsData;
    for(let i=0; i<cleanArray.length; i++){
      var maxIndex = 0;
      var maxValue = 0;
      for(let j=0; j<cleanArray[i].length; j++){
        if(cleanArray[i][j] > maxValue){
          maxIndex = j;
          maxValue = cleanArray[i][j];
        }
      }
      for(let k=0; k<cleanArray[i].length; k++){
        if(k === maxIndex){
          cleanArray[i][k] = 1;
        }
        else{
          cleanArray[i][k] = 0;
        }
      }
    }
    this.setState({predictedLabelsData: cleanArray}, function () {
      //console.log('this.state.predictedLabelsData: ', this.state.predictedLabelsData);
    });
    
    //Compare the predicted results with the actual results
    var textLabelTemplate = this.state.modelData.getLabelTextTemplate();
    //console.log('textLabelTemplate: ', textLabelTemplate);
    var predictedLabelsInText = [];
    for(let i=0; i<this.state.predictedLabelsData.length; i++){
      var indexOfOne = 0;
      for(let j=0; j<this.state.predictedLabelsData[i].length; j++){
        if(this.state.predictedLabelsData[i][j] === 1){
          indexOfOne = j;
        }
      }
      predictedLabelsInText.push(textLabelTemplate[indexOfOne]);
    }
    //console.log('predictedLabelsInText: ', predictedLabelsInText);
    
    //Calculate the predicted ratio
    var correct = 0;
    var actualTestLablesInText = this.state.modelData.getTestLabels();
    if(actualTestLablesInText.length === predictedLabelsInText.length){
      for(let i=0; i<actualTestLablesInText.length; i++){
        if(actualTestLablesInText[i] === predictedLabelsInText[i]){
          correct = correct + 1;
        }
      }
    }
    this.setState({predictionRatio: correct/actualTestLablesInText.length});
    
    //Update the image labels to show actual and predicted
    for(let i=0; i<actualTestLablesInText.length; i++){
      actualTestLablesInText[i] = 'A: ' + actualTestLablesInText[i] + '/ P: ' + predictedLabelsInText[i];
    }
    console.log('Updated actualTestLablesInText: ', actualTestLablesInText);
    
    this.setState({predictionGalleryLabels: actualTestLablesInText});
  }
  
  predict() {
    if(this.state.model !== null){
      this.state.model.predict().then(x => this.analysePrediction(x));
    }
  }
  
  extractAccuracyFromTrainingHistory() {
    let accuracyArray = [];
    if(this.state.trainingHistory !== null){
      for(let i=0; i<this.state.trainingHistory.length; i++){
        accuracyArray.push(this.state.trainingHistory[i].history.acc[0]);
      }
    }
    return accuracyArray;
  }
  
  extractLossFromTrainingHistory() {
    let lossArray = [];
    if(this.state.trainingHistory !== null){
      for(let i=0; i<this.state.trainingHistory.length; i++){
        lossArray.push(this.state.trainingHistory[i].history.loss[0]);
      }
    }
    return lossArray;
  }
  
  extractXaxisFromTrainingHistory() {
    let xAxisArray = [];
    if(this.state.trainingHistory !== null){
      for(let i=0; i<this.state.trainingHistory.length; i++){
        xAxisArray.push(i);
      }
    }
    return xAxisArray;
  }

  render() {
    var buttonWidth = {
      width: '150px'
    };
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">My image object recognition machine</h1>
          <a href="index.html">
            <img src="/objects/icons/fi-home.svg" alt="navigate home" height="20" width="20" />
          </a>
        </header>
        <p className="App-intro">
          Here you can build your convolutional image classifier model and try it out against selected set of images.
          Configure the network in the panels below and use the 'Model Control' panel to start the machine.
          Start by first configuring your input-sources, then set the general training characteristics in the 'General' panel.
          Additional convolutional and neural layers can be configured in the 'layer' panels.
          Once all settings are saved, generate the data, create and run the model by using the buttons in the 'Model Control' panel.
        </p>
        {!this.state.controlPanelIsHidden && <div className="controlPanel">
          <InputSetting toggleGallery={this.toggleGallery}
                        saveSettings={this.saveFeedbackFromInputSettings}/>
          <ModelSettings saveSettings={this.saveFeedbackFromModelSettings}/>
          <ConvSettings saveSettings={this.saveFeedbackFromConvSettings}/>
          <NnSettings saveSettings={this.saveFeedbackFromNnSettings}/>
          <ModelCtrl toggleLog={this.toggleLog}
                     generateInput={this.generateInput.bind(this)}
                     toggleGallery={this.toggleGallery}
                     createModel={this.createModel}
                     trainModel={this.trainModel}/>
          
        </div>}
        {!this.state.logIsHidden && <Log textToAdd={this.state.console}/>}
        {!this.state.galleryIsHidden && <Gallery imageUrls={this.state.galleryUrls}
                                                 imageLabels={this.state.galleryLabels}/>}
        <br />
        {!this.state.outputIsHidden &&
          <div>
            {!this.state.trainingIsComplete && <p>Trainig - this will take time.</p>}
            {this.state.trainingIsComplete &&
              <div>
                <h4>Training results below</h4>
                <p>See accuracy and loss per batch in the graphs below.</p>
                <p>Scroll down to test the model using the test images defined earlier.</p>
                <div><MyPlot title="Accuracy per batch"
                             y={this.extractAccuracyFromTrainingHistory()}
                             x={this.extractXaxisFromTrainingHistory()}/></div>
                <div><MyPlot title="Loss per batch"
                             y={this.extractLossFromTrainingHistory()}
                             x={this.extractXaxisFromTrainingHistory()}/></div>
                <h4>Test your model</h4>
                <p>Test your model using the earlier defined test images</p>
                <div>
                  <button style={buttonWidth} onClick={this.predict.bind(this)} >
                    Test Machine
                  </button>
                  <p>Prediction ratio: {this.state.predictionRatio}</p>
                  {!this.state.predictionGalleryIsHidden &&
                    <Gallery imageUrls={this.state.modelData.getTestUrls()}
                             imageLabels={this.state.predictionGalleryLabels}/>}
                </div>
              </div>}
          </div>}
      </div>
    );
  }
}

export default App;
