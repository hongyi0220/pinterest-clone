// import React from 'react';
import { connect } from 'react-redux';
import CreatePinModal from './CreatePinModal';
import {
  toggleModal,
  storeImgs,
  openMsgModal,
} from '../../../actions';

const mapDispatchToProps = (dispatch, ownProps) => ({
  toggleModal: open => dispatch(toggleModal(open)),
  storeImgs: imgs => dispatch(storeImgs(imgs)),
  openMsgModal: (title, msg) => dispatch(openMsgModal(title, msg)),
  history: ownProps.history
});

const CreatePinModalContainer = connect(
  state => ({ ui: state.ui, account: state.account, }),
  mapDispatchToProps,
)(CreatePinModal);
export default CreatePinModalContainer;
