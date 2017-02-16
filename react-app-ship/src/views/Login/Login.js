/* @flow */
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Formsy from 'formsy-react';
import Lang from 'lodash';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { deepOrange500 } from 'material-ui/styles/colors';
import { Snackbar } from 'material-ui';
import Crab from './crab.png';
import FishLogo from './fish logo.png';
import FormsyInput from '../../components/FormsyInput';
import {
  handleShowToast,
  closeToast,
} from '../../redux/utils/toast';
import {
  fetchCurrentUserData,
} from '../../redux/modules/user';
import './_style.scss';

const muiTheme = getMuiTheme({
  palette: {
    accent1Color: deepOrange500,
  },
});

@connect(
  state => ({
    toast: state.toast,
  }),
  dispatch => bindActionCreators({
    handleShowToast,
    closeToast,
    fetchCurrentUserData,
  }, dispatch),
) export default class Login extends React.Component {
  static defaultProps = {
    handleShowToast: null,
    closeToast: null,
    toast: {},
    fetchCurrentUserData: null,
  };

  static propTypes = {
    fetchCurrentUserData: PropTypes.func,
    handleShowToast: PropTypes.func,
    closeToast: PropTypes.func,
    toast: PropTypes.object,
  };

  constructor(props) {
    super();
    this.state = {
      canSubmit: false,
      notice: '',
      username: '',
      password: '',
    };
  }

  enableButton = () => {
    this.setState({
      canSubmit: true,
      notice: '',
    });
    this.props.closeToast();
  }

  disableButton = () => {
    let msg = '有欄位尚未輸入';
    const isUsrEmpty = Lang.isEmpty(this.username.getValue());
    const isPwdEmpty = Lang.isEmpty(this.password.getValue());
    if (isPwdEmpty && isUsrEmpty) {
      msg = '請檢查帳號 / 密碼';
    }
    this.setState({
      canSubmit: false,
      notice: msg,
    });
  }

  submit = () => {
    // FIXME: 需要登入 api ，目前暫時用 form 表單
    document.querySelector('.login-form form').submit();
    // TODO: 登入表單會引發 locatonChange 會導致遺失 store 資訊
    // 所以正常情況下應該是要發 api 取得資訊之後再取得 CurrentUserData.
    // this.props.fetchCurrentUserData();
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div className='login-container'>
          <div className='login-form'>
            <div className='login-form-body'>
              <h1>出貨管理</h1>
              <img className='crab' src={Crab} alt='crab' />
              <Formsy.Form
                ref={(c) => { this.form = c; }}
                method='post'
                action='/auth/local?url=/ship/'
                onValidSubmit={this.submit}
                onValid={this.enableButton}
                onInvalid={this.disableButton}
              >
                <label htmlFor={this.username}>帳號</label>
                <FormsyInput
                  ref={(c) => { this.username = c; }}
                  name='identifier'
                  placeholder='Username'
                  className='form-control margin-bottom-20'
                  required={true}
                />
                <label htmlFor={this.password}>密碼</label>
                <FormsyInput
                  ref={(c) => { this.password = c; }}
                  type='password'
                  name='password'
                  placeholder='Password'
                  className='form-control'
                  required={true}
                />
                <span className='empty-notice'>{this.state.notice}</span>
                <a className='forget-password' href='/forgot'>忘記密碼？</a>
                <button
                  type='submit'
                  disabled={!this.state.canSubmit}
                  className='btn login-btn'
                  data-tip={this.state.notice}
                >登入系統</button>
              </Formsy.Form>
            </div>
            <div className='login-form-footer'>
              <div className='login-contact'>
                <img src={FishLogo} alt='fish logo' />
                <div className='login-contact-info'>
                  <h1>雲端漁場服務專線</h1>
                  <p>
                    <a href='#!'>(05)0000-0000</a>
                  </p>
                </div>
              </div>
              <a href='#!' className='facebook-btn' >
                <i className='fa fa-facebook' aria-hidden='true' />
              </a>
            </div>
          </div>
          <Snackbar
            open={this.props.toast.open}
            message={this.props.toast.msg}
            autoHideDuration={4000}
          />
        </div>
      </MuiThemeProvider>
    );
  }
}
