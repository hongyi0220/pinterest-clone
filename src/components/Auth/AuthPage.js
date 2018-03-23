import React from 'react';
import PropTypes from 'prop-types';

class AuthPage extends React.Component {
    state = {
        email: '',
        password: ''
    }
    static propTypes = {
        addUserInput: PropTypes.func.isRequired,
        userInput: PropTypes.string.isRequired
    }

    handleEmailInput = e => this.setState({ email: e.target.value });
    handlePasswordInput = e => this.setState({ password: e.target.value });
    submitSignupData = e => {
        e.preventDefault();
        let { email, password } = this.state;

        fetch('http://localhost:3000/signup', {
            method: 'post',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                email,
                password
            })
        })
        .then(() => this.setState({
            email: '',
            password: ''
        }))
        .catch(err => console.log(err));
    }

    render() {
        const { addUserInput, userInput } = this.props;
        const { email, password } = this.state;
        return (
            <div className='auth-container'>
                <form className='auth-form'>
                    <img src='./images/pinterest_logo.png'/>
                    <h1>Welcome to Pinterest</h1>
                    <p>Find new ideas to try</p>
                    <div className='input-container'>
                        <input type='email' name='email' placeholder='Email' onChange={this.handleEmailInput} value={email}/>
                        <input type='password' name='password' placeholder='Create a password' onChange={this.handlePasswordInput} value={password}/>
                        <button type='submit' onClick={this.submitSignupData}>Continue</button>
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
