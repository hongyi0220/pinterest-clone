import { connect } from 'react-redux';
import Authpage from './Authpage';

const mapStateToProps = state => ({...state})

const AuthContainer = connect(
    mapStateToProps,
    {
        //...actions
    }
)(Authpage);

export default AuthContainer;
