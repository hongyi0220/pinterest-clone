import React from 'react';
import {
  Route,
} from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  storeMagnifiedPinInfo,
  storeImgs,
  storeSearchKeywords,
  storeOtherUserInfo,
  concatToUserPins,
} from '../../actions';
import WallPageContainer from '../Wall/WallPageContainer';

class PinPage extends React.Component {
  static propTypes = {
    imgs: PropTypes.shape({
      magnifiedPin: PropTypes.shape({
        comments: PropTypes.array,
        tags: PropTypes.array,
        users: PropTypes.array,
      }),
      curatedPins: PropTypes.array,
    }).isRequired,
    account: PropTypes.shape({
      user: PropTypes.shape({ username: PropTypes.string, })
    }).isRequired,
    history: PropTypes.shape({
      location: PropTypes.shape({
        pathname: PropTypes.string
      }),
      push: PropTypes.func,
    }).isRequired,
    storeImgs: PropTypes.func.isRequired,
    storeSearchKeywords: PropTypes.func.isRequired,
    storeOtherUserInfo: PropTypes.func.isRequired,
    concatToUserPins: PropTypes.func.isRequired,
  };

  state = {
    comments: null,
    comment: '',
    pinId: null,
    clientHeight: null,
    clientWidth: null,
  };

  pinUserProfileImg = null;

  componentWillMount() {
    console.log('PinPage will mount!');
    this.props.storeSearchKeywords([this.props.imgs.magnifiedPin.tags[0]]);
    this.setState({
      clientWidth: window.innerWidth,
      clientHeight: window.innerHeight,
      comments: this.props.imgs.magnifiedPin ? this.props.imgs.magnifiedPin.comments : [],
      pinId: this.props.history.location.pathname.split('pin/')[1],
    });
  }

  componentDidMount() {
    console.log('PinPage DID mount!');
    this.getUserProfileImg('/image/default-profile-image.png' && this.props.imgs.magnifiedPin.users[0])
      .then(profileImg => {
        console.log('this.pinUserProfileImg:',this.pinUserProfileImg);
        console.log('profileImg:',profileImg);
        this.pinUserProfileImg.src = profileImg;
        console.log('pinUserProfileImg after setting src:',this.pinUserProfileImg);
      })
      .catch(err => console.log(err));
  }

  handleCommentInputChange = e => {
    const eTarget = e.target;
    this.setState({ comment: eTarget.value });
  }

  handleSaveButtonClick = () => {
    fetch('/pin?magnified=true', {
      method: 'GET',
      credentials: 'include',
    })
      .then(res => res.json())
      .then(resJson => {
        console.log('PIN after saving:',resJson);
        this.props.concatToUserPins(resJson.pin);
      })
      .catch(err => console.log(err));
  }

