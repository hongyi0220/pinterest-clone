import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

class Header extends React.Component {
  static propTypes = {
    toggleLoadingSpinner: PropTypes.func.isRequired,
    storeImgs: PropTypes.func.isRequired,
    concatImgsToStore: PropTypes.func.isRequired,
    history: PropTypes.shape({
      push: PropTypes.func,
      location: PropTypes.shape({
        pathname: PropTypes.string
      })
    }).isRequired,
    imgs: PropTypes.shape({
      searchKeywords: PropTypes.array,
      search: PropTypes.array,
      topTags: PropTypes.array,
      magnifiedPin: PropTypes.shape({
        tags: PropTypes.array,
      }),
      curatedPins: PropTypes.array,
    }).isRequired,
    ui: PropTypes.shape({ loadingSpinner: PropTypes.bool }).isRequired,
    account: PropTypes.shape({ }).isRequired,
    toggleHeaderMenu: PropTypes.func.isRequired,
    storeOtherUserInfo: PropTypes.func.isRequired,
    storeSearchKeywords: PropTypes.func.isRequired,
    atPinPage: PropTypes.bool,
    storeCuratedPins: PropTypes.func.isRequired,
  };

  state = {
    page: 1,
    pageYOffset: 0,
    fetching: false,
  };

  headerInput = null;

  componentWillMount() {

    const pathname = this.props.history.location.pathname;

    if (pathname === '/' || pathname === '/home') {
      this.props.storeSearchKeywords(this.props.imgs.topTags);
      if (this.props.imgs.search) {
        this.padCuratedWall();
      }
    }

  }

  componentDidMount() {
    this.lazyLoadPics();
  }

  padCuratedWall = () => {
    if (this.props.imgs.search.length < 20) {
      this.searchImg({ key: 'Enter', }, true)
        .then(curatedPins => this.props.storeCuratedPins(curatedPins));
    }
  }

  searchImg = (e, scroll = false) => {
    const pathname = this.props.history.location.pathname;
    if (e.key === 'Enter') {
      this.props.toggleLoadingSpinner();
      this.setState({ fetching: true });
      let page = this.props.imgs.searchKeywords.length === 1 ? this.state.page : this.state.page + 1;
      if (!scroll) {
        this.setState({ pageYOffset: 0 });
        page = 1;
        window.scroll({
          top: 0,
          behavior: 'instant'
        });
      }

      if (this.props.imgs.searchKeywords.length === 1 && !pathname.includes('/pin')) {
        this.props.history.push(`/search?q=${this.props.imgs.searchKeywords[0]}&page=${this.state.page}`);
      }

      return fetch(`/pics?q=${this.props.imgs.searchKeywords.join('&&')}&page=${page}`, {
        method: 'GET',
        credentials: 'include',
      })
        .then(res => res.json())
        .then(imgs => {
          this.props.storeImgs(imgs);
          this.props.toggleLoadingSpinner();
          this.setState({ fetching: false });
          return imgs;
        })
        .catch(err => console.log(err));
    }
  }

  handleInputChange = e => this.props.storeSearchKeywords([e.target.value]);

  handleHomeButtonClick = () => {
    this.headerInput.value = '';
    window.scroll({
      top: 0,
      behavior: 'instant',
    });
    this.props.storeImgs(this.props.imgs.curatedPins);
    fetch('/session', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({ imgs: this.props.imgs.curatedPins }),
    })
      .catch(err => console.log(err));
    this.props.storeSearchKeywords(this.props.imgs.topTags);
  }


  lazyLoadPics = () => {
    let pageYOffset = 0;

    document.addEventListener('scroll', () => {
      const pathname = this.props.history.location.pathname;
      if (window.pageYOffset > this.state.pageYOffset) {
        this.setState({ pageYOffset: window.pageYOffset });
        // pageYOffset = window.pageYOffset;
      }
      if (window.pageYOffset + window.innerHeight >= document.documentElement.scrollHeight - 100 && this.props.imgs.searchKeywords && (window.pageYOffset >= pageYOffset) && !this.props.ui.loadingSpinner && !this.state.fetching && !pathname.includes('/user') && !pathname.includes('/find')) {
        this.setState(prevState => ({ page: prevState.page += 1 }));
        this.searchImg({ key: 'Enter', }, true);
      }
    });
  }

  toggleHeaderMenu = e => {
    e.stopPropagation();
    window.scroll({
      top: 0,
      behavior: 'instant',
    });
    this.props.toggleHeaderMenu();
  }

  render() {
    const { account, imgs, atPinPage } = this.props;
    return (
      <div className={atPinPage ? 'header-container invisible' : 'header-container'}>
        <Link className='header-menu-item logo' to='/' onClick={this.handleHomeButtonClick}>
          <img className='logo' src="/images/pinterest_logo.png"/>
        </Link>

        <input className='search' type='text' placeholder='Search' onKeyDown={this.searchImg} onChange={this.handleInputChange} value={imgs.searchkeywords && (imgs.searchKeywords.length > 1 ? '' : imgs.searchKeywords[0])} ref={e => this.headerInput = e}/>

        <div className='header-menu-item options right' onClick={this.toggleHeaderMenu}>
          <svg>
            {[...'ccc'].map((c, i) => <circle key={i} cx={12 + (i * 8)}/>)}
          </svg>
        </div>

        <Link className='header-menu-item user right' to={`/user/${account.user.username}`} onClick={() => {this.props.storeOtherUserInfo(null);} }>
          <div className='username-wrapper'>
            {account.user.username}
          </div>
        </Link>

        <Link className='header-menu-item home right' to='/home' onClick={this.handleHomeButtonClick}>
          <div className="home-button-text-wrapper">Home</div>
        </Link>
      </div>
    );
  }
}
export default Header;
