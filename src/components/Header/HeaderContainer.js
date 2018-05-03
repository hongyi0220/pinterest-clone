import { connect } from 'react-redux';
import Header from './Header';
import {
    storeImgs,
    toggleHeaderMenu,
    concatImgsToStore,
    toggleFetchingPics,
    storeOtherUserInfo,
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
    }
)(Header);

export default HeaderContainer;
