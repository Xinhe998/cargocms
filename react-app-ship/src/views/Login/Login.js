/* @flow */
import injectTapEventPlugin from 'react-tap-event-plugin';
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
import log from '../../redux/utils/logs';
import {
  handleShowToast,
  closeToast,
} from '../../redux/utils/toast';
import {
  fetchCurrentUserData,
  requestLogIn,
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
    requestLogIn,
  }, dispatch),
) export default class Login extends React.Component {
  static defaultProps = {
    requestLogIn: null,
    handleShowToast: null,
    closeToast: null,
    toast: {},
    fetchCurrentUserData: null,
  };

  static propTypes = {
    requestLogIn: PropTypes.func,
    fetchCurrentUserData: PropTypes.func,
    handleShowToast: PropTypes.func,
    closeToast: PropTypes.func,
    toast: PropTypes.object,
  };

  constructor(props) {
    super();
    try {
      injectTapEventPlugin();
    } catch (e) {
      log.info(e);
    }
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
    // document.querySelector('.login-form form').submit();
    const usr = this.username.getValue();
    const pwd = this.password.getValue();
    this.props.requestLogIn(usr, pwd);
  }

  requestLogIn = () => {
    this.props.requestLogIn(this.username.getValue(), this.password.getValue());
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
              <button
                type='submit'
                onClick={this.requestLogIn}
              >登入系統</button>
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
            autoHideDuration={5000}
          />
        </div>
      </MuiThemeProvider>
    );
  }
}
