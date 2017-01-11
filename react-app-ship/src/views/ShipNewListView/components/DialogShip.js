import React, { PropTypes } from 'react';
import {
  Dialog,
  FlatButton,
} from 'material-ui';

const defaultProps = {
  open: false,
  leftLable: '取消',
  rightLable: '確定',
  leftOnPress: () => {},
  rightOnPress: () => {},
  content: '',
  title: '提示',
};

const propTypes = {
  open: PropTypes.bool,
  content: PropTypes.string,
  leftLable: PropTypes.string,
  rightLable: PropTypes.string,
  leftOnPress: PropTypes.func,
  rightOnPress: PropTypes.func,
};

function handleClose(props) {
  props.close();
  console.log('dialog closeed');
}

function DialogShip(props) {
  const dialogActions = [
    <FlatButton
      label={props.leftLable}
      primary={true}
      onTouchTap={props.leftOnPress}
    />,
    <FlatButton
      label={props.rightLable}
      primary={true}
      keyboardFocused={true}
      onTouchTap={() => {props.rightOnPress('123123')}}
    />,
  ];
  return (
    <div className='dialog-wrapper'>
      <Dialog
        title={props.title}
        actions={dialogActions}
        modal={false}
        open={props.open}
        onRequestClose={props.leftOnPress}
      >
       {props.content}
      </Dialog>
    </div>
  );
}

DialogShip.defaultProps = defaultProps;
DialogShip.propTypes = propTypes;

export default DialogShip;
