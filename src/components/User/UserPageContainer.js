import { connect } from 'react-redux';
import UserPage from './UserPage';
import {
    toggleModal
} from '../../actions';

const mapStateToProps = state => state;

const UserPageContainer = connect(
    mapStateToProps,
    {
        toggleModal
    }
)(UserPage);
export default UserPageContainer;
