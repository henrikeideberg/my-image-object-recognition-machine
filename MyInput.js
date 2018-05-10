import React from 'react';
 
class MyInput extends React.Component {
  
  handleChange(event) {
    this.props.onChange(event);
  }
  
  render() {
    var smallFont = {
      fontSize: 12
    };
    return(
      <div className="select">
        <label htmlFor={this.props.name}
               style={smallFont}>{this.props.label}
        </label>
        {this.props.tooltip && <span className="tooltiptext">{this.props.tooltiptext}</span>}
        <input type={this.props.type}
               name={this.props.name}
               id={this.props.name}
               value={this.props.value}
               onChange={this.handleChange.bind(this)}/>
      </div>
    );
  }
}
 
export default MyInput;