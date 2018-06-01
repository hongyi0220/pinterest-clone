import React from 'react';
import PropTypes from 'prop-types';
import { Route, } from 'react-router-dom';
class AuthPage extends React.Component {
  static propTypes = {
    logInUser: PropTypes.func.isRequired,
    history: PropTypes.shape({
      push: PropTypes.func,
      location: PropTypes.shape({
        pathname: PropTypes.string,
      }),
    }),
  };
  state = {
    email: '',
    password: '',
    typeOfSubmitButton: 'continue',
    doesEmailExist: false,
    passwordHasUpperCaseLetter: false,
    passwordHasLowerCaseLetter: false,
    passwordIsLongerThanSixLetters: false,
  };
  componentWillMount() {
    console.log('AuthPage component WILL mount');
  }
  emailInputTimeout = null;

  handleEmailInputOnChange = e => {
    if (this.props.history.location.pathname !== '/') {
      this.props.history.push('/');
    }
    this.setState({ email: e.target.value });
  }

  handlePasswordInputOnChange = e => {
    if (this.props.history.location.pathname !== '/') {
      this.props.history.push('/');
    }
    const passwordHasUpperCaseLetter = /[A-Z]/g.test(e.target.value);
    const passwordHasLowerCaseLetter = /[a-z]/g.test(e.target.value);
    const passwordIsLongerThanSixLetters = e.target.value.length >= 6;

    this.setState({
      password: e.target.value,
      passwordHasUpperCaseLetter,
      passwordHasLowerCaseLetter,
      passwordIsLongerThanSixLetters,
    });
  }

  handleEmailInputOnKeyUp = e => {
    console.log('keyUP');
    e.stopPropagation();
    const eTarget = e.target;
    console.log('eTarget:',eTarget);
    console.log('e.target.value:', eTarget.value);
    clearTimeout(this.emailInputTimeout);
    this.setState({ doesEmailExist: false, });
    this.emailInputTimeout = setTimeout(() => {
      fetch(`/auth/${eTarget.value}`, {
        method: 'GET',
        credentials: 'include',
      })
        .then(res => res.json())
        .then(resJson => {
          console.log('typeOfSubmitButton:', resJson.typeOfSubmitButton);
          this.setState({
            typeOfSubmitButton: resJson.typeOfSubmitButton,
            doesEmailExist: resJson.typeOfSubmitButton === 'login'
          });
        })
        .catch(err => console.log(err));
    }, 500);
  }

  canBeSubmitted = () => {
    const {passwordHasUpperCaseLetter, passwordHasLowerCaseLetter, passwordIsLongerThanSixLetters, password, email, } = this.state;
    return (passwordHasUpperCaseLetter && passwordHasLowerCaseLetter && passwordIsLongerThanSixLetters && password && email && true);
  }

  handleFormSubmit = e => {
    console.log('handle form submit');
    console.log('can be submitted?:', this.canBeSubmitted());
    if (!this.canBeSubmitted()) {
      console.log('e.preventDefault');
      e.preventDefault();
      return;
    }
  }

  render() {
    const { email, password, passwordHasUpperCaseLetter, passwordHasLowerCaseLetter, passwordIsLongerThanSixLetters, } = this.state;
    const isEnabled = this.canBeSubmitted();
    console.log('isEnabled:', isEnabled);
    return (
      <div className='auth-page-container'>
        <div className='rolling-background-collage-wrapper'>
          <img src='/images/rolling-background-collage.png' />
        </div>
        <form className='auth-form' method='POST' action={this.state.typeOfSubmitButton === 'signup' ? '/signup' : '/auth'} onSubmit={this.handleFormSubmit}>
          <img className='logo' src='/images/pinterest_logo.png'/>
          <h1 className='title'>Welcome to Pinterest</h1>
          <p className='sub-title'>Find new ideas to try</p>
          <div className='input-container'>
            <input type='email' name='email' placeholder='Email' onChange={this.handleEmailInputOnChange} value={email} onKeyUp={this.handleEmailInputOnKeyUp} />
            {this.state.doesEmailExist ? <div className='green-checkmark'>✅ An account with this email exists</div> : <div className='green-checkmark'>🌱 This will be a new account</div>}
            <input type='password' name='password' placeholder='Create a password' onChange={this.handlePasswordInputOnChange} value={password}/>
            {this.state.password.length ? <div className="password-validation-msgs-container">
                <div className={passwordHasUpperCaseLetter ? 'password-validation-msg-wrapper valid' : 'password-validation-msg-wrapper'}>Password has an upper-case letter</div>
                <div className={passwordHasLowerCaseLetter ? 'password-validation-msg-wrapper valid' : 'password-validation-msg-wrapper'}>Password has a lower-case letter</div>
                <div className={passwordIsLongerThanSixLetters ? 'password-validation-msg-wrapper valid' : 'password-validation-msg-wrapper'}>Password is longer than 6 characters</div>
              </div> : ''
            }

            <Route path='/login-error' render={() => <div className='login-error-msg'><p>Password entered is incorrect</p></div>}/>

            {{
                continue: <button type='submit' className='disabled' disabled={!isEnabled}>Continue</button>,
                login: <button type='submit' className={isEnabled ? '' : 'disabled'} disabled={!isEnabled}>Log in</button>,
                signup: <button type='submit' className={isEnabled ? '' : 'disabled'} disabled={!isEnabled}>Sign up</button>
              }[this.state.typeOfSubmitButton]
            }
            <span>OR</span>
            <a className='twitter-signin-button' href='/auth/twitter'>
              <img src='/images/twitter-logo.png' alt='sign in with twitter'/>
              Sign in with Twitter
            </a>
          </div>
        </form>
        <div className="baloon-wrapper">
          <div className='baloon'>
            <p>
              Pinterest helps you find ideas to try.
            </p>
          </div>
        </div>
      </div>
    );
  }
}
export default AuthPage;
