import React from 'react';
 
class LabelItem extends React.Component {

  render() {
    return(
      <p>{this.props.label}</p>
    );
  }
}
 
export default LabelItem;