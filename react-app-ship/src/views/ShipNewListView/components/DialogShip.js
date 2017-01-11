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
      onTouchTap={() => {
        props.rightOnPress('PROCESSING', '這是測試的內容')
      }}
    />,
  ];
  return (
    <div className='dialog-wrapper'>
      <Dialog
        title={ props.title }
        actions={dialogActions}
        modal={false}
        open={props.open}
        onRequestClose={props.leftOnPress}
      >
        {props.content}
        <p />
        <p>請輸入變更訂單狀態的理由</p>
        <input value={}></input>
      </Dialog>
    </div>
  );
}

DialogShip.defaultProps = defaultProps;
DialogShip.propTypes = propTypes;

export default DialogShip;
