import { connect } from 'react-redux';
import PasswordModal from './PasswordModal';
import {
    toggleModal,
    toggleMsgModal
} from '../../../actions';

const mapStateToProps = state => ({ ui: state.ui });

const PasswordModalContainer = connect(
    mapStateToProps,
    {
        toggleModal,
        toggleMsgModal
    }
)(PasswordModal);

export default PasswordModalContainer;
