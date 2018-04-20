import { connect } from 'react-redux';
import SettingsPage from './SettingsPage';
import {
    toggleHeaderMenu,
    toggleModal
} from '../../actions';

const mapStateToProps = state => ({ account: state.account });

const SettingsPageContainer = connect(
    mapStateToProps,
    {
        toggleHeaderMenu,
        toggleModal
    }
)(SettingsPage);

export default SettingsPageContainer;
