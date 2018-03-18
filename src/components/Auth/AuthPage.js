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
            <div>
                <form className='auth-form'>
                    <input onChange={addUserInput} value={userInput}/>
                    <input name='password' placeholder='Create a password'/>
                    <button>Continue</button>
                    {`You typed: ${userInput}`}
                </form>
            </div>
        );
    }
}
export default AuthPage;
