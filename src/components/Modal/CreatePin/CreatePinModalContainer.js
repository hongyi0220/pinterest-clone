import { connect } from 'react-redux';
import CreatePinModal from './CreatePinModal';
import {
    storeImgs
} from '../../../actions';

const CreatePinModalContainer = connect(
    state => ({}),
    {
        storeImgs
    }
)(CreatePinModal);
export default CreatePinModalContainer;
