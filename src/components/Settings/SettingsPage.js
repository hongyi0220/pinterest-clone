import React from 'react';
import PropTypes from 'prop-types';

class SettingsPage extends React.Component {
  static propTypes = {
    account: PropTypes.shape({ user: {} }).isRequired,
    toggleModal: PropTypes.func.isRequired,
    toggleHeaderMenu: PropTypes.func.isRequired,
  };
  state = {
    previewImg: '',
    email: '',
    username: '',
    postingFormData: false,
  };

  formSubmitButton = null;

  componentWillMount() {
    console.log('SettingsPage componentWillMount');
  }

  handleCancelButtonClick = () => this.setState({
    previewImg: '',
    email: '',
    username: '',
  })

  handleImageFileUpload = e => {
    console.log('handling ImageUplaod');
    console.log('e.target.files[0]:', e.target.files[0]);
    const imgFile = e.target.files[0];
    const previewImg = URL.createObjectURL(imgFile);
    this.setState({ previewImg, postingFormData: true, });

    let formData = new FormData();
    formData.append('imgFile', imgFile);

    console.log('formData after appending data:', formData);
    fetch('/profile-img', {
      method: 'POST',
      credentials: 'include',
      body: formData
    })
      .then(res => {
        console.log('res from /profile-img:', res);
        return res.json();
      })
      .then(resJson => {
        console.log('resJson from /profile-img:',resJson);
        this.setState({ previewImg: resJson.url, postingFormData: false });
      })
      .catch(err => console.log(err));
  }

  submitForm = () => {
    console.log('submitForm clicked');

    const body = JSON.stringify(this.state);
    console.log('JSON.stringify(this.state):',body );
    fetch('/profile', {
      method: 'put',
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

  render() {
    const { previewImg, email, username } = this.state;
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
                <input type="email" id='email' name='email' value={email} placeholder={account.user ? account.user.email : ''} onChange={this.handleEmailInputChange}/>
              </div>
              <label className='label'>Password</label>
              <div className="change-password-button" onClick={() => this.props.toggleModal(true)}>
                Change your password
              </div>
            </div>

            <div className="list-title-wrapper">Profile</div>
            <div className="profile-settings-container">
              <div className="input-field-container username">
                <label htmlFor="username" className='label'>Username</label>
                <input type="username" id='username' name='username' value={username} placeholder={account.user ? account.user.username : ''} onChange={this.handleUsernameInputChange}/>
              </div>

              <label className='label'>Picture</label>
              <div className="picture-container">
                <div className="profile-img-wrapper">
                  <img src={previewImg} alt="profile image" className="profile-img" onError={e => e.target.src = account.user ? account.user.profileImg : ''}/>
                </div>
                <div className='input-field-container file'>
                  <label htmlFor="profile-img" className='change-picture-button'>Change picture</label>
                  <input type="file" id='profile-img' accept='image/*' name='profileImg' onChange={this.handleImageFileUpload}/>
                </div>
              </div>
            </div>
            <button className='invisible' ref={el => this.formSubmitButton = el} type='submit'></button>
          </form>
        </div>

        <div className="settings-footer">
          <div className={this.state.postingFormData ? 'settings-footer-button save disabled' : 'settings-footer-button save'} onClick={this.submitForm}>Save settings</div>
          <div className="settings-footer-button cancel" onClick={this.handleCancelButtonClick}>Cancel</div>
        </div>
      </div>
    );
  }
}

export default SettingsPage;
