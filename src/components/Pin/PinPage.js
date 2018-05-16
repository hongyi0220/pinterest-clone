import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  storeMagnifiedPinInfo,
} from '../../actions';
import WallPageContainer from '../Wall/WallPageContainer';

class PinPage extends React.Component {
  static propTypes = {
    imgs: PropTypes.shape({ magnifiedPin: {} }).isRequired,
    account: PropTypes.shape({ }).isRequired,
  };

  state = {
    comments: [],
    comment: '',
    pinID: null,
    clientHeight: null,
    clientWidth: null,
  };

  componentWillMount() {
    console.log('PinPage will mount!');
    this.setState({
      clientWidth: window.innerWidth,
      clientHeight: window.innerHeight,
      comments: this.props.imgs.magnifiedPin.comments || [],
    });
  }

  handleCommentInputChange = e => {
    // const { comments } = this.state;
    // comments.push(e.target.value);
    this.setState({ comment: e.target.value });

    // const eTarget = e.target.value;
    // this.setState(prevState =>
    //   ({ comments: [...prevState.comments, eTarget.value] })
    // );
  }

  handleSaveButtonClick = () => {
    fetch('/pin?save=true', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({ pin: JSON.stringify(this.props.imgs.magnifiedPin) }),
    })
      .catch(err => console.log(err));
  }

  handleShareOrCommentButtonClick = () => {
    console.log('handleShareOrCommentButtonClick triggered!');
    // console.log('e:', e);
    console.log('keyboard key ENTER or mouseclick detected');
    console.log('magnifiedPin:', this.props.imgs.magnifiedPin);
    // const body = JSON.stringify(this.props.imgs.magnifiedPin);
    fetch('/pin?save=false', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        pin: JSON.stringify(this.props.imgs.magnifiedPin),
        comments: this.state.comments,
      }),
    })
      .then(res => res.json())
      .then(resJson => {
        console.log('pinID from res:', resJson.pinID);
        this.setState({ pinID: resJson.pinID });
      })
      .then(() => {
        window.open(`https://twitter.com/intent/tweet?via=pinterest-clone&text=${`http://localhost:3000/pin/${this.state.pinID}`}`, '', `top=${(this.state.clientHeight / 2) - (200 / 2)},left=${(this.state.clientWidth / 2) - (300 / 2)},height=200,width=300`);
      })
      .catch(err => console.log(err));
  }

  render() {
    const { imgs, account, } = this.props;
    const { comments, } = this.state;
    console.log('similarPicsKeyword:',imgs.magnifiedPin ? imgs.magnifiedPin.tags[0] : '');
    return (
      <div className="pin-page-background">
        <div className="pin-page-container">
          <div className="pin-header">
            <div className="button home-button-container">
              <div className="home-button-text-wrapper">
                Home
              </div>
            </div>
            <div className="button share-button-container" onClick={this.handleShareOrCommentButtonClick}>
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
              <img src={imgs.magnifiedPin ? imgs.magnifiedPin.src : ''} alt={`a pic of ${imgs.magnifiedPin ? imgs.magnifiedPin.tags : ''}.join(',')`}/>
            </div>
            <div className='comments-container'>
              {comments ? comments.map((cmt, i) =>
                  <div key={i} className='comment'>
                      {`${account.user.username}: ${cmt}`}
                  </div>
              ) : ''}
              <div className="comment-section-title-wrapper"><h2>Comments</h2></div>
              <div className='comment-form-container'>
                  <label htmlFor='comment'>
                    Share feedback, ask a question or give a high five
                  </label>
                  <textarea className='comment-box' name='comment' onChange={this.handleCommentInputChange} value={this.state.comment} placeholder='add comment' onKeyDown={e => e.key === 'Enter' ? this.handleShareOrCommentButtonClick(e) : ''}>
                  </textarea>
              </div>
              <hr />
              <div className="pin-owner-info-container">
                <img src={imgs.magnifiedPin.profileImg ? imgs.magnifiedPin.profileImg : '/images/default-profile-image.png'} alt='user profile'/>
                <span>saved this Pin</span>
              </div>
            </div>

          </div>

        </div>
        <div className="more-like-this-text-wrapper">
          <h3>More Like this</h3>
        </div>
        <div className="more-like-this-container">

          <WallPageContainer similarPicsKeyword={imgs.magnifiedPin ? imgs.magnifiedPin.tags[0] : ''} />
        </div>

      </div>

    );
  }
}

 const PinPageContainer = connect(
  state => ({ imgs: state.imgs, account: state.account }),
  {
    storeMagnifiedPinInfo,
  }
)(PinPage);
export default PinPageContainer;
