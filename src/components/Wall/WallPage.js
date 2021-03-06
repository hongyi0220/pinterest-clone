import React from 'react';
import PropTypes from 'prop-types';

class WallPage extends React.Component {
  static propTypes = {
    storeImgs: PropTypes.func.isRequired,
    account: PropTypes.object.isRequired,
    ui: PropTypes.object.isRequired,
    imgs: PropTypes.shape({
      topTags: PropTypes.array,
      search: PropTypes.array,
      magnifiedPin: PropTypes.shape({ tags: PropTypes.array, }),
      searchKeywords: PropTypes.array,
     }).isRequired,
    logInUser: PropTypes.func.isRequired,
    history: PropTypes.shape({
      push: PropTypes.func,
      location: PropTypes.shape({
        pathname: PropTypes.string,
      }),
    }),
    storeOtherUserInfo: PropTypes.func.isRequired,
    storeMagnifiedPinInfo: PropTypes.func.isRequired,
    concatImgsToStore: PropTypes.func.isRequired,
    storeSearchKeywords: PropTypes.func.isRequired,
    toggleMsgModal: PropTypes.func.isRequired,
    concatToUserPins: PropTypes.func.isRequired,
  };
  state = {
    pindex: null,
    clientHeight: null,
    clientWidth: null,
  };

  componentWillMount() {
    this.setState({ clientWidth: window.innerWidth, clientHeight: window.innerHeight });
    if (this.props.history.location.pathname.includes('/pin')) {
      const q = this.props.imgs.searchKeywords[0];

      fetch(`/pics?q=${q}&page=${1}`, {
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

  handlePinOnMouseOver = (e = null) => {

    const eTarget = e ? e.target : null;
    if (e === null) {
      return this.setState({ pindex: null });
    }
    if (this.state.pindex !== Number(eTarget.dataset.pindex)) {
      this.setState({
          pindex: Number(eTarget.dataset.pindex),
      });
    }
  }

  handleSaveButtonClick = e => {
    e.stopPropagation();
    fetch(`/pin?pindex=${this.state.pindex}`, {
      method: 'GET',
      credentials: 'include',
    })
      .then(res => res.json())
      .then(resJson => {
        this.props.concatToUserPins(resJson.pin);
      })
      .catch(err => {
        this.props.toggleMsgModal({ title: 'Error', msg: 'Something went wrong :(' });
      });
  }

  handleMagnifyPinClick = (goToPinPage = true) => {
    this.props.storeMagnifiedPinInfo(this.props.imgs.search[this.state.pindex]);

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
        if (goToPinPage) {
          window.scroll({
            top: 0,
            behavior: 'instant'
          });
          // this.props.storeSearchKeywords([this.props.imgs.magnifiedPin.tags[0]]);
          this.props.history.push(`/pin/${resJson.pinId}`);
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
          <div data-pindex={i} key={i} className={`img-container ${img.height > 480 ? 'tall' : ''}`} onMouseEnter={this.handlePinOnMouseOver} onMouseLeave={() => this.handlePinOnMouseOver()} onMouseOver={this.handlePinOnMouseOver}>

            <div data-pindex={i} className={this.state.pindex === i ? 'img-overlay on': 'img-overlay'} onClick={e => {e.stopPropagation(); this.handleMagnifyPinClick(e);}}>

              <div className="action-button" onMouseOver={e => e.stopPropagation()}>
                <img src="/images/pin.png" alt="action button" className="pin"/>
                <div className='action-button-text' onClick={this.handleSaveButtonClick}>Save</div>
              </div>

              <div className="share-button" onMouseOver={e => e.stopPropagation()} onClick={this.handleShareButtonClick}>
                <img src="/images/tweet.png" alt="tweet"/>
              </div>

            </div>

            <img className='wall-img' src={img.src} onError={e => e.target.src = '/images/default-no-img.jpg'}/>
          </div>)
          : [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,].map((_, i) => <div key={i} className={i % 4 === 0 ? 'img-container tall placeholder' : 'img-container placeholder'}></div>)
        }
        </div>
        <div className="loading-icon-wrapper">
          <div className={ui.loadingSpinner ? 'loading-icon on' : 'loading-icon'} >
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
