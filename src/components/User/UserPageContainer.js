import { connect } from 'react-redux';
import UserPage from './UserPage';
import {
    toggleModal,
    storeMagnifiedPinInfo,
} from '../../actions';

const UserPageContainer = connect(
    state => state,
    {
        toggleModal,
        storeMagnifiedPinInfo,
    }
)(UserPage);
export default UserPageContainer;
