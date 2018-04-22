import { connect } from 'react-redux';
import CreatePinModal from './CreatePinModal';
import {
    storeImages
} from '../../../actions';

const CreatePinModalContainer = connect(
    state => ({}),
    {
        storeImages
    }
)(CreatePinModal);
export default CreatePinModalContainer;
