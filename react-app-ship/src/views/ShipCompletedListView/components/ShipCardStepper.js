import React, { PropTypes } from 'react';
import {
  Step,
  Stepper,
  StepLabel,
} from 'material-ui/Stepper';
import {
  blue400,
  orange400,
  grey300,
  grey900,
} from 'material-ui/styles/colors';
import FontIcon from 'material-ui/FontIcon';

const defaultProps = {
  isExpend: false,
  invoiceNum: 'S1111222233334444',
  orderDetail: [
    {
      id: 3,
      name: '鮮甜飽滿無毒益菌蝦',
      model: '鮮甜飽滿無毒益菌蝦',
      quantity: 22,
      price: 599,
      total: 13178,
      tax: 658.9,
      status: 'NEW',
      OrderProductId: 1,
      SupplierShipOrderId: 3,
    },
  ],
  orderDate: {
    createdAt: '2016/12/12',
    updatedAt: '2016/12/12',
  },
  orderSupplier: {
    id: 1,
    name: '壹陸捌活海產',
    email: '168_seafood@gmail.com',
    telephone: '(04)-2201-1688',
    fax: '(04)-2201-1168',
    address: '台中市清水區北提路',
  },
  total: '9912',
  status: '確定訂單',
  paymentMethod: 'ATM',
  shippingName: '潘子',
  shippingAddress: '403 taichung 台灣城市的某個街道隨機號',
  shippingMethod: '郵局遞送',
  tracking: '確認訂單',
  comment: 'no comment',
};

const propTypes = {
  isExpend: PropTypes.bool,
  invoiceNum: PropTypes.string,
  orderDetail: PropTypes.array,
  orderDate: PropTypes.object,
  orderSupplier: PropTypes.object,
  total: PropTypes.string,
  status: PropTypes.string,
  //
  paymentMethod: PropTypes.string,
  shippingName: PropTypes.string,
  shippingAddress: PropTypes.string,
  shippingMethod: PropTypes.string,
  tracking: PropTypes.string,
  comment: PropTypes.string,
};

function ShipCardStepper(props) {
  let stepIndex = 0;
  switch (props.status) {
    case 'NEW':
      stepIndex = 0;
      break;
    case 'PROCESSING':
      stepIndex = 1;
      break;
    case 'SHIPPED':
      stepIndex = 2;
      break;
    case 'COMPLETED':
      stepIndex = 4;
      break;
    default:
      stepIndex = 0;
      break;
  }
  return (
    <div className='row stepper-wrapper'>
      <div className='col-xs-12 stepper-content'>
        <Stepper linear={true} activeStep={stepIndex}>
          <Step>
            <StepLabel
              className='step-dot step-new'
            >
              新訂單
            </StepLabel>
          </Step>

          <Step>
            <StepLabel
              className='step-dot step-preparing'
            >
              備貨中
            </StepLabel>
          </Step>

          <Step>
            <StepLabel
              className='step-dot step-shipped'
            >
              出貨中
            </StepLabel>
          </Step>

          <Step>
            <StepLabel
              className='step-dot step-finsih'
            >
              完成配送
            </StepLabel>
          </Step>
        </Stepper>
      </div>
    </div>
  );
}

ShipCardStepper.defaultProps = defaultProps;
ShipCardStepper.propTypes = propTypes;

export default ShipCardStepper;