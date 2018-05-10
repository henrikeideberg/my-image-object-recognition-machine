import React, {Component} from 'react';
import ClickableLabelItem from "./ClickableLabelItem";

class Checkbox extends Component {
  state = {
    isChecked: true,
  }

  toggleCheckboxChange = () => {
    const { handleCheckboxChange, label } = this.props;

    this.setState(({ isChecked }) => (
      {
        isChecked: !isChecked,
      }
    ));

    handleCheckboxChange(label);
  }

  render() {
    const { label } = this.props;
    const { isChecked } = this.state;

    return (
      <div className="checkbox">
          <input
            type="checkbox"
            value={label}
            checked={isChecked}
            onChange={this.toggleCheckboxChange}
          />
        <ClickableLabelItem clickedLabel={this.props.clickedLabel} label={label}/>
      </div>
    );
  }
}

export default Checkbox;