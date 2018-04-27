import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

class Header extends React.Component {
    state = {
        input: '',
        page: 1
    }

    searchImg = e => {
        console.log('page:', this.state.page);
        const { input, page, iamges } = this.state;
        const { storeImgs, concatImgsToStore } = this.props;
        console.log('keyDown:',e.key);

        const q = input.trim().replace(/\s/g, '%20');
        if (e.key === 'Enter') {
            this.props.history.push(`/search?term=${q}`)
            fetch(`/pics?q=${q}&page=${page}`, {credentials: 'include'})
            .then(res => res.json())
            .then(imgs => {
                if (e.scroll) {
                    concatImgsToStore(imgs);
                } else {
                    storeImgs(imgs);
                }
                // console.log(imgs);
            })
            .catch(err => console.log(err));
        }
        console.log(this.props.imgs.search);
    }
    handleInput = e => this.setState({ input: e.target.value });

    componentWillMount() {
        console.log('Header will mount');

    }
    componentDidMount() {
        console.log('Header did mount');
        console.log(document.documentElement.scrollHeight);
        // let pageYOffset = 0;
        document.addEventListener('scroll', () => {

            console.log('pageYOffset:',window.pageYOffset, '+ ','window.innerHeight:',window.innerHeight, '=',window.pageYOffset + window.innerHeight)
            // console.log('window.innerHeight:', window.innerHeight);

            console.log('document scrollHeight - 200:',document.documentElement.scrollHeight - 200);
            // if (pageYOffset - window.pageYOffset > )
            if (window.pageYOffset + window.innerHeight > document.documentElement.scrollHeight - 200 && this.state.input && ifpageYOffset - ) {
                console.log('lazy-loading triggered');
                this.setState(prevState => ({ page: prevState.page += 1 }));
                this.searchImg({ key: 'Enter', scroll: true });
            }
        })
        // if (window.pageYOffset + window.innerHeight > document.documentElement.scrollHeight - 100 && this.state.input) {
        //     console.log('lazy-loading triggered');
        //     this.setState(prevState => ({ page: prevState.page++ }));
        //     this.searchImg({ key: 'Enter', scroll: true });
        // }
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
                <Link className="link" to='/'>
                    <div className="home">Home</div>
                </Link>

                <Link className='link' to='/user'>
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
