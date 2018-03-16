import { Component } from 'react';
import PropTypes from 'prop-types';

class Authpage extends Component {
    state = {

    }
    static PropTypes = {
        
    }
    render() {
        return (
            <div>
                <form className='auth-form'>
                    <input name='username' placeholder='Email'/>
                    <input name='password' placeholder='Create a password'/>
                    <button>Continue</button>
                </form>
            </div>
        );
    }
}
export default Authpage;
