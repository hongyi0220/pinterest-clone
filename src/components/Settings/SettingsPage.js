import React from 'react';

class SettingsPage extends React.Component {
    state = {
        uploadedImg: '',
        email: '',
        username: ''
    };

    formSubmitButton = null;

    handleImageUpload = e => {
        console.log('handling ImageUplaod');
        console.log('e.target.files[0]:', e.target.files[0]);
        const imgFile = e.target.files[0];
        const uploadedImg = window.URL.createObjectURL(imgFile);
        this.setState({ uploadedImg });

        let formData = new FormData();
        formData.append('imgFile', imgFile);

        console.log('formData after appending data:', formData);
        fetch('/profile-img', {
            method: 'post',
            credentials: 'include',
            body: formData
        })
        .then(res => {
            console.log('res from /profile-img:', res);
            return res.json();
        })
        .then(resJson => {
            console.log('resJson from /profile-img:',resJson);
            this.setState({ uploadedImg: resJson.url })
        })
        .catch(err => console.log(err));
    }
    submitForm = () => {
        console.log('submitForm clicked');

        const body = JSON.stringify(this.state);
        console.log('JSON.stringify(this.state):',body );
        fetch('/profile', {
            method: 'post',
            headers: {
                'content-type': 'application/json'
            },
            credentials: 'include',
            body
        })
        .catch(err => console.log(err));
    }

    handleEmailInputChange = e => this.setState({ email: e.target.value });
    handleUsernameInputChange = e => this.setState({ username: e.target.value });

    componentWillMount() {
        console.log('SettingsPage componentWillMount');
        this.setState({
            uploadedImg: this.props.account.user.profileImg,
            email: this.props.account.user.email,
            username: this.props.account.user.username
        });
        this.props.toggleHeaderMenu();
    }

    render() {
        const { account } = this.props;
        const { uploadedImg, email, username } = this.state;
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
                                <input type="email" id='email' name='email' value={email} onChange={this.handleEmailInputChange}/>
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
                                <input type="username" id='username' name='username' value={username} onChange={this.handleUsernameInputChange}/>
                            </div>
                            <label className='label'>Picture</label>
                            <div className="picture-container">
                                <div className="profile-img-wrapper">
                                    <img src={uploadedImg} alt="profile image" className="profile-img"/>
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
