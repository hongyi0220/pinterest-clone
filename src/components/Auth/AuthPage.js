import React from 'react';
import PropTypes from 'prop-types';

class AuthPage extends React.Component {
    state = {
        email: '',
        password: ''
    }
    static propTypes = {
        logInUser: PropTypes.func.isRequired,
    }

    handleEmailInput = e => this.setState({ email: e.target.value });
    handlePasswordInput = e => this.setState({ password: e.target.value });

    render() {
        const { } = this.props;
        const { email, password } = this.state;
        return (
            <div className='auth-page-container'>
                <form className='auth-form' method='post' action='/auth'>
                    <img src='./images/pinterest_logo.png'/>
                    <h1>Welcome to Pinterest</h1>
                    <p>Find new ideas to try</p>
                    <div className='input-container'>
                        <input type='email' name='email' placeholder='Email' onChange={this.handleEmailInput} value={email}/>
                        <input type='password' name='password' placeholder='Create a password' onChange={this.handlePasswordInput} value={password}/>
                        <button type='submit'>Continue</button>
                    </div>
                    {`You typed: Email: ${email} Password:${password}`}
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
