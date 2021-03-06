import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import enhanceWithClickOutside from 'react-click-outside';

/**
 * Dropdown - params:
 * options: Array of { value: string, text: string }
 * value: value of selected option (string)
 * defaultOptionVisible: if true it will render a default option as the first option of the dropdown.
 * defaultOptionText: text of default option
 * onChange: function to be called when the user selects a new option of the dropdown.
*/
class Dropdown extends Component {
  constructor(props) {
    super(props);

    const { value, defaultOptionVisible } = this.props;

    const defaultOption =
      (defaultOptionVisible == undefined || defaultOptionVisible) &&
      (!value || value == '');


    this.state = {
      defaultOptionVisible: defaultOption,
      isOpened: false
    };
  }

  componentWillReceiveProps({ value, defaultOptionVisible }) {
    if (this.props.value != value && value === '') {
      const defaultOption =
        (defaultOptionVisible == undefined || defaultOptionVisible) &&
        (!value || value == '');
      this.setState({ defaultOptionVisible: defaultOption });
    }
  }

  _onChange(value) {
    if (value !== '') {
      this.setState({ defaultOptionVisible: false });
    }
    this.props.onChange(value);
  }

  clickInsideOfTheDropdown() {
    this.setState({ isOpened: true });
  }

  handleClickOutside() {
    if (this.state.isOpened) {
      this.props.onChange(this.refs[this.props.name].value);
      this.setState({ isOpened: false });
    }
  }

  renderDefaultOption() {
    return this.state.defaultOptionVisible && (
      <option value='' data-default={true}>
        {this.props.defaultOptionText || 'Select'}
      </option>
    );
  }

  render() {
    const {
      options,
      value,
      name,
      invalidClassName = '',
      className = 'form-select',
      inputIsValid,
      disabled
    } = this.props;

    return (
      <div className={`${className}-wrapper`}>
        <select
          onChange={(event) => this._onChange(event.target.value)}
          onClick={() => this.clickInsideOfTheDropdown()}
          onKeyDown={(event) => {
            // if the user press the tab key
            if (event.which == 9) {
              this._onChange(event.target.value);
            }
          }}
          onFocus={() => this.clickInsideOfTheDropdown()}
          value={value}
          ref={name}
          name={name}
          disabled={disabled}
          className={
            classnames(
              !inputIsValid() ? invalidClassName : '',
              className
            )
          }
        >
          {this.renderDefaultOption()}
          {options.map((opt, index) => {
            return (
              <option value={opt.value} key={index}>{opt.text}</option>
            );
          })}
        </select>
      </div>
    );
  }
}

Dropdown.propTypes = {
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired
  })).isRequired,
  name: PropTypes.string.isRequired,
  className: PropTypes.string,
  invalidClassName: PropTypes.string,
  value: PropTypes.string,
  defaultOptionVisible: PropTypes.bool,
  defaultOptionText: PropTypes.string,
  onChange: PropTypes.func,
  validate: PropTypes.func,
  forceDirty: PropTypes.bool,
  resetValue: PropTypes.bool,
  inputIsValid: PropTypes.func,
  disabled: PropTypes.bool
};

export default enhanceWithClickOutside(Dropdown);
