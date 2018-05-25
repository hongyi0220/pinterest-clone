import { connect } from 'react-redux';
import Header from './Header';
import {
    storeImgs,
    toggleHeaderMenu,
    concatImgsToStore,
    toggleLoadingSpinner,
    storeOtherUserInfo,
    storeSearchKeywords,
    storeCuratedPins,
} from '../../actions';

const mapStateToProps = state => state;

const HeaderContainer = connect(
    mapStateToProps,
    {
        storeImgs,
        toggleHeaderMenu,
        concatImgsToStore,
        toggleLoadingSpinner,
        storeOtherUserInfo,
        storeSearchKeywords,
        storeCuratedPins,
    }
)(Header);

export default HeaderContainer;
