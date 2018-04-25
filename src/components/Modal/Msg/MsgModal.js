import React from 'react';
import { connect } from 'react-redux';
import {
    toggleModal
} from '../../../actions';

const MsgModal = ({ msgModal, toggleModal }) => {
    return (
        <div className="msg-modal-container">
            <h2>{msgModal.title || 'Success!'}</h2>
            <div className="msg-text-wrapper">
                {msgModal.msg}
            </div>
            <div className="button-wrapper">
                <div className="okay button" onClick={() => toggleModal(false)}>Okay</div>
            </div>
        </div>
    );
}

const MsgModalContainer = connect(
    state => ({ msgModal: state.ui.msgModal }),
    {
        toggleModal
    }
)(MsgModal);

export default MsgModalContainer;
