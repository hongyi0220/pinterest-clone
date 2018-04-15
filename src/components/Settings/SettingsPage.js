import React from 'react';

class SettingsPage extends React.Component {
    render() {
        const { account } = this.props;
        return (
            <div className="settings-page-container">
                <div className="settings-list-container">
                    <div className="list-text-wrapper">
                        <a href="">Account Basics</a>
                    </div>
                    <div className="list-text-wrapper">
                        <a href="">Profile</a>
                    </div>
                </div>
                <div className="settings-form-wrapper">
                    <form method='post' action="/profile">
                        <div className="list-title-wrapper">Account Basics</div>
                        <div className="account-settings-container">
                            <div className="input-field-container email">
                                <label htmlFor="email" className='label'>Email Address</label>
                                <input type="email" id='email' name='email' value={ account.user ? account.user.email : '' }/>
                            </div>
                            <label className='label'>Password</label>
                            <div className="change-password-button">
                                Change your password
                            </div>
                        </div>
                        <div className="list-title-wrapper">Profile</div>
                        <div className="profile-settings-container">
                            <div className="input-field-container username">
                                <label htmlFor="username" className='label'>Username</label>
                                <input type="username" id='username' name='username' value={ account.user ? account.user.username : '' }/>
                            </div>
                            <label className='label'>Picture</label>
                            <div className="picture-container">
                                <div className="profile-img-wrapper">
                                    <img src={account.user ? account.user["profile-img"] : ''} alt="profile image" className="profile-img"/>
                                </div>
                                <div className='input-field-container file'>
                                    <label htmlFor="profile-image" className='change-picture-button'>Change picture</label>
                                    <input type="file" id='profile-image' accept='image/*' name='profile-image'/>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="settings-footer">
                    <div className="settings-footer-button save">Save settings</div>
                    <div className="settings-footer-button cancel">Cancel</div>
                </div>
            </div>
        );
    }
}

export default SettingsPage;
