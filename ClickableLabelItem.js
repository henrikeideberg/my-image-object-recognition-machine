import React from 'react';
 
class ClickableLabelItem extends React.Component {
  
  clickedLabel(label) {
    this.props.clickedLabel(label)
  }

  render() {
    var smallFont = {
      fontSize: 13
    };
    return(
      <label style={smallFont} onClick={(e) => this.clickedLabel(this.props.label, e)}>{this.props.label}</label>
    );
  }
}
 
export default ClickableLabelItem;