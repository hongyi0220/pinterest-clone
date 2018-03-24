import React from 'react';
import PropTypes from 'prop-types';

class WallPage extends React.Component {
//AIzaSyA3LJ8N00ubfZZVA-hPzq4FiHG2Jjkl1Cs
    render () {
        return (
            <div className='wall-container'>
                <div className="header">
                    <img src="./images/pinterest_logo" alt=""/>
                    <input type="text"/>
                </div>
                <div className="wall"></div>
            </div>
        );
    }
}

export default WallPage;
