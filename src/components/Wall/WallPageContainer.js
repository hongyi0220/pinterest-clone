import { connect } from 'react-redux';
import WallPage from './WallPage';
import {
    storeImgs,
    logInUser,
    storeOtherUserInfo,
    storeMagnifiedPinInfo,
    concatImgsToStore,
    storeSearchKeywords,
    toggleMsgModal,
} from '../../actions';

const mapStateToProps = state => state;

const WallPageContainer = connect(
    mapStateToProps,
    {
        storeImgs,
        logInUser,
        storeOtherUserInfo,
        storeMagnifiedPinInfo,
        concatImgsToStore,
        storeSearchKeywords,
        toggleMsgModal,
    }
)(WallPage);

export default WallPageContainer;
