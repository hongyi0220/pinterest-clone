import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

class Header extends React.Component {
    state = {
        // apiKey: null,
        input: '',
        page: 1,
        // images: null
    }

    searchImage = e => {
        const { input, page, iamges } = this.state;
        const { storeImages } = this.props;
        console.log('keyDown:',e.key);

        const q = input.trim().replace(/\s/g, '%20');
        if (e.key === 'Enter') {
            this.props.history.push(`/search?term=${q}`)
            fetch(`/images?q=${q}&page=${page}`, {credentials: 'include'})
            .then(res => res.json())
            .then(images => {
                storeImages(images);
                console.log();
            })
            .catch(err => console.log(err));
        }
    }
    handleInput = e => this.setState({ input: e.target.value });

    render() {
        const { input } = this.state;
        const { account, toggleHeaderMenu } = this.props;
        return (
            <div className="header">
                <Link className="link" to='/'>
                    <img src="./images/pinterest_logo.png"/>
                </Link>
                <input type="text" placeholder='Search' onKeyDown={this.searchImage} onChange={this.handleInput} value={input}/>
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
