import React from 'react';
import PropTypes from 'prop-types';

class UserPage extends React.Component {
    state = {
        pindex: null
    }
    static propTypes = {

    }

    highlightPin = e => {
        if (e) console.log(e.target.id);
        this.setState({ pindex: e ? e.target.id : null });
    }

    deletePin = () => {
        const { pin } = this.state;
        console.log(`/delete-pin?${pin.split('-')[1]}`);
        fetch(`/delete-pin?pin=${pin.split('-')[1]}`, {credentials: 'include'})
        .catch(err => console.log(err));
    }
    render() {
        const { account } = this.props;
        const { pindex } = this.state;
        return (
            <div className="user-page-container">
                <div className="user-info-container">
                    <div className="username-wrapper">
                        {account.user.email.split('@')[0]}
                    </div>
                    <div className="profile-image-wrapepr">
                        <img src="./images/default-profile-image.png" alt=""/>
                    </div>
                </div>
                <div className="saved-images-container">
                    <h2>Saved Pins</h2>
                    <div className="wall">
                        {account.user.pins ?
                            account.user.pins.map((pin, i) => <div id={`pin-${i}`} key={i} className='img-container' onMouseEnter={e=>{console.log('entering'); this.highlightPin(e)}} onMouseLeave={e=>{console.log('leaving'); this.highlightPin(null)}}>
                                <div id={`pin-${i}`} className={pindex === `pin-${i}` ? 'img-overlay on': 'img-overlay'}>
                                    <div className="action-button">
                                        <img src="./images/pin.png" alt="" className="pin"/>
                                        <div className='action-button-text' onClick={this.deletePin}>Delete</div>
                                    </div>
                                    <div className="share-button"></div>
                                </div>
                                <img className='wall-img' src={pin.src} />
                            </div>) : ''
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default UserPage;
