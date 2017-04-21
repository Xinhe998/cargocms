import React, { PropTypes } from 'react';
import CardBodyNormal from '../components/CardBodyNormal';
import CardBodyExpend from '../components/CardBodyExpend';
import DialogShip from '../components/DialogShip';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  updateShipOrderStatus,
} from '../../../redux/modules/shipOrder';

@connect(
  state => ({
    // shipOrder: state.shipOrder,
    // toast: state.toast,
    // user: state.user,
  }),
  dispatch => bindActionCreators({
    updateShipOrderStatus,
  }, dispatch),
) export default class ShipCardBody extends React.Component {
  static defaultProps = {
    toast: null,
    isExpend: false,
  };

  static propTypes = {
    shipOrderId: PropTypes.number,
    toast: PropTypes.func,
    isExpend: PropTypes.bool,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      dialogShipOpen: false,
      dialogPrintOpen: false,
    };
  }

  stopPropagation = (event) => {
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();
  }

  handleDialogShipOpen = (event) => {
    this.stopPropagation(event);
    const state = this.state.dialogShipOpen;
    this.setState({
      dialogShipOpen: !state,
    });
  }

  handleDialogShipClose = () => {
    this.setState({ dialogShipOpen: false });
    this.props.toast('操作成功！');
  }

  handleDialogPrintOpen = (event) => {
    this.stopPropagation(event);
    let whichClick = this.props.shipOrderNumber;
    let allExpened = document.getElementsByClassName("cardbody-expened");
    let printHhiddenObject = [];
    for(let item = 0, allExpenedLength = allExpened.length; item < allExpenedLength; item++) {
      if(allExpened[item].innerText.indexOf(whichClick) !== 0) {
        printHhiddenObject.push(allExpened[item].parentNode.parentNode.parentNode);
      }
    }
    if(printHhiddenObject) {
      for(let item of printHhiddenObject) {
        item.style.display = "none";
      }
      window.print();
      for(let item of printHhiddenObject) {
        item.style.display = "inline";
      }
    }
    // const state = this.state.dialogPrintOpen;
    // this.setState({
    //   dialogPrintOpen: !state,
    // });
  }

  handleDialogPrintClose = () => {
    this.setState({ dialogPrintOpen: false });
    this.props.toast('操作成功！');
  }


  render() {
    const cardBody = this.props.isExpend ?
        (<CardBodyExpend
          {...this.props}
          handleBtnShip={this.handleDialogShipOpen}
          handleBtnPrint={this.handleDialogPrintOpen}
        />) :
        (<CardBodyNormal {...this.props} />);
    return (
      <div className='cardbody-wrapper'>
        {cardBody}
        <DialogShip
          content={'確認訂單完成配送'}
          modal={false}
          leftOnPress={this.handleDialogShipClose}
          rightOnPress={
            (status) => {
              this.props.updateShipOrderStatus({
                id: this.props.shipOrderId,
                data: { status },
                status: this.props.status,
              });
              this.setState({dialogShipOpen: false});
            }
          }
          open={this.state.dialogShipOpen}
          toast={this.props.toast}
          input={true}
        />
        <DialogShip
          content={'確定要列印出貨明細嗎？'}
          modal={false}
          leftOnPress={this.handleDialogPrintClose}
          rightOnPress={this.handleDialogPrintOpen}
          open={this.state.dialogPrintOpen}
          toast={this.props.toast}
        />
      </div>
    );
  }
}
