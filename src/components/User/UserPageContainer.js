import { connect } from 'react-redux';
import UserPage from './UserPage';
import {
    toggleModal,
    storeMagnifiedPinInfo,
    concatToUserPins,
} from '../../actions';

const UserPageContainer = connect(
    state => state,
    {
        toggleModal,
        storeMagnifiedPinInfo,
        concatToUserPins,
    }
)(UserPage);
export default UserPageContainer;
