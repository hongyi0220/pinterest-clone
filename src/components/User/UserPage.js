import React from 'react';
import PropTypes from 'prop-types';

class UserPage extends React.Component {
  state = {
    pindex: null,
    isCreatePinButtonHiglighted: false
  };
  static propTypes = {
    account: PropTypes.shape({
      otherUser: PropTypes.shape({
        pins: PropTypes.shape([ ]),
      }),
    }).isRequired,
    toggleModal: PropTypes.func.isRequired,
    history: PropTypes.shape({ push: PropTypes.func }).isRequired,
    storeMagnifiedPinInfo: PropTypes.func.isRequired,
  };

  componentWillMount() {
    console.log('Userpage will mount');
  }

  handlePinOnMouseOver = e => {
    console.log('pindex:', e ? e.target.dataset.pindex : '');
    const eTarget = e ? e.target : null;
    if (e === null) {
      return this.setState({ pindex: null });
    }
    if (this.state.pindex !== Number(eTarget.dataset.pindex)) {
      this.setState({
          pindex: Number(eTarget.dataset.pindex)
      });
    }
  }

  highlightCreatePinButton = () => this.setState(prevState => ({ isCreatePinButtonHiglighted: !prevState.isCreatePinButtonHiglighted }));

  deletePin = () => {
    // const { pindex } = this.state;
    console.log(`delete /pin? ${this.state.pindex}`);
    fetch(`/pin?pindex=${this.state.pindex}`, {
      method: 'DELETE',
      credentials: 'include'
    })
      .catch(err => console.log(err));
  }

  savePin = e => {
    e.stopPropagation();
    // const { pindex } = this.state;
    console.log(`saving pin/${this.state.pindex}`);
    fetch(`/pin?pindex=${this.state.pindex}&fromotheruser=true`, {
      method: 'PUT',
      credentials: 'include',
    })
      .catch(err => console.log(err));
  }

  handleMagnifyPinClick = () => {
    console.log('handleMagnifyPinClick triggered');
    const { account } = this.props;
    const { pindex } = this.state;
    this.props.storeMagnifiedPinInfo(account.otherUser ?
      account.otherUser.pins[pindex] : account.user.pins[pindex]);
    console.log('magnifiedPinInfo after handleMagnifyPinClick @ UserPage:', this.props.imgs.magnifiedPin);
  }

  render() {
    const { account, toggleModal } = this.props;
    const { isCreatePinButtonHiglighted } = this.state;
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

            {pins.map((pin, i) =>
              <div data-pindex={i} key={i} className='img-container' onMouseEnter={e=>{console.log('entering'); this.handlePinOnMouseOver(e);}} onMouseLeave={()=>{console.log('leaving'); this.handlePinOnMouseOver(null);}}>

                <div data-pindex={i} className={this.state.pindex === i ? 'img-overlay on': 'img-overlay'} onClick={() => {this.handleMagnifyPinClick(); this.props.history.push(`/pin/${i}`); }}>
                  {account.otherUser ?
                    <div className="action-button" onMouseOver={e => e.stopPropagation()}>
                      <img src="/images/pin.png" alt="action button" className="pin"/>
                    <div className='action-button-text' onClick={this.savePin}>Save</div>
                    </div> :
                    <div className="action-button">
                      <img src="/images/pin.png" alt="" className="pin"/>
                      <div className='action-button-text' onClick={this.deletePin}>Delete</div>
                    </div>
                  }

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
