import { connect } from 'react-redux';
import Header from './Header';
import {
    storeImgs,
    toggleHeaderMenu,
    concatImgsToStore,
    toggleFetchingPics,
    storeOtherUserInfo,
    storeSearchKeywords,
} from '../../actions';

const mapStateToProps = state => state;

const HeaderContainer = connect(
    mapStateToProps,
    {
        storeImgs,
        toggleHeaderMenu,
        concatImgsToStore,
        toggleFetchingPics,
        storeOtherUserInfo,
        storeSearchKeywords,
    }
)(Header);

export default HeaderContainer;
