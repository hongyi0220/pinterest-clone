// import React from 'react';
import { connect } from 'react-redux';
import CreatePinModal from './CreatePinModal';
import {
  toggleModal,
  storeImgs,
  toggleMsgModal,
} from '../../../actions';

const mapDispatchToProps = (dispatch, ownProps) => ({
  toggleModal: open => dispatch(toggleModal(open)),
  storeImgs: imgs => dispatch(storeImgs(imgs)),
  toggleMsgModal: content => dispatch(toggleMsgModal(content)),
  history: ownProps.history
});

const CreatePinModalContainer = connect(
  state => ({ ui: state.ui, account: state.account, }),
  mapDispatchToProps,
)(CreatePinModal);
export default CreatePinModalContainer;
