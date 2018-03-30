import React from 'react';
import PropTypes from 'prop-types';

class WallPage extends React.Component {
    state = {
        keys: null,
        input: '',
        images: null
    }

    searchImage = e => {
        console.log('keyDown:',e.key);
        const { googleApiKey, cseId } = this.state.keys;
        const query = this.state.input;
        if (e.key === 'Enter') {
            fetch(`https://www.googleapis.com/customsearch/v1?key=${googleApiKey}&cx=${cseId}&searchType=image&q=${query}`)
            .then(res => res.json())
            .then(images => console.log('images:',images))
            .catch(err => console.log(err));
        }
    }
    getKeys = () => {
        return fetch('http://localhost:3000/env_keys')
               .then(res => res.json())
               .catch(err => console.log(err));
    }
    handleInput = e => this.setState({ input: e.target.value });
    componentWillMount() {
        this.getKeys()
            .then(keys => this.setState({ keys: keys }, () => console.log(this.state)))
            .catch(err => console.log(err));
    }
    render() {
        const { account } = this.props;
        const { input } = this.state;

        return (
            <div className='wall-container'>
                <div className="header">
                    <img src="./images/pinterest_logo.png"/>
                    <input type="text" placeholder='Search' onKeyDown={this.searchImage} onChange={this.handleInput} value={input}/>
                    <div className="home">home</div>
                    <div className="user">
                        {account.user.email.split('@')[0]}
                    </div>
                    <div className="options">
                        <svg>
                            {[...'ccc'].map((c, i) => <circle key={i} cx={12 + (i * 8)}/>)}
                        </svg>
                    </div>
                </div>
                <div className="wall">

                </div>
            </div>
        );
    }
}

export default WallPage;
