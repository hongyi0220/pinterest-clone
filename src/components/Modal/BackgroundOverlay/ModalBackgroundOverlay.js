import React from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import MsgModalContainer from '../Msg/MsgModal';
import PasswordModalContainer from '../Password/PasswordModalContainer';
import CreatePinModalContainer from '../CreatePin/CreatePinModalContainer';
import {
    toggleModal
} from '../../../actions';

class ModalBackgroundOverlay extends React.Component {
    state = {
        // isMsgModalOpen: false
    }
    closePasswordModalFromBackground = e => {
        if (e.target.className === 'modal-background-overlay') {
            console.log('-intermediary-CLOSE-FROM-PARENT:PasswordModal');
            this.props.toggleModal(false);
        }
    }

    render() {
        const {} = this.state;
        const { ui } = this.props;

        return (
            <div className="modal-background-overlay" onClick={this.closePasswordModalFromBackground}>
                <Route exact path='/settings' render={() => ui.MsgModal ? <MsgModalContainer /> : <PasswordModalContainer />} />
                <Route exact path='/user' component={CreatePinModalContainer} />
            </div>
        );
    }
}

const ModalBackgroundOverlayContainer = connect(
    state => ({ ui: state.ui }),
    {
        toggleModal
    }
)(ModalBackgroundOverlay);

export default ModalBackgroundOverlayContainer;
