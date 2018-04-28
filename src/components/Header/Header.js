import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

class Header extends React.Component {
    state = {
        input: '',
        page: 1,
        // fetchingPics: false,
        pageYOffset: 0
    };
    static propTypes = {
        toggleFetchingPics: PropTypes.func.isRequired
    };

    searchImg = e => {
        // this.setState({ fetchingPics: true });
        // this.props.toggleFetchingPics();
        console.log('page:', this.state.page);
        const { input, page } = this.state;
        const { storeImgs, concatImgsToStore } = this.props;
        console.log('keyDown:',e.key);
        if (!e.scroll) {
            this.setState({ page: 1, pageYOffset: 0 });
            window.scroll({
                top: 0,
                behavior: 'instant'
            });
        }
        const q = input.trim().replace(/\s/g, '%20');
        if (e.key === 'Enter') {
            this.props.toggleFetchingPics();
            this.props.history.push(`/search?term=${q}`)
            fetch(`/pics?q=${q}&page=${page}`, {credentials: 'include'})
            .then(res => res.json())
            .then(imgs => {
                if (e.scroll) {
                    concatImgsToStore(imgs);
                } else {
                    storeImgs(imgs);
                }
                // this.setState({ fetchingPics: false });
                this.props.toggleFetchingPics();
                console.log('state after fetchingPics:',this.state);
            })
            .catch(err => console.log(err));
        }
        console.log(this.props.imgs.search);
    }
    handleInput = e => this.setState({ input: e.target.value });

    lazyLoadPics = () => {
        let pageYOffset = 0;
        document.addEventListener('scroll', () => {
            if (window.pageYOffset > this.state.pageYOffset) {
                this.setState({ pageYOffset: window.pageYOffset });
                // pageYOffset = window.pageYOffset;
            }
            console.log('pageYOffset:', pageYOffset);
            console.log('pageYOffset:',window.pageYOffset, '+ ','window.innerHeight:',window.innerHeight, '=',window.pageYOffset + window.innerHeight)
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

    componentWillMount() {
        console.log('Header will mount');

    }
    componentDidMount() {
        console.log('Header did mount');
        this.lazyLoadPics();
    }
    render() {
        const { input } = this.state;
        const { account, toggleHeaderMenu } = this.props;
        return (
            <div className="header">
                <Link className="link" to='/'>
                    <img src="./images/pinterest_logo.png"/>
                </Link>
                <input type="text" placeholder='Search' onKeyDown={this.searchImg} onChange={this.handleInput} value={input}/>
                <Link className="link" to='/home'>
                    <div className="home">Home</div>
                </Link>

                <Link className='link' to='/user' onClick={() => this.setState({ input: '' })}>
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
