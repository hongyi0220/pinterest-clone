import React from 'react';
import { connect } from 'react-redux';
import CreatePinModal from './CreatePinModal';
import {
    toggleModal,
    storeImgs,
    openMsgModal
} from '../../../actions';

const mapDispatchToProps = (dispatch, ownProps) => ({
    toggleModal: open => dispatch(toggleModal(open)),
    storeImgs: imgs => dispatch(storeImgs(imgs)),
    openMsgModal: () => dispatch(openMsgModal()),
    history: ownProps.history
});

const CreatePinModalContainer = connect(
    state => ({ ui: state.ui, account: state.account, }),
    mapDispatchToProps
    // {
    //     toggleModal,
    //     storeImgs,
    //     openMsgModal,
    //     this.props.history
    // }
)(CreatePinModal);
export default CreatePinModalContainer;
