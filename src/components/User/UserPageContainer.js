import { connect } from 'react-redux';
import UserPage from './UserPage';
import {

} from '../../actions';

const mapStateToProps = state => ({...state});

const UserPageContainer = connect(
    mapStateToProps,
    {

    }
)(UserPage);
export default UserPageContainer;
