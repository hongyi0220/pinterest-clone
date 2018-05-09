import React from 'react';
import PropTypes from 'prop-types';

class WallPage extends React.Component {
  state = {
    pindex: null,
  };
  static propTypes = {
    storeImgs: PropTypes.func.isRequired,
    account: PropTypes.object.isRequired,
    ui: PropTypes.object.isRequired,
    imgs: PropTypes.shape({ topTags: [] }).isRequired,
    logInUser: PropTypes.func.isRequired,
    history: PropTypes.shape({ push: history.push }).isRequired,
    storeOtherUserInfo: PropTypes.func.isRequired,
    storeMagnifiedPinInfo: PropTypes.func.isRequired,
    similarPicsKeyword: PropTypes.string,
  };

  handlePinOnMouseOver = e => {
    console.log('pindex:', e ? e.target.dataset.pindex : '');
    this.setState({ pindex: e ? Number(e.target.dataset.pindex) : null });
  }

  savePin = e => {
    e.stopPropagation();
    // const { pindex } = this.state;
    console.log(`saving pin/${this.state.pindex}`);
    fetch(`/pin?pindex=${this.state.pindex}`, {
      method: 'PUT',
      credentials: 'include',
    })
      .catch(err => console.log(err));
  }

  handleUserProfileImgClick = e => {
    e.stopPropagation();
    console.log('handle User Profile Img Clicked:',e.target.dataset.username);
    const username = e.target.dataset.username;
    fetch(`/user/${username}`, {
      method: 'GET',
      credentials: 'include',
    })
      .then(res => res.json())
      .then(otherUser => {
        console.log('res from /user:', otherUser);
        // this.props.logInUser(user);
        this.props.storeOtherUserInfo(otherUser);
        this.props.history.push(`/user/${otherUser.username}`);
      })
      .catch(err => console.log(err));
  }
  handleMagnifyPinClick = () => {
    console.log('handleMagnifyPinClick triggered');
    this.props.storeMagnifiedPinInfo(this.state.pindex);
  }

  componentWillMount() {
    console.log('WallPage will mount');
    if (this.props.similarPicsKeyword) {
      const q = this.props.similarPicsKeyword;
      const page = 1;
      fetch(`/pics?q=${q}&page=${page}`, {
        method: 'GET',
        credentials: 'include',
      })
        .then(res => res.json())
        .then(imgs => {
          // if (e.scroll) {
          //   this.props.concatImgsToStore(imgs);
          // } else {
          //   this.props.storeImgs(imgs);
          // }
          // // this.setState({ fetchingPics: false });
          // this.props.toggleFetchingPics();
          // console.log('state after fetchingPics:',this.state);
          this.props.storeImgs(imgs);
        })
        .catch(err => console.log(err));
    }
  }

  render() {
    const { imgs, ui } = this.props;
    // const { pindex } = this.state;

    return (
      <div className='wall-page-container'>
        <div className="wall">
        {imgs.search ?
          imgs.search.map((img, i) => <div data-pindex={i} key={i} className='img-container' onMouseEnter={e=>{console.log('entering'); this.handlePinOnMouseOver(e);}} onMouseLeave={()=>{console.log('leaving'); this.handlePinOnMouseOver(null);}}>
            <div data-pindex={i} className={this.state.pindex === i ? 'img-overlay on': 'img-overlay'} onClick={() => {this.handleMagnifyPinClick(); this.props.history.push(`/pin/${i}`); }}>
              <div className="action-button">
                <img src="./images/pin.png" alt="action button" className="pin"/>
                <div className='action-button-text' onClick={this.savePin}>Save</div>
              </div>
              <div className="share-button" onClick={() => window.open(`https://twitter.com/intent/tweet?via=pinterest-clone&text=`, '', 'top=,left=,height=,width=')}>
                <img src="./images/tweet.png" alt="tweet"/>
              </div>
              <div className="userProfileImgWrapper" onClick={this.handleUserProfileImgClick}>
                <img data-username={img.username ? img.username : ''} src={img.profileImg ? img.profileImg : './images/default-profile-image.png'} alt="user profile" />
              </div>
            </div>
            <img className='wall-img' src={img.src} onError={e => e.target.src = './images/default-no-img.jpg'}/>
          </div>) : <div className="no-imgs-msg-wrapper">No images found</div>
        }
        </div>
        <div className="loading-icon-wrapper">
          <div className={ui.fetchingPics ? 'loading-icon on' : 'loading-icon'} >
            <svg>
              <circle cx='35%' cy='35%'/>
              <circle cx='65%' cy='35%'/>
              <circle cx='35%' cy='65%'/>
              <circle cx='65%' cy='65%'/>
            </svg>
          </div>
        </div>
      </div>
    );
  }
}

export default WallPage;
