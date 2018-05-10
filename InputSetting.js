import React from 'react';
import Checkbox from './Checkbox'; //http://react.tips/checkboxes-in-react/
import RadioButton from './RadioButton'; //http://react.tips/radio-buttons-in-reactjs/
import MySaveButton from './MySaveButton';

class InputSetting extends React.Component {
  constructor () {
    super()
    this.state = {
      trainingRatio: '90',
      selectedCategories: new Set(),
      selectedRadiobutton: 'gray',
      batchSize: 10,
      batchSizeMax: Math.floor(0.9*70),
      saveButtonBackgroundColor: 'black',
      saveButtonText: 'Save'
    }
    
    this.saveRatioFeedback = this.saveRatioFeedback.bind(this);
    this.saveCheckboxFeedback = this.saveCheckboxFeedback.bind(this);
    this.saveRadiobuttonFeedback = this.saveRadiobuttonFeedback.bind(this);
    this.saveBatchFeedback = this.saveBatchFeedback.bind(this);
    this.saveClickedLabelFeedback = this.saveClickedLabelFeedback.bind(this);
    this.feedBackSettings = this.feedBackSettings.bind(this);
    this.unsetSaveButton = this.unsetSaveButton.bind(this);
  }
  
  componentDidMount(){
    this.state.selectedCategories.add('crayfish');
    this.state.selectedCategories.add('elephant');
    this.state.selectedCategories.add('flamingo');
    this.state.selectedCategories.add('hedgehog');
    this.state.selectedCategories.add('kangaroo');
    this.state.selectedCategories.add('leopards');
  }
  
  componentDidUpdate() {
  }
  
  unsetSaveButton(){
    this.setState({saveButtonBackgroundColor: 'black'});
    this.setState({saveButtonText: 'Save'});
  }

  saveCheckboxFeedback(label) {
    if (this.state.selectedCategories.has(label)) {
      this.state.selectedCategories.delete(label);
    } else {
      this.state.selectedCategories.add(label);
    }
    this.unsetSaveButton();
  }
  
  saveRadiobuttonFeedback(type) {
    this.setState({selectedRadiobutton: type}, function () {
      this.unsetSaveButton();
    });
  }
  
  saveClickedLabelFeedback(label) {
    this.props.toggleGallery(label, this.state.selectedRadiobutton)
  }
  
  saveRatioFeedback(event) {
    this.setState({trainingRatio: event.target.value}, function () {
      this.unsetSaveButton();
      //Update the batch size max limit and batch size if needed
      this.setState({batchSizeMax: Math.floor(Math.floor(parseInt(this.state.trainingRatio, 10)*70/100))}, function () {
        if(this.state.batchSize > this.state.batchSizeMax){
          this.setState({batchSize: this.state.batchSizeMax});
        }
      });
    });
  }
  
  saveBatchFeedback(event) {
    this.setState({batchSize: event.target.value}, function () {
      this.unsetSaveButton();
    });
  }
  
  feedBackSettings() {
    this.props.saveSettings(this.state.selectedRadiobutton,
                            this.state.selectedCategories,
                            this.state.trainingRatio,
                            this.state.batchSize);
    //To be in line with App\saveFeedbackFromInputCtrl
    if(this.state.selectedCategories.size > 1){
      this.setState({saveButtonBackgroundColor: 'green'});
      this.setState({saveButtonText: 'Saved'});
    }
  }

  render() {
    var boldFont = {
      fontWeight: 'bold',
      fontSize: 15
    };
    var smallFont = {
      fontSize: 12
    };
    var batchSizeToolTipText = <span style={smallFont}>
          The number of images to be used in a training batch. One training batch will hold 'nr. of categories' * 'batch size' number of cards. 
          E.g. when six (6) categories are included and the batch size is set to ten (10), each training batch will include 60 (6*10) images.
        </span>;
    return(
      <div className="controlPanelLanel">
        <h4>Input</h4>
        <hr />
        <p style={boldFont}>Which imageset do you want to include?</p>
        <p style={smallFont}>Click on category-text to show images of that category in gallery (bottom of page).</p>
        <p style={smallFont}>Select/unselect checkboxes to include/exclude that category in input data.</p>
        <p style={smallFont}>Select format (color/gray/binary) by using the radiobuttons below. NOTE: color format is not yet supported. If 'color' is seleted, the machine will automatically use format 'gray'</p>
        <p style={smallFont}>When you are happy with the settings for the input, save them by clicking the 'save' button below.</p>
        <RadioButton handleRadiobuttonChange={this.saveRadiobuttonFeedback}/>
        <Checkbox label='crayfish'
                  handleCheckboxChange={this.saveCheckboxFeedback}
                  clickedLabel={this.saveClickedLabelFeedback}/>
        <Checkbox label='elephant'
                  handleCheckboxChange={this.saveCheckboxFeedback}
                  clickedLabel={this.saveClickedLabelFeedback}/>
        <Checkbox label='flamingo'
                  handleCheckboxChange={this.saveCheckboxFeedback}
                  clickedLabel={this.saveClickedLabelFeedback}/>
        <Checkbox label='hedgehog'
                  handleCheckboxChange={this.saveCheckboxFeedback}
                  clickedLabel={this.saveClickedLabelFeedback}/>
        <Checkbox label='kangaroo'
                  handleCheckboxChange={this.saveCheckboxFeedback}
                  clickedLabel={this.saveClickedLabelFeedback}/>
        <Checkbox label='leopards'
                  handleCheckboxChange={this.saveCheckboxFeedback}
                  clickedLabel={this.saveClickedLabelFeedback}/>
        <p></p>
        <div>
          <label style={smallFont}>Ratio training to test data: <span style={boldFont}>{this.state.trainingRatio}%</span></label>
          <p>
          <input type="range" min="50" max="90" defaultValue="90"
                 step="5" id="trainingRatio" onChange={this.saveRatioFeedback}/>
          </p>
        </div>
        <div className="trainingData">
          <label style={smallFont}>Training data batch size: <span style={boldFont}>{this.state.batchSize}</span></label>
          <p>
            <span className="tooltiptext">{batchSizeToolTipText}</span>
            <input type="range" min="1" max={this.state.batchSizeMax} defaultValue="10"
                   step="1" id="batchSize" onChange={this.saveBatchFeedback}/>
          </p>
        </div>
        <MySaveButton buttonBackground={this.state.saveButtonBackgroundColor}
                      buttonText={this.state.saveButtonText}
                      onClick={this.feedBackSettings.bind(this)}/>
      </div>
    );
  }
}
 
export default InputSetting;