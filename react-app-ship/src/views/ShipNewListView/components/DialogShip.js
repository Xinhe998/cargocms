import React, { PropTypes } from 'react';
import {
  Dialog,
  FlatButton,
  TextField,
} from 'material-ui';

// function handleClose(props) {
//   this.props.close();
//   console.log('dialog closeed');
// }

export default class DialogShip extends React.Component {
  static defaultProps = {
    open: false,
    leftLable: '取消',
    rightLable: '確定',
    leftOnPress: () => {},
    rightOnPress: () => {},
    content: '',
    title: '提示',
    input: false,
  };

  static propTypes = {
    open: PropTypes.bool,
    content: PropTypes.string,
    leftLable: PropTypes.string,
    rightLable: PropTypes.string,
    leftOnPress: PropTypes.func,
    rightOnPress: PropTypes.func,
    input: PropTypes.bool,
  };

  constructor(props) {
    super();
    this.state = {
      value: '',
      errorText: '',
    };
  }

  handleChange = (event) => {
    this.setState({
      value: event.target.value,
      errorText: '',
    });
  };

  render() {

    const dialogActions = [
      <FlatButton
        label={this.props.leftLable}
        primary={true}
        onTouchTap={this.props.leftOnPress}
        />,
      <FlatButton
        label={this.props.rightLable}
        primary={true}
        keyboardFocused={true}
        onTouchTap={() => {
          if (this.state.value) {
            this.props.rightOnPress(
              'PROCESSING',
              this.state.value,
            )
          } else {
            this.setState({ errorText: '請輸入事由' })
          }
        }}
      />,
    ];

    return (
      <div className='dialog-wrapper'>
        <Dialog
          title={ this.props.title }
          actions={dialogActions}
          modal={false}
          open={this.props.open}
          onRequestClose={this.props.leftOnPress}
        >
          {this.props.content}
          <p />
          {
            this.props.input ? <TextField
              hintText="請輸入變更訂單狀態的理由"
              onChange={this.handleChange}
              errorText={this.state.errorText}
            /> : null
          }
        </Dialog>
      </div>
    );
  }
}
