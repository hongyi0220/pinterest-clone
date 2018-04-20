import React from 'react';
import { connect } from 'react-redux';
import {
    toggleModal
} from '../../../actions';

const MsgModal = ({ toggleModal }) => {
    return (
        <div className="msg-modal-container">
            <h2>Password changed!</h2>
            <div className="msg-text-wrapper">
                Your password has been changed successfully.
            </div>
            <div className="button-wrapper">
                <div className="okay button" onClick={() => toggleModal(false)}>Okay</div>
            </div>
        </div>
    );
}

const MsgModalContainer = connect(
    state => state,
    {
        toggleModal
    }
)(MsgModal);

export default MsgModalContainer;
