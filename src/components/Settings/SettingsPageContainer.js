import { connect } from 'react-redux';
import SettingsPage from './SettingsPage';

const mapStateToProps = state => ({ account: state.account });

const SettingsPageContainer = connect(
    mapStateToProps,
    {

    }
)(SettingsPage);

export default SettingsPageContainer;
