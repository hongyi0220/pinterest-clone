import { connect } from 'react-redux';
import WallPage from './WallPage';
import {
    storeImgs,
    logInUser,
    storeOtherUserInfo,
} from '../../actions';

const mapStateToProps = state => state;

const WallPageContainer = connect(
    mapStateToProps,
    {
        storeImgs,
        logInUser,
        storeOtherUserInfo
    }
)(WallPage);

export default WallPageContainer;
