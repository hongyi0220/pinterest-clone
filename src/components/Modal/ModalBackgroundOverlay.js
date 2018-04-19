import React from 'react';
import MsgModalContainer from './MsgModal';
import PasswordModalContainer from './PasswordModalContainer';

class ModalBackgroundOverlay extends React.Component {
    state = {

    }

    render() {
        const {} = this.state;

        return (
            <div className="modal-background-overlay" onClick={this.closePasswordModalFromBackground}>
                {uiMsgModal ? <MsgModalContainer /> :
                    <PasswordModalContainer />
                }
            </div>
        );
    }
}

export default ModalBackgroundOverlay;
