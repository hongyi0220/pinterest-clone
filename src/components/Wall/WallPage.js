import React from 'react';
import PropTypes from 'prop-types';

class WallPage extends React.Component {
  state = {
    pindex: null,
    clientHeight: null,
    clientWidth: null,
  };
  static propTypes = {
    storeImgs: PropTypes.func.isRequired,
    account: PropTypes.object.isRequired,
    ui: PropTypes.object.isRequired,
    imgs: PropTypes.shape({ topTags: [], search: [], magnifiedPin: {} }).isRequired,
    logInUser: PropTypes.func.isRequired,
    history: PropTypes.shape({ push: history.push }),
    storeOtherUserInfo: PropTypes.func.isRequired,
    storeMagnifiedPinInfo: PropTypes.func.isRequired,
    similarPicsKeyword: PropTypes.string,
  };

  componentWillMount() {
    console.log('WallPage will mount');
    this.setState({ clientWidth: window.innerWidth, clientHeight: window.innerHeight });
    if (this.props.similarPicsKeyword) {
      const q = this.props.similarPicsKeyword;
      const page = 1;
      fetch(`/pics?q=${q}&page=${page}`, {
        method: 'GET',
        credentials: 'include',
      })
        .then(res => res.json())
        .then(imgs => {
          this.props.storeImgs(imgs);
        })
        .catch(err => console.log(err));
    }
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
      }, () => this.props.storeMagnifiedPinInfo(this.props.imgs.search[this.state.pindex]));
    }
    // this.setState(prevState =>
    //   ({
    //     pindex: (e && prevState.pindex !== Number(eTarget.dataset.pindex)) ? Number(eTarget.dataset.pindex) : prevState.pindex
    //   })
    // );
  }

  handleSaveButtonClick = e => {
    e.stopPropagation();
    // const { pindex } = this.state;
    console.log(`saving pin/${this.state.pindex}?fromotheruser=false`);
    fetch(`/pin?pindex=${this.state.pindex}`, {
      method: 'GET',
      credentials: 'include',
    })
      .catch(err => console.log(err));
  }

  // handleUserProfileImgClick = e => {
  //   e.stopPropagation();
  //   console.log('handle User Profile Img Clicked:',e.target.dataset.username);
  //   const username = e.target.dataset.username;
  //
  //   fetch(`/user/${username}?externalapi=false`, {
  //     method: 'GET',
  //     credentials: 'include',
  //   })
  //     // .then(() => {
  //     //   this.setState({ username });
  //     //   this.props.history.push(`/user/${username}`);
  //     // })
  //     .then(res => res.json())
  //     .then(otherUser => {
  //       console.log('res from /user:', otherUser);
  //
  //       this.props.storeOtherUserInfo(otherUser);
  //       this.props.history.push(`/user/${otherUser.username}`);
  //     })
  //     .catch(err => console.log(err));
  // }

  handleMagnifyPinClick = (goToPinPage = true) => {
    console.log('handleMagnifyPinClick triggered');
    // console.log('this.state:', this.state);
    // console.log('who triggered handleMagnifyPinClick?', e.target);
    // console.log('magnifiedPin:',this.props.imgs.magnifiedPin);

    return fetch(`/pin?&pindex=${this.state.pindex}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ pindex: this.state.pindex }),
    })
      .then(res => res.json())
      .then(resJson => {
        console.log('pinId from res:', resJson.pinId);
        if (goToPinPage) {
          this.props.history.push(`/pin/${resJson.pinId}`);
          window.scroll({
            top: 0,
            behavior: 'instant'
          });
        }
        return resJson.pinId;
      })
      .catch(err => console.log(err));
  }

  handleShareButtonClick = async e => {
    e.stopPropagation();
    const pinId = await this.handleMagnifyPinClick(false);
    window.open(`https://twitter.com/intent/tweet?via=pinterest-clone&text=${pinId}`, '', `top=${(this.state.clientHeight / 2) - (200 / 2)},left=${(this.state.clientWidth / 2) - (300 / 2)},height=200,width=300`);
  }

  render() {
    const { imgs, ui } = this.props;

    return (
      <div className='wall-page-container'>
        <div className="wall">
        {imgs.search ?
          imgs.search.map((img, i) =>
          <div data-pindex={i} key={i} className='img-container' onMouseEnter={e=>{console.log('entering'); this.handlePinOnMouseOver(e);}} onMouseLeave={()=>{console.log('leaving'); this.handlePinOnMouseOver(null);}} onMouseOver={e => this.handlePinOnMouseOver(e)}>

            <div data-pindex={i} className={this.state.pindex === i ? 'img-overlay on': 'img-overlay'} onClick={e => {e.stopPropagation(); this.handleMagnifyPinClick(e);}}>

              <div className="action-button" onMouseOver={e => e.stopPropagation()}>
                <img src="/images/pin.png" alt="action button" className="pin"/>
                <div className='action-button-text' onClick={this.handleSaveButtonClick}>Save</div>
              </div>

              <div className="share-button" onMouseOver={e => e.stopPropagation()} onClick={this.handleShareButtonClick}>
                <img src="/images/tweet.png" alt="tweet"/>
              </div>

              {/* <div className="userProfileImgWrapper" onMouseOver={e => e.stopPropagation()} onClick={this.handleUserProfileImgClick}>
                <img data-username={img.username ? img.username : ''} src={img.profileImg ? img.profileImg : '/images/default-profile-image.png'} alt="user profile" />
              </div> */}

            </div>

            <img className='wall-img' src={img.src} onError={e => e.target.src = '/images/default-no-img.jpg'}/>
          </div>)
          : <div className="no-imgs-msg-wrapper">No images found</div>
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
