import React from 'react';
import MsgModalContainer from './MsgModal';

class PasswordModal extends React.Component {
    state = {
        oldPassword: '',
        maskedOldPassword: '',
        newPassword: '',
        maskedNewPassword: '',
        isWrongPassword: false,
        uiMsgModal: false
    }
    convertInputToPasswordBasedOnPrevState = (input, pwInPrevState) => {
        if (input.length > pwInPrevState.length) {
            return pwInPrevState + input[input.length - 1];
        } else if (input.length < pwInPrevState.length) {
            return pwInPrevState.slice(0, input.length)
        } else if (!input.length) {
            return '';
        } else {
            return '';
        }
    }
    handleOldPasswordInputChange = e => {
        const eTarget = e.target;
        this.setState(prevState => ({
            oldPassword: this.convertInputToPasswordBasedOnPrevState(eTarget.value, prevState.oldPassword),
            maskedOldPassword: this.maskPassword(eTarget.value),
            isWrongPassword: false
        }));
    }
    handleNewPasswordInputChange = e => {
        const eTarget = e.target;
        this.setState(prevState => ({
            newPassword: this.convertInputToPasswordBasedOnPrevState(eTarget.value, prevState.newPassword),
            maskedNewPassword: this.maskPassword(eTarget.value)
        }));
    }
    closePasswordModalFromBackground = e => {
        if (e.target.className === 'password-modal-background') {
            console.log('-intermediary-CLOSE-FROM-PARENT:PasswordModal');
            this.props.togglePasswordModal(false);
        }
    }
    closePasswordModalFromButton = e => {
        if (e.target.className === 'cancel button') {
            console.log('-intermediary-CLOSE-FROM-CHILD:PasswordModal');
            this.props.togglePasswordModal(false);
        }
    }
    submitForm = () => {
        const { oldPassword, newPassword } = this.state
        const body = JSON.stringify({ oldPassword, newPassword });
        fetch('/password', {
            method: 'post',
            credentials: 'include',
            headers: {
                'content-type': 'application/json'
            },
            body
        })
        .then(res => res.json())
        .then(resJson => {
            if (!resJson.matchedCount) {
                this.setState({ isWrongPassword: true });
            } else if (resJson.matchedCount && resJson.modifiedCount) {
                this.setState({ uiMsgModal: true });
            }
        })
        .catch(err => console.log(err));
    }
    maskPassword = p => [...p].map(c => '●').join('');

    render() {
        const { oldPassword,
            maskedOldPassword,
            newPassword,
            maskedNewPassword,
            isWrongPassword,
            uiMsgModal
         } = this.state;

        return (
            <div className="password-modal-background" onClick={this.closePasswordModalFromBackground}>
                {uiMsgModal ? <MsgModalContainer /> :
                    <div className="password-modal-container">
                        <form action="" >
                            <h2>Change your password</h2>
                            <div className="input-field-container old-password">
                                <div className="label-wrapper">
                                    <label htmlFor="">Old password</label>
                                </div>

                                <div className="input-wrapper">
                                    <input className={isWrongPassword ? 'wrong-password' : ''} type="text" value={maskedOldPassword} onChange={this.handleOldPasswordInputChange}/>
                                </div>

                            </div>
                            <div className="input-field-container new-password">
                                <div className="label-wrapper">
                                    <label htmlFor="">New password</label>
                                </div>
                                <div className="input-wrapper">
                                    <input type="text" value={maskedNewPassword} onChange={this.handleNewPasswordInputChange}/>
                                </div>
                            </div>
                            <div className="buttons-container-wrapper">
                                <div className="buttons-container">
                                    <div className={newPassword && oldPassword ? 'change-password button' : 'change-password button disabled'} disabled={!newPassword && !oldPassword} onClick={this.submitForm}>Change password</div>
                                    <div className='cancel button' onClick={this.closePasswordModalFromButton}>Cancel</div>
                                </div>
                            </div>
                        </form>
                    </div>
                }
            </div>
        );
    }
}

export default PasswordModal;