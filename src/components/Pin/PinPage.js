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
  };

  state = {
    comment: '',
    pinID: null,
  };

  componentWillMoun() {
    console.log('PinPage will mount!');
    // fetch('/shared-pin', {
    //   method: 'GET',
    //   credentials: 'include',
    // })
    //   .then(res => res.json())
    //   .then(pin => this.setState({ pin }))
    //   .catch(err => console.log(err));

  }

  handleCommentInputChange = e => {
    this.setState({ comment: e.target.value });
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
      body: JSON.stringify({ pin: JSON.stringify(this.props.imgs.magnifiedPin) }),
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
    const { imgs } = this.props;
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
              {/* {poll ? poll.comments.map((comment, i) =>
                  <div key={i} className='comment'>
                      {`${comment[0]}: ${comment[1]}`}
                      <Route path='polls/poll/comment/posted' render={() => <div></div>}/>
                  </div>
              ) : ''} */}
              <div className="comment-section-title-wrapper"><h2>Comments</h2></div>
              <div className='comment-form-container'>
                  <label htmlFor='comment'>
                    Share feedback, ask a question or give a high five
                  </label>
                  <textarea className='comment-box' name='comment' onChange={this.handleCommentInputChange} value={this.state.comment} defaultValue='add comment' onKeyDown={e => e.key === 'Enter' ? this.handleShareOrCommentButtonClick(e) : ''}>
                  </textarea>
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
  state => ({ imgs: state.imgs }),
  {
    storeMagnifiedPinInfo,
  }
)(PinPage);
export default PinPageContainer;
