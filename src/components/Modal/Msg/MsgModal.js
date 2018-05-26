import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  toggleModal,
  toggleMsgModal,
} from '../../../actions';

const MsgModal = ({ msgModal, toggleModal, toggleMsgModal,}) => {
  return (
    <div className="msg-modal-container">
      <h2>{msgModal.title || 'Success!'}</h2>
      <div className="msg-text-wrapper">
        {msgModal.msg}
      </div>
      <div className="button-wrapper">
        <div className="okay button" onClick={() => {toggleModal(false); toggleMsgModal(false);} }>Okay</div>
      </div>
    </div>
  );
};

MsgModal.propTypes = {
  msgModal: PropTypes.shape({ }).isRequired,
  toggleModal: PropTypes.func.isRequired,
  toggleMsgModal: PropTypes.func.isRequired,
};

const MsgModalContainer = connect(
  state => ({ msgModal: state.ui.msgModal }),
  {
    toggleModal,
    toggleMsgModal,
  }
)(MsgModal);

export default MsgModalContainer;
