import React, { PropTypes } from 'react';
import {
  FlatButton,
} from 'material-ui';

const defaultProps = {};

const propTypes = {
  shipOrderId: PropTypes.number,
  invoiceCode: PropTypes.string,
  orderDetail: PropTypes.array,
  orderDate: PropTypes.object,
  orderSupplier: PropTypes.object,
  total: PropTypes.number,
  status: PropTypes.string,
  handleBtnPrint: PropTypes.func,
  handleBtnShip: PropTypes.func,
};

function CardBodyExpend(props) {
  return (
    <div className='cardbody-expened'>
      <div className='order-invoice-expened'>
        <div className='title'>
          {props.shipOrderId}
          {props.invoiceCode.length > 1 ? (<span>({props.invoiceCode})</span>) : '' }
        </div>
        <div className='sub-title'>
          建立於 {props.orderDate.createdAt}
        </div>
        <div className='sub-title'>
          更新於 {props.orderDate.updatedAt}
        </div>
      </div>
    </div>
  );
}

CardBodyExpend.defaultProps = defaultProps;
CardBodyExpend.propTypes = propTypes;

export default CardBodyExpend;
