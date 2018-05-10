import React from 'react';
import MySaveButton from './MySaveButton';
import MySelect from './MySelect';
import MyInput from './MyInput';

class ModelSettings extends React.Component {
  constructor () {
    super()
    this.state = {
      saveButtonBackgroundColor: 'black',
      saveButtonText: 'Save',
    }
    this.learningRates = ['0.00001', '0.001', '0.001', '0.003', '0.01', '0.1', '0.15', '0.25', '0.3', '0.5', '1.0', '3.0'];
    this.learningRate = '0.00001';
    this.iterations = '1';
    this.lossMetrics = ['categoricalCrossentropy'];
    this.evalMetrics = ['accuracy'];
    this.optimizer = ['SGD'];
    
    this.learningRateChanged = this.learningRateChanged.bind(this);
    this.optimiserChanged = this.optimiserChanged.bind(this);
    this.lossMetricChanged = this.lossMetricChanged.bind(this);
    this.evaluationMetricChanged = this.evaluationMetricChanged.bind(this);
    this.handleIterationChange = this.handleIterationChange.bind(this);
  }
  
  learningRateChanged(event){
    this.learningRate = event.target.value;
    this.setState({saveButtonBackgroundColor: 'black'});
    this.setState({saveButtonText: 'Save'});
  }
  
  optimiserChanged(event){
    this.setState({saveButtonBackgroundColor: 'black'});
    this.setState({saveButtonText: 'Save'});
  }
  
  lossMetricChanged(event) {
    this.setState({saveButtonBackgroundColor: 'black'});
    this.setState({saveButtonText: 'Save'});
  }
  
  evaluationMetricChanged(event) {
    this.setState({saveButtonBackgroundColor: 'black'});
    this.setState({saveButtonText: 'Save'});
  }
  
  handleIterationChange(event) {
    this.iterations = event.target.value;
    this.setState({saveButtonBackgroundColor: 'black'});
    this.setState({saveButtonText: 'Save'});
  }
  
  feedBackSettings() {
    this.props.saveSettings(this.learningRate, this.iterations);
    this.setState({saveButtonBackgroundColor: 'green'});
    this.setState({saveButtonText: 'Saved'});
  }

  render() {
    var smallFont = {
      fontSize: 12
    };
    var smallBoldFont = {
      fontWeight: 'bold',
      fontSize: 12
    };
    var optimizerTootipText = <p style={smallFont}>For our model, we'll use a 
          <a href="https://developers.google.com/machine-learning/glossary/#SGD"> stochastic </a> 
          <a href="https://developers.google.com/machine-learning/glossary/#gradient_descent">
          gradient descent</a> <a href="https://developers.google.com/machine-learning/glossary/#SGD">
          (SGD)</a> <a href="https://developers.google.com/machine-learning/glossary/#optimizer">
          optimizer</a> with a configurable 
          <a href="https://developers.google.com/machine-learning/glossary/#learning_rate"> learning rate</a>.
        </p>;
    var evaluationMetricTooltipText = <p style={smallFont}>For our evaluation metric, we'll use
          <span style={smallBoldFont}> accuracy, </span> which measures the percentage of correct 
          predictions out of all predictions.
        </p>;
    var lossMetricTooltipText = <p style={smallFont}>For our 
          <a href="https://developers.google.com/machine-learning/glossary/#loss"> loss </a>
          function, we'll use <span style={smallBoldFont}>cross-entropy (categoricalCrossentropy), 
          </span> which is commonly used to optimize classification tasks.<br/><br/>
          <span style={smallBoldFont}>NOTE: </span>For a deeper dive into optimizers and loss 
          functions in TensorFlow.js, see below the tutorials:<br/>
          <a href="https://js.tensorflow.org/tutorials/core-concepts.html">Core Concepts in TensorFlow</a><br/>
          <a href="https://js.tensorflow.org/tutorials/fit-curve.html">Fitting a Curve to Synthetic Data</a><br/>
          <a href="https://js.tensorflow.org/tutorials/mnist.html">Recognizing Handwritten Digits with a Convolutional Neural Network</a>
        </p>;
    var iterationTooltip = <p style={smallFont}>Number of training runs to perform on a batch. 
          Since we are iteratively feeding batches to the machine, it is recommended to set this to 
          one (1) as we only want it to train from one batch a single time.</p>
    return(
      <div className="controlPanelLanel">
        <h4>General Model settings</h4>
        <hr />
        <p style={smallFont}>We will use <a href="https://js.tensorflow.org/">TensorFlow.js's </a> 
          higher-level APIs (Model, Layers) to construct the model. We'll use a 
          <span style={smallBoldFont}> Sequential model</span> (the simplest type of model), 
          in which tensors are consecutively passed from one layer to the next.
        </p>
        <p style={smallFont}>To actually drive training of the model, we'll need to construct an 
          optimizer and define a loss function. We'll also define an evaluation metric to measure 
          how well our model performs on the data.
        </p>
        <p style={smallBoldFont}>The following settings apply</p>
        <MySelect name="learningRateSelection" label="Learning rate: "
                  onChange={this.learningRateChanged}
                  items={this.learningRates}/>
        <MySelect name="optimiserSelection" label="Optimiser: "
                  onChange={this.optimiserChanged}
                  items={this.optimizer} tooltip={true} tooltiptext={optimizerTootipText}/>
        <MySelect name="lossMetricSelection" label="Loss Metric: "
                  onChange={this.lossMetricChanged}
                  items={this.lossMetrics} tooltip={true} tooltiptext={lossMetricTooltipText}/>
        <MySelect name="evaluationMetricSelection" label="Evaluation Metric: "
                  onChange={this.evaluationMetricChanged}
                  items={this.evalMetrics} tooltip={true} tooltiptext={evaluationMetricTooltipText}/>
        <MyInput name="iterationsInput" label="Iterations: "
                 onChange={this.handleIterationChange} type="number"
                 tooltip={true} tooltiptext={iterationTooltip}
                 value={this.iterations}/>
        <MySaveButton buttonBackground={this.state.saveButtonBackgroundColor}
                      buttonText={this.state.saveButtonText}
                      onClick={this.feedBackSettings.bind(this)}/>
      </div>
    );
  }
}
 
export default ModelSettings;