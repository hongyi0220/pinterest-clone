import React from 'react';
import PropTypes from 'prop-types';

class WallPage extends React.Component {
    state = {
        // apiKey: null,
        // input: '',
        // images: null,
        // page: 1
    }

    // searchImage = e => {
    //     const { input, page, iamges } = this.state;
    //     console.log('keyDown:',e.key);
    //
    //     const q = input.trim().replace(/\s/g, '%20');
    //     if (e.key === 'Enter') {
    //         fetch(`http://localhost:3000/images?q=${q}&page=${page}`)
    //         .then(res => res.json())
    //         .then(resJson => {
    //             this.setState({ images: resJson }, () => console.log(this.state))
    //         })
    //         .catch(err => console.log(err));
    //     }
    // }
    // getKeys = () => {
    //     return fetch('http://localhost:3000/api_key')
    //            .then(res => res.json())
    //            .catch(err => console.log(err));
    // }
    // handleInput = e => this.setState({ input: e.target.value });
    // componentWillMount() {
    //     this.getKeys()
    //         .then(apiKey => this.setState({ apiKey }, () => console.log(this.state)))
    //         .catch(err => console.log(err));
    // }
    render() {
        // const { account } = this.props;
        const { images } = this.props;
        console.log('images:', images);
        return (
            <div className='wall-page-container'>
                {/* <div className="header">
                    <img src="./images/pinterest_logo.png"/>
                    <input type="text" placeholder='Search' onKeyDown={this.searchImage} onChange={this.handleInput} value={input}/>
                    <div className="home">Home</div>
                    <div className="user">
                        {account.user.email.split('@')[0]}
                    </div>
                    <div className="options">
                        <svg>
                            {[...'ccc'].map((c, i) => <circle key={i} cx={12 + (i * 8)}/>)}
                        </svg>
                    </div>
                </div> */}
                <div className="wall">
                    {images ?
                        images.map((img, i) => <div key={i} className='img-wrapper'><img src={img.src} /></div>) : ''
                    }
                </div>
            </div>
        );
    }
}

export default WallPage;
