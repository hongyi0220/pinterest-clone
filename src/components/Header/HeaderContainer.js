import { connect } from 'react-redux';
import Header from './Header';
import {
    storeImgs,
    toggleHeaderMenu
} from '../../actions';

const mapStateToProps = state => state;

const HeaderContainer = connect(
    mapStateToProps,
    {
        storeImgs,
        toggleHeaderMenu
    }
)(Header);

export default HeaderContainer;
