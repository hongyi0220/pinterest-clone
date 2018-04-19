import { connect } from 'react-redux';
import SettingsPage from './SettingsPage';
import {
    toggleHeaderMenu,
    togglePasswordModal
} from '../../actions';

const mapStateToProps = state => ({ account: state.account });

const SettingsPageContainer = connect(
    mapStateToProps,
    {
        toggleHeaderMenu,
        togglePasswordModal
    }
)(SettingsPage);

export default SettingsPageContainer;
