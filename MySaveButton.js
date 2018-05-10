import React from 'react';
 
class MySaveButton extends React.Component {
  
  handleClick() {
    this.props.onClick();
  }

  render() {
    var btnBg = {
      backgroundColor: this.props.buttonBackground
    }
    return(
      <div>
        <button style={btnBg} onClick={this.handleClick.bind(this)} >
          {this.props.buttonText}
        </button>
      </div>
    );
  }
}
 
export default MySaveButton;