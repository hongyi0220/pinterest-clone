import React from 'react';
import PropTypes from 'prop-types';

class UserPage extends React.Component {
  static propTypes = {
    account: PropTypes.shape({
      otherUser: PropTypes.shape({
        pins: PropTypes.shape([ ]),
      }),
    }).isRequired,
    toggleModal: PropTypes.func.isRequired,
    history: PropTypes.shape({ push: PropTypes.func }).isRequired,
    storeMagnifiedPinInfo: PropTypes.func.isRequired,
    concatToUserPins: PropTypes.func.isRequired,
  };
  state = {
    pindex: null,
    pinId: null,
    isCreatePinButtonHiglighted: false,
  };

  componentWillMount() {
  }

  handlePinOnMouseOver = e => {
    const eTarget = e ? e.target : null;
    if (e === null) {
      return this.setState({
        pindex: null,
        pinId: null,
      });
    }
    if (this.state.pinId !== eTarget.dataset.pinId) {
      this.setState({
          pinId: eTarget.dataset.pinId,
          pindex: Number(eTarget.dataset.pindex),
      });
    }
  }

  highlightCreatePinButton = () => this.setState(prevState => ({
    isCreatePinButtonHiglighted: !prevState.isCreatePinButtonHiglighted }));

  handleDeleteButtonClick = e => {
    e.stopPropagation();
    fetch(`/pin?pinId=${this.state.pinId}`, {
      method: 'DELETE',
      credentials: 'include'
    })
      .catch(err => console.log(err));
  }

  handleSaveButtonClick = e => {
    e.stopPropagation();
    fetch(`/pin?pindex=${this.state.pindex}&fromotheruser=true`, {
      method: 'GET',
      credentials: 'include',
    })
      .then(res => res.json())
      .then(resJson => {
        this.props.concatToUserPins(resJson.pin);
      })
      .catch(err => console.log(err));
  }

  handleMagnifyPinClick = () => {
    const { account } = this.props;
    const { pindex } = this.state;
    this.props.storeMagnifiedPinInfo(account.otherUser ?
      account.otherUser.pins[pindex] : account.user.pins[pindex]);
    window.scroll({
      top: 0,
      behavior: 'instant'
    });
  }

  render() {
    const { account, toggleModal } = this.props;
    const { isCreatePinButtonHiglighted } = this.state;
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

            {pins ? pins.map((pin, i) =>
              <div data-pin-id={pin._id} data-pindex={i} key={i} className='img-container' onMouseEnter={e=>{this.handlePinOnMouseOver(e);}} onMouseLeave={()=>{this.handlePinOnMouseOver(null);}}>

                <div data-pin-id={pin._id} data-pindex={i} className={this.state.pindex === i ? 'img-overlay on': 'img-overlay'} onClick={() => {this.handleMagnifyPinClick(); this.props.history.push(`/pin/${this.state.pinId}`); }}>
                  {account.otherUser ?
                    <div className="action-button" onMouseOver={e => e.stopPropagation()}>
                      <img src="/images/pin.png" alt="save button" className="pin"/>
                    <div className='action-button-text' onClick={this.handleSaveButtonClick}>Save</div>
                    </div> :
                    <div className="action-button">
                      <img src="/images/pin.png" alt="delete button" className="pin"/>
                      <div className='action-button-text' onClick={this.handleDeleteButtonClick}>Delete</div>
                    </div>
                  }

                  <div className="share-button"></div>
                </div>
                <img className='wall-img' src={pin.src} onError={e => e.target.src = '/images/default-no-img.jpg'}/>
              </div>) : ''
            }
          </div>
        </div>
      </div>
    );
  }
}

export default UserPage;
