import React from 'react';
import { connect } from 'react-redux';
import CreatePinModal from './CreatePinModal';
import {
    toggleModal,
    storeImgs,
    openMsgModal
} from '../../../actions';

const mapDispatchToProps = (dispatch, ownProps) => ({
    toggleModal,
    storeImgs,
    openMsgModal,
    history: location => ownProps.history.push(location)
});

const CreatePinModalContainer = connect(
    state => ({ ui: state.ui }),
    mapDispatchToProps
    // {
    //     toggleModal,
    //     storeImgs,
    //     openMsgModal,
    //     this.props.history
    // }
)(CreatePinModal);
export default CreatePinModalContainer;
