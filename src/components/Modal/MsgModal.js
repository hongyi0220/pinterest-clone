import React from 'react';
import { connect } from 'react-redux';
import {
    togglePasswordModal
} from '../../actions';

const MsgModal = ({ togglePasswordModal }) => {
    return (
        <div className="msg-modal-container">
            <h2>Password changed!</h2>
            <div className="msg-text-wrapper">
                Your password has been changed successfully.
            </div>
            <div className="button-wrapper">
                <div className="okay button" onClick={() => togglePasswordModal(false)}>Okay</div>
            </div>
        </div>
    );
}

const MsgModalContainer = connect(
    state => state,
    {
        togglePasswordModal
    }
)(MsgModal);

export default MsgModalContainer;
