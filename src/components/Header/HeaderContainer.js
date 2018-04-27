import { connect } from 'react-redux';
import Header from './Header';
import {
    storeImgs,
    toggleHeaderMenu,
    concatImgsToStore,
    toggleFetchingPics
} from '../../actions';

const mapStateToProps = state => state;

const HeaderContainer = connect(
    mapStateToProps,
    {
        storeImgs,
        toggleHeaderMenu,
        concatImgsToStore,
        toggleFetchingPics
    }
)(Header);

export default HeaderContainer;
