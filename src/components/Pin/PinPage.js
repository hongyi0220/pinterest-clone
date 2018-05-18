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
    account: PropTypes.shape({ user: PropTypes.shape({ username: PropTypes.string }) }).isRequired,
    history: PropTypes.shape({
      location: PropTypes.shape({
        pathname: PropTypes.string
      }),
      push: PropTypes.func,
    }).isRequired,
  };

  state = {
    comments: null,
    comment: '',
    pinId: null,
    clientHeight: null,
    clientWidth: null,
  };

  componentWillMount() {
    console.log('PinPage will mount!');
    this.setState({
      clientWidth: window.innerWidth,
      clientHeight: window.innerHeight,
      comments: this.props.imgs.magnifiedPin ? this.props.imgs.magnifiedPin.comments : [],
      pinId: this.props.history.location.pathname.split('pin/')[1],
    });
  }

  handleCommentInputChange = e => {
    // const { comments } = this.state;
    // comments.push(e.target.value);
    const eTarget = e.target;
    this.setState({ comment: eTarget.value });

    // const eTarget = e.target.value;
    // this.setState(prevState =>
    //   ({ comments: [...prevState.comments, eTarget.value] })
    // );
  }

  handleSaveButtonClick = () => {
    fetch('/pin?magnified=true', {
      method: 'GET',
      credentials: 'include',
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

  handleHomeButtonClick = () => this.props.history.push('/home');

  render() {
    const { imgs, } = this.props;
    const { comments, } = this.state;
    console.log('similarPicsKeyword:',imgs.magnifiedPin ? imgs.magnifiedPin.tags[0] : '');
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
              <img src={imgs.magnifiedPin ? imgs.magnifiedPin.src : ''} alt={`a pic of ${imgs.magnifiedPin ? imgs.magnifiedPin.tags : ''}.join(',')`}/>
            </div>
            <div className='comments-container'>

              <div className="comment-form-title-wrapper"><h2>Comments</h2></div>
              <div className='comment-form-container'>
                {comments.length ? comments.map((cmt, i) =>
                    <div key={i} className='comment-wrapper'>
                        {`${cmt[0]}: ${cmt[1]}`}
                    </div>
                ) : <label htmlFor='comment'>
                  Share feedback, ask a question or give a high five
                </label>}

                  <textarea name='comment' onChange={this.handleCommentInputChange} value={this.state.comment} placeholder='add comment' onKeyDown={this.handleCommentOnKeyDown}>
                  </textarea>
              </div>
              <hr />
              <div className="pin-owner-info-container">
                <img src={imgs.magnifiedPin ? imgs.magnifiedPin.profileImg : '/images/default-profile-image.png'} alt='user profile'/>
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
