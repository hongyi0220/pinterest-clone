import { connect } from 'react-redux';
import SettingsPage from './SettingsPage';
import {
    toggleHeaderMenu
} from '../../actions';

const mapStateToProps = state => ({ account: state.account });

const SettingsPageContainer = connect(
    mapStateToProps,
    {
        toggleHeaderMenu
    }
)(SettingsPage);

export default SettingsPageContainer;