  handleShareButtonClick = () => {
    // console.log(this.props.history);
    window.open(`https://twitter.com/intent/tweet?via=pinterest-clone&text=${`http://localhost:3000${this.props.history.location.pathname}`}`, '', `top=${(this.state.clientHeight / 2) - (200 / 2)},left=${(this.state.clientWidth / 2) - (300 / 2)},height=200,width=300`);
  }

  handleCommentOnKeyDown = e => {
    console.log('handleCommentKeyDown triggered!');

    if (e.key === 'Enter') {
      this.setState(prevState => ({
        ...prevState,
        comments: [...prevState.comments, [this.props.account.user.username, prevState.comment]],
        comment: '',
      }), () => {
        fetch('/pin', {
          method: 'PUT',
          credentials: 'include',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify({ comments: this.state.comments }),
        })
          .catch(err => console.log(err));
      });
    }
  }

  handleHomeButtonClick = () => {
    // this.props.storeSearchKeywords([]);
    this.props.history.push('/home');
    this.props.storeImgs(this.props.imgs.curatedPins);
  }

  getUserProfileImg = username => {
    // const username = e.target.dataset.username;
    console.log('username at getUserProfileImg:',username);
    return fetch(`/user/${username}?externalapi=false`, {
      method: 'GET',
      credentials: 'include',
    })
      .then(res => {
        console.log('res:',res);
        return res.json();
      })
      .then(otherUser => {
        console.log('otherUser:', otherUser);
        return otherUser.profileImg;
      })
      .catch(err => console.log(err));
  }

  handlePinUserImgClick = e => {
    e.stopPropagation();
    console.log('handle User Profile Img Clicked:',e.target.dataset.username);
    const username = this.props.imgs.magnifiedPin.users[0];
    fetch(`/user/${username}?externalapi=false`, {
      method: 'GET',
      credentials: 'include',
    })
      .then(res => res.json())
      .then(otherUser => {
        console.log('res from /user:', otherUser);

        this.props.storeOtherUserInfo(otherUser);
        this.props.history.push(`/user/${otherUser.username}`);
      })
      .catch(err => console.log(err));
  }

  render() {
    const { imgs, } = this.props;
    const { comments, } = this.state;

    console.log('searchKeywords[0]:',imgs.magnifiedPin ? imgs.magnifiedPin.tags[0] : '');
    return (
      <div className="pin-page-background">
        <div className="pin-page-container">
          <div className="pin-header">
            <div className="button home-button-container" onClick={this.handleHomeButtonClick}>
              <div className="home-button-text-wrapper">
                Home
              </div>
            </div>
            <div className="button share-button-container" onClick={this.handleShareButtonClick}>
              <div className="share-button-text-wrapper">
                Share
              </div>
            </div>
            <div className="button save-button-container" onClick={this.handleSaveButtonClick}>
              <div className="save-button-text-wrapper">
                Save
              </div>
            </div>
          </div>
          <div className="pin-container">
            <div className="img-wrapper">
              <img src={imgs.magnifiedPin ? imgs.magnifiedPin.src : ''} alt={`a pic of ${imgs.magnifiedPin ? imgs.magnifiedPin.tags[0] : ''}`}/>
            </div>
            <div className='comments-container'>

              <div className="comment-form-title-wrapper"><h2>Comments</h2></div>
              <div className='comment-form-container'>
                {comments.length ?
                  comments.map((cmt, i) =>
                    <div key={i} className='comment-wrapper'>
                      {`${cmt[0]}: ${cmt[1]}`}
                    </div>
                  ) :
                  <label htmlFor='comment'>
                    Share feedback, ask a question or give a high five
                  </label>
                }

                  <textarea name='comment' onChange={this.handleCommentInputChange} value={this.state.comment} placeholder='add comment' onKeyDown={this.handleCommentOnKeyDown}>
                  </textarea>
              </div>
              <hr />
              <div className="pin-owner-info-container">
                {imgs.magnifiedPin ?
                  (imgs.magnifiedPin.users.length ?
                    (<div className="username-container" onClick={this.handlePinUserImgClick}>
                      {/* <img data-username={imgs.magnifiedPin.users[0]} src={e => this.getUserProfileImg(e)} alt='pin user' onError={e => e.target.src = '/image/default-profile-image.png'}/> */}
                      <img /*data-username={imgs.magnifiedPin.users[0]}*/ src='' alt='pin user' onError={e => e.target.src = '/image/default-profile-image.png'} ref={el => this.pinUserProfileImg = el} />
                      <div className="username-wrapper">
                        {imgs.magnifiedPin.users[0]}
                      </div>
                      <div className="misc-info-wrapper" onClick={e => e.stopPropagation()}>
                        {` and ${imgs.magnifiedPin.users.length - 1} others saved this Pin`}
                      </div>
                    </div>
                    ) : 'No user info to display'
                  ) : ''
                }
              </div>
            </div>
          </div>
        </div>
        <div className="more-like-this-text-wrapper">
          <h3>More Like this</h3>
        </div>
        <div className="more-like-this-container">
          <Route component={WallPageContainer} />
        </div>
      </div>

    );
  }
}

 const PinPageContainer = connect(
  state => ({ imgs: state.imgs, account: state.account }),
  {
    storeMagnifiedPinInfo,
    storeImgs,
    storeSearchKeywords,
    storeOtherUserInfo,
    concatToUserPins,
  }
)(PinPage);
export default PinPageContainer;
