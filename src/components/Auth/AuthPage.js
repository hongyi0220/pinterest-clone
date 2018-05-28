import React from 'react';
import PropTypes from 'prop-types';
import { Route, } from 'react-router-dom';

class AuthPage extends React.Component {
  static propTypes = {
    logInUser: PropTypes.func.isRequired,
  };
  state = {
    email: '',
    password: '',
    typeOfSubmitButton: 'continue',
    doesEmailExist: false,
  };
  componentWillMount() {
    console.log('AuthPage component WILL mount');
  }
  emailInputTimeout = null;

  handleEmailInputOnChange = e => this.setState({ email: e.target.value });

  handlePasswordInput = e => this.setState({ password: e.target.value });

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

  render() {
    const { email, password } = this.state;
    return (
      <div className='auth-page-container'>
        <form className='auth-form' method='POST' action={this.state.typeOfSubmitButton === 'signup' ? '/signup' : '/auth'}>
          <img src='/images/pinterest_logo.png'/>
          <h1>Welcome to Pinterest</h1>
          <p>Find new ideas to try</p>
          <div className='input-container'>
            <input type='email' name='email' placeholder='Email' onChange={this.handleEmailInputOnChange} value={email} onKeyUp={this.handleEmailInputOnKeyUp} />
            {this.state.doesEmailExist && <div className='green-checkmark'>✅</div>}
            <input type='password' name='password' placeholder='Create a password' onChange={this.handlePasswordInput} value={password}/>
            <Route path='/login-error' render={() => <div className='login-error-msg'><p>Password entered is incorrect</p></div>}/>
            {{
                continue: <button type='submit' className='disabled'>Continue</button>,
                login: <button type='submit'>Log in</button>,
                signup: <button type='submit'>Sign up</button>
              }[this.state.typeOfSubmitButton]}
            <span>OR</span>
            <a href="/auth/twitter">Sign in with Twitter</a>
          </div>
          {`You typed: Password:${password}`}
        </form>
        <div className='baloon'>
          <p>
            Pinterest helps you find ideas to try.
          </p>
        </div>
      </div>
    );
  }
}
export default AuthPage;
