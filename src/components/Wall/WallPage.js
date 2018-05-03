import React from 'react';
import PropTypes from 'prop-types';

class WallPage extends React.Component {
  state = {
    pindex: null
  };
  static propTypes = {
    storeImgs: PropTypes.func.isRequired,
    account: PropTypes.object.isRequired,
    ui: PropTypes.object.isRequired,
    imgs: PropTypes.shape({ topTags: [] }).isRequired,
    logInUser: PropTypes.func.isRequired,
    history: PropTypes.shape({ push: history.push }).isRequired,
  };

  highlightPin = e => {
    if (e) console.log(e.target.id);
    this.setState({ pindex: e ? e.target.id : null });
  }

  savePin = () => {
    const { pindex } = this.state;
    console.log(`/save-pindex/${pindex.split('-')[1]}`);
    fetch(`/pin?pindex=${pindex.split('-')[1]}`, {
      method: 'GET',
      credentials: 'include',
    })
      .catch(err => console.log(err));
  }

  handleUserProfileImgClick = e => {
    console.log('handle User Profile Img Clicked:',e.target.dataset.username);
    const username = e.target.dataset.username;
    fetch(`/user?username=${username}`, {
      method: 'GET',
      credentials: 'include',
    })
      .then(res => res.json())
      .then(user => {
        console.log('res from /user:', user);
        this.props.logInUser(user);
        this.props.history.push(`/user/${username}`);
      })
      .catch(err => console.log(err));
  }

  componentWillMount() {
    console.log('WallPage will mount');
  }

  render() {
    const { imgs, ui } = this.props;
    const { pindex } = this.state;

    return (
      <div className='wall-page-container'>
        <div className="wall">
        {imgs.search ?
          imgs.search.map((img, i) => <div id={`pin-${i}`} key={i} className='img-container' onMouseEnter={e=>{console.log('entering'); this.highlightPin(e);}} onMouseLeave={()=>{console.log('leaving'); this.highlightPin(null);}}>
            <div id={`pin-${i}`} className={pindex === `pin-${i}` ? 'img-overlay on': 'img-overlay'}>
              <div className="action-button">
                <img src="./images/pin.png" alt="action button" className="pin"/>
                <div className='action-button-text' onClick={this.savePin}>Save</div>
              </div>
              <div className="share-button"></div>
              <div className="userProfileImgWrapper" onClick={this.handleUserProfileImgClick}>
                <img data-username={img.username ? img.username : ''} src={img.profileImg ? img.profileImg : './images/default-profile-image.png'} alt="user profile"/>
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
