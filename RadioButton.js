import React from 'react';

class RadioButton extends React.Component {
  constructor () {
    super()
    this.state = {
      selectedOption: 'gray'
    }
    
    this.handleOptionChange = this.handleOptionChange.bind(this);
  }
  
  handleOptionChange(changeEvent) {
    this.setState({
      selectedOption: changeEvent.target.value
    });
    this.props.handleRadiobuttonChange(changeEvent.target.value);
  }

  render() {
    var smallFont = {
      fontSize: 13
    };
    return(
      <div>
        <label style={smallFont}>
          <input type="radio" value="color"
                 checked={this.state.selectedOption === 'color'}
                 onChange={this.handleOptionChange}/>
          Color
        </label>
        <label style={smallFont}>
          <input type="radio" value="gray"
                 checked={this.state.selectedOption === 'gray'}
                 onChange={this.handleOptionChange}/>
          Gray
        </label>
        <label style={smallFont}>
          <input type="radio" value="binary"
                 checked={this.state.selectedOption === 'binary'}
                 onChange={this.handleOptionChange}/>
          Binary
        </label>
      </div>
    );
  }
}
 
export default RadioButton;