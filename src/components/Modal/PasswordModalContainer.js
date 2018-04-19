import { connect } from 'react-redux';
import PasswordModal from './PasswordModal';
import {
    togglePasswordModal
} from '../../actions';

const mapStateToProps = state => ({ ui: state.ui });

const PasswordModalContainer = connect(
    mapStateToProps,
    {
        togglePasswordModal
    }
)(PasswordModal);

export default PasswordModalContainer;
