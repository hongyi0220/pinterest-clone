import { connect } from 'react-redux';
import PasswordModal from './PasswordModal';
import {
    toggleModal
} from '../../../actions';

const mapStateToProps = state => ({ ui: state.ui });

const PasswordModalContainer = connect(
    mapStateToProps,
    {
        toggleModal
    }
)(PasswordModal);

export default PasswordModalContainer;
