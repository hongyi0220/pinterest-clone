import { connect } from 'react-redux';
import SettingsPage from './SettingsPage';
import {
    toggleHeaderMenu,
    openPasswordWindow
} from '../../actions';

const mapStateToProps = state => ({ account: state.account });

const SettingsPageContainer = connect(
    mapStateToProps,
    {
        toggleHeaderMenu,
        openPasswordWindow
    }
)(SettingsPage);

export default SettingsPageContainer;
