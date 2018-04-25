import { connect } from 'react-redux';
import PasswordModal from './PasswordModal';
import {
    toggleModal,
    openMsgModal
} from '../../../actions';

const mapStateToProps = state => ({ ui: state.ui });

const PasswordModalContainer = connect(
    mapStateToProps,
    {
        toggleModal,
        openMsgModal
    }
)(PasswordModal);

export default PasswordModalContainer;
