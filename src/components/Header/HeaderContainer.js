import { connect } from 'react-redux';
import Header from './Header';
import {
    storeImages
} from '../../actions';

const mapStateToProps = state => ({...state});

const HeaderContainer = connect(
    mapStateToProps,
    {
        storeImages
    }
)(Header);

export default HeaderContainer;
