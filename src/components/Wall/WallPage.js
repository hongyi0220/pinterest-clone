import React from 'react';
import PropTypes from 'prop-types';

class WallPage extends React.Component {
//AIzaSyA3LJ8N00ubfZZVA-hPzq4FiHG2Jjkl1Cs
    render () {
        const { account } = this.props;
        return (
            <div className='wall-container'>
                <div className="header">
                    <img src="./images/pinterest_logo.png"/>
                    <input type="text" placeholder='Search'/>
                    <div className="home">home</div>
                    <div className="user">
                        {account.user.email.split('@')[0]}
                    </div>
                    <div className="options">...</div>
                </div>
                <div className="wall">

                </div>
            </div>
        );
    }
}

export default WallPage;
