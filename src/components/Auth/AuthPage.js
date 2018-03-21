import React from 'react';
import PropTypes from 'prop-types';

class AuthPage extends React.Component {
    state = {

    }
    static propTypes = {
        addUserInput: PropTypes.func.isRequired,
        userInput: PropTypes.string.isRequired
    }

    render() {
        const { addUserInput, userInput } = this.props;
        return (
            <div className='auth-container'>
                <form className='auth-form'>
                    <img src='./images/pinterest_logo.png'/>
                    <h1>Welcome to Pinterest</h1>
                    <p>Find new ideas to try</p>
                    <div className='input-container'>
                        <input type='email' name='email' placeholder='Email' onChange={addUserInput} value={userInput}/>
                        <input type='password' name='password' placeholder='Create a password'/>
                        <button>Continue</button>
                    </div>
                    {`You typed: ${userInput}`}
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
