import React from 'react';
 
class MySelect extends React.Component {
  
  handleChange(event) {
    this.props.onChange(event);
  }
  
  render() {
    var smallFont = {
      fontSize: 12
    };
    var selectItems = this.props.items.map((currElement, index) => {
      return <option key={index}>{currElement}</option>
    });
    return(
      <div className="select">
        <label htmlFor={this.props.name} style={smallFont}>{this.props.label}</label>
        {this.props.tooltip && <span className="tooltiptext">{this.props.tooltiptext}</span>}
        <select name={this.props.name} id={this.props.name} value={this.props.value}
                onChange={this.handleChange.bind(this)}>{selectItems}</select>
      </div>
    );
  }
}
 
export default MySelect;