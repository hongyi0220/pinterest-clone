import { connect } from 'react-redux';
import WallPage from './WallPage';
import {
    storeImgs,
    logInUser,
    storeOtherUserInfo,
    storeMagnifiedPinInfo
} from '../../actions';

const mapStateToProps = state => state;

const WallPageContainer = connect(
    mapStateToProps,
    {
        storeImgs,
        logInUser,
        storeOtherUserInfo,
        storeMagnifiedPinInfo,
    }
)(WallPage);

export default WallPageContainer;
