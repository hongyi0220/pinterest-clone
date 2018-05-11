import React from 'react';
import PropTypes from 'prop-types';

class UserPage extends React.Component {
  state = {
    pindex: null,
    isCreatePinButtonHiglighted: false
  }
  static propTypes = {
    account: PropTypes.shape({ }).isRequired,
    toggleModal: PropTypes.func.isRequired,
  }

  componentWillMount() {
    console.log('Userpage will mount');
  }

  highlightPin = e => {
    if (e) console.log(e.target.id);
    this.setState({ pindex: e ? e.target.id : null });
  }

  highlightCreatePinButton = () => this.setState(prevState => ({ isCreatePinButtonHiglighted: !prevState.isCreatePinButtonHiglighted }));

  deletePin = () => {
    const { pindex } = this.state;
    console.log(`/delete-pin?${pindex.split('-')[1]}`);
    fetch(`/pin?pindex=${pindex.split('-')[1]}`, {
      method: 'delete',
      credentials: 'include'
    })
      .catch(err => console.log(err));
  }

  render() {
    const { account, toggleModal } = this.props;
    const { pindex, isCreatePinButtonHiglighted } = this.state;
    console.log('account.user:',account.user);
    const pins = account.otherUser ? account.otherUser.pins : account.user.pins;
    return (
      <div className="user-page-container">
        <div className="user-info-container">
          <div className="username-wrapper">
            {account.otherUser ? account.otherUser.username : account.user.username}
          </div>
          <div className="profile-image-wrapepr">
            <img src={account.otherUser ? account.otherUser.profileImg : account.user.profileImg} alt="profile image" onError={e => e.target.src = '/images/default-profile-image.png'}/>
          </div>
        </div>
        <div className="saved-images-container">
          <h2>Saved Pins</h2>
          <div className="wall">
            {account.otherUser ? '' :
            <div className='create-pin-button' onMouseEnter={this.highlightCreatePinButton} onMouseLeave={this.highlightCreatePinButton} onClick={() => toggleModal(true)}>
              <div className={isCreatePinButtonHiglighted ? 'img-overlay on': 'img-overlay'}>
                <div className="action-button">
                  <img src={'/images/create-pin.png'}/>
                </div>
              </div>
              <div className='wall-img'></div>
            </div>}

            {pins.map((pin, i) => <div id={`pin-${i}`} key={i} className='img-container' onMouseEnter={e=>{console.log('entering'); this.highlightPin(e);}} onMouseLeave={()=>{console.log('leaving'); this.highlightPin(null);}}>
                <div id={`pin-${i}`} className={pindex === `pin-${i}` ? 'img-overlay on': 'img-overlay'}>
                  {account.otherUser ? '' : <div className="action-button">
                    <img src="/images/pin.png" alt="" className="pin"/>
                    <div className='action-button-text' onClick={this.deletePin}>Delete</div>
                  </div>}

                  <div className="share-button"></div>
                </div>
                <img className='wall-img' src={pin.src} onError={e => e.target.src = '/images/default-no-img.jpg'}/>
              </div>)
            }
          </div>
        </div>
      </div>
    );
  }
}

export default UserPage;
