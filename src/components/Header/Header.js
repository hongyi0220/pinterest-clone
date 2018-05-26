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

  componentWillMount() {
    console.log('Header will mount');
    // console.log('Header component state at compWllMnt:', this.state);

    const pathname = this.props.history.location.pathname;

    if (pathname === '/' || pathname === '/home') {

      this.props.storeSearchKeywords(this.props.imgs.topTags);
      if (this.props.imgs.search.length < 20) {
        console.log('this.props.imgs.search.length < 20:', this.props.imgs.search.length < 20,'getting more pics to append to wall');
        this.searchImg({ key: 'Enter', scroll: true,})
          .then(curatedPins => this.props.storeCuratedPins(curatedPins));

        console.log('imgs.curatedPins:',this.props.imgs.curatedPins);
      }
    }

  }

  componentDidMount() {
    console.log('Header did mount');
    if (this.props.history.location.pathname !== '/find') {
      this.lazyLoadPics();
    }
  }

   searchImg = e => {
    console.log('searchImg triggered!');
    // console.log('page:', this.state.page);
    // console.log('keyDown:',e.key);
    // console.log('searchKeywords:', this.props.imgs.searchKeywords);
    const pathname = this.props.history.location.pathname;
    if (e.key === 'Enter') {
      this.props.toggleLoadingSpinner();
      this.setState({ fetching: true });
      if (!e.scroll) {
        this.setState({ page: 1, pageYOffset: 0 });
        window.scroll({
          top: 0,
          behavior: 'instant'
        });
      }

      if (this.props.imgs.searchKeywords.length === 1 && !pathname.includes('/pin')) {
        this.props.history.push(`/search?q=${this.props.imgs.searchKeywords[0]}&page=${this.state.page}`);
      }

      return fetch(`/pics?q=${this.props.imgs.searchKeywords.join('&&')}&page=${this.props.imgs.searchKeywords.length === 1 ? this.state.page : this.state.page + 1}`, {
        method: 'GET',
        credentials: 'include',
      })
        .then(res => res.json())
        .then(imgs => {
          this.props.storeImgs(imgs);
          this.props.toggleLoadingSpinner();
          this.setState({ fetching: false });
          console.log('got response from fetch');
          return imgs;
        })
        .catch(err => console.log(err));
    }
  }

  handleInputChange = e => this.props.storeSearchKeywords([e.target.value]);

  handleHomeButtonClick = () => this.props.storeImgs(this.props.imgs.curatedPins);


  lazyLoadPics = () => {
    let pageYOffset = 0;
    document.addEventListener('scroll', () => {
      if (window.pageYOffset > this.state.pageYOffset) {
        this.setState({ pageYOffset: window.pageYOffset });
        // pageYOffset = window.pageYOffset;
      }
      console.log('pageYOffset:', this.state.pageYOffset);
      console.log('pageYOffset:',window.pageYOffset, '+ ','window.innerHeight:',window.innerHeight, '=',window.pageYOffset + window.innerHeight);

      console.log('document scrollHeight - 100:',document.documentElement.scrollHeight - 100);

      if (window.pageYOffset + window.innerHeight >= document.documentElement.scrollHeight - 100 && this.props.imgs.searchKeywords && (window.pageYOffset >= pageYOffset) && !this.props.ui.loadingSpinner && !this.state.fetching) {
        console.log('lazy-loading triggered');
        this.setState(prevState => ({ page: prevState.page += 1 }));
        this.searchImg({ key: 'Enter', scroll: true });
      }
    });
  }

  render() {
    // console.log('Header component state at render:', this.state);
    // const { input } = this.state;
    const { account, toggleHeaderMenu, imgs, atPinPage } = this.props;
    return (
      <div className={atPinPage ? 'header invisible' : 'header'}>
        <Link className="link" to='/' onClick={() => {this.props.storeSearchKeywords([]); this.handleHomeButtonClick();}}>
          <img src="/images/pinterest_logo.png"/>
        </Link>

        <input type="text" placeholder='Search' onKeyDown={this.searchImg} onChange={this.handleInputChange} value={imgs.searchKeywords.length > 1 ? '' : imgs.searchKeywords[0]}/>

        <Link className="link" to='/home' onClick={() => {/*this.props.storeSearchKeywords([]);*/ this.handleHomeButtonClick();}}>
          <div className="home-button-text-wrapper">Home</div>
        </Link>

        <Link className='link' to={`/user/${account.user.username}`} onClick={() => {/*this.props.storeSearchKeywords([]);*/ this.props.storeOtherUserInfo(null);} }>
          <div className="user">
            {account.user.username}
          </div>
        </Link>

        <div className="options" onClick={toggleHeaderMenu}>
          <svg>
            {[...'ccc'].map((c, i) => <circle key={i} cx={12 + (i * 8)}/>)}
          </svg>
        </div>
      </div>
    );
  }
}
export default Header;
