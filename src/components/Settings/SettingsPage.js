import React from 'react';

class SettingsPage extends React.Component {
    state = {
        uploadedImage: this.props.account.user.profileImg
    };

    formSubmitButton = null;

    handleImageUpload = e => {
        console.log('handling ImageUplaod');
        console.log('e.target.files[0]:', e.target.files[0]);
        const imageFile = e.target.files[0];
        const uploadedImageSrc = window.URL.createObjectURL(imageFile);
        this.setState({ uploadedImage: uploadedImageSrc });

        let formData = new FormData();
        formData.append('imageFile', imageFile);

        console.log('formData after appending data:', formData);
        fetch('/profile-img', {
            method: 'post',
            credentials: 'include',
            body: formData
        })
        .catch(err => console.log(err));
    }
    submitForm = () => {
        console.log('submitForm clicked');
        console.log('this.formSubmitButton:', this.formSubmitButton);
        console.log('this.formSubmitButton.current:', this.formSubmitButton.current);
        this.formSubmitButton.click();
    }


    render() {
        const { account } = this.props;
        const { uploadedImage } = this.state;
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
                                    <img src={uploadedImage} alt="profile image" className="profile-img"/>
                                </div>
                                <div className='input-field-container file'>
                                    <label htmlFor="profile-img" className='change-picture-button'>Change picture</label>
                                    <input type="file" id='profile-img' accept='image/*' name='profileImg' onChange={this.handleImageUpload}/>
                                </div>
                            </div>
                        </div>
                        <button className='invisible' ref={el => this.formSubmitButton = el} type='submit'></button>
                    </form>
                </div>
                <div className="settings-footer">
                    <div className="settings-footer-button save" onClick={this.submitForm}>Save settings</div>
                    <div className="settings-footer-button cancel">Cancel</div>
                </div>
            </div>
        );
    }
}

export default SettingsPage;
