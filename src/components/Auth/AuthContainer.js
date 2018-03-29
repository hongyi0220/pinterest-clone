import { connect } from 'react-redux';
import AuthPage from './AuthPage';
import {
    logInUser
} from '../../actions';

const mapStateToProps = state => {
    console.log(state);
    return {
        userInput: state.account.userInput
    }
};

const AuthContainer = connect(
    mapStateToProps,
    {
        logInUser
    }
)(AuthPage);

export default AuthContainer;
