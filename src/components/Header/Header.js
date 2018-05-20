import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

class Header extends React.Component {
  static propTypes = {
    toggleFetchingPics: PropTypes.func.isRequired,
    storeImgs: PropTypes.func.isRequired,
    concatImgsToStore: PropTypes.func.isRequired,
    history: PropTypes.shape({ push: history.push }).isRequired,
    imgs: PropTypes.shape({ search: PropTypes.array, topTags: PropTypes.array }).isRequired,
    ui: PropTypes.shape({ fetchingPics: PropTypes.bool }).isRequired,
    account: PropTypes.shape({ }).isRequired,
    toggleHeaderMenu: PropTypes.func.isRequired,
    storeOtherUserInfo: PropTypes.func.isRequired,
    input: PropTypes.bool,
    curateWall: PropTypes.func.isRequired,
  };

  state = {
    input: this.props.imgs.topTags || '',
    page: 1,
    pageYOffset: 0,
    // queries: this.props.imgs.topTags,
  };

  componentWillMount() {
    console.log('Header will mount');
    console.log('this.state:',this.state);
    this.padCuratedWall();
  }

  componentDidMount() {
    console.log('Header did mount');
    this.lazyLoadPics();
  }

  padCuratedWall = () => {
    if (this.props.imgs.search.length < 20) {
      console.log('this.props.imgs.search.length < 20:', this.props.imgs.search.length < 20,'getting more pics to append to wall');
      this.searchImg({ key: 'Enter', scroll: true, queries: this.props.imgs.topTags });
    }
  }

  searchImg = e => {
    console.log('page:', this.state.page);
    console.log('keyDown:',e.key);
    if (e.key === 'Enter') {
      this.props.toggleFetchingPics();
      if (!e.scroll) {
        this.setState({ page: 1, pageYOffset: 0 });
        window.scroll({
          top: 0,
          behavior: 'instant'
        });
      }

      if (this.state.input.length === 1) {
        this.props.history.push(`/search?q=${this.state.input[0]}&page=${this.state.page}`);
      }
      if (e.queries) {
        console.log('e.queries:',e.queries);
        this.setState({ input: e.queries });
      }

      this.state.input.forEach(word => {
        fetch(`/pics?q=${word}&page=${this.state.input.length === 1 ? this.state.page : this.state.page + 1}`, {
          method: 'GET',
          credentials: 'include',
        })
          .then(res => res.json())
          .then(imgs => {
            if (e.scroll || this.state.input.length > 1) {
              console.log('CONCATING IMGS TO STORE');
              this.props.concatImgsToStore(imgs);
            } else {
              console.log('REPLACING IMGS IN STORE');
              this.props.storeImgs(imgs);
            }
            // this.props.storeImgs(imgs);
            // this.props.concatImgsToStore(imgs);
            this.props.toggleFetchingPics();
            console.log('state after fetchingPics:',this.state);
          })
          .catch(err => console.log(err));
      });
    }
  }

  handleInput = e => this.setState({ input: [e.target.value] });

  lazyLoadPics = () => {
    let pageYOffset = 0;
    document.addEventListener('scroll', () => {
      if (window.pageYOffset > this.state.pageYOffset) {
        this.setState({ pageYOffset: window.pageYOffset });
        // pageYOffset = window.pageYOffset;
      }
      console.log('pageYOffset:', pageYOffset);
      console.log('pageYOffset:',window.pageYOffset, '+ ','window.innerHeight:',window.innerHeight, '=',window.pageYOffset + window.innerHeight);
      // console.log('window.innerHeight:', window.innerHeight);

      console.log('document scrollHeight - 100:',document.documentElement.scrollHeight - 100);

      if (window.pageYOffset + window.innerHeight >= document.documentElement.scrollHeight - 100 && this.state.input && window.pageYOffset >= pageYOffset && !this.props.ui.fetchingPics) {
        // this.setState({ fetchingPics: true });
        console.log('lazy-loading triggered');
        this.setState(prevState => ({ page: prevState.page += 1 }));
        // this.setState({ fetchingPics: true });
        this.searchImg({ key: 'Enter', scroll: true });
      }
    });
  }

  render() {
    const { input } = this.state;
    const { account, toggleHeaderMenu } = this.props;
    return (
      <div className="header">
        <Link className="link" to='/' onClick={() => {this.props.curateWall().then(() => this.padCuratedWall()).catch(err => console.log(err)); }}>
          <img src="/images/pinterest_logo.png"/>
        </Link>

        <input type="text" placeholder='Search' onKeyDown={this.searchImg} onChange={this.handleInput} value={input.length > 1 ? '' : input[0]}/>

        <Link className="link" to='/home' onClick={() => {this.props.curateWall().then(() => this.padCuratedWall()).catch(err => console.log(err)); }}>
          <div className="home">Home</div>
        </Link>

        <Link className='link' to={`/user/${account.user.username}`} onClick={() => {this.setState({ input: '' }); this.props.storeOtherUserInfo(null);} }>
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
