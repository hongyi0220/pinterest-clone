import { connect } from 'react-redux';
import AuthPage from './AuthPage';
import {
    logInUser
} from '../../actions';

const mapStateToProps = state => {
    console.log(state);
    return {

    }
};

const AuthPageContainer = connect(
    mapStateToProps,
    {
        logInUser
    }
)(AuthPage);

export default AuthPageContainer;
