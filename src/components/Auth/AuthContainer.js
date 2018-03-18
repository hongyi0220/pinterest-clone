import { connect } from 'react-redux';
import AuthPage from './AuthPage';
import {
    addUserInput
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
        addUserInput
    }
)(AuthPage);

export default AuthContainer;
