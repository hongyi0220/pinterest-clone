import { connect } from 'react-redux';
import Header from './Header';
import {
    storeImages,
    toggleHeaderMenu
} from '../../actions';

const mapStateToProps = state => state;

const HeaderContainer = connect(
    mapStateToProps,
    {
        storeImages,
        toggleHeaderMenu
    }
)(Header);

export default HeaderContainer;
