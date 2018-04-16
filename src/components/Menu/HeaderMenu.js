import React from 'react';
import { Link } from 'react-router-dom';

const HeaderMenu = ({ history }) => {
    return (
        <div className="header-menu-container">
            <div className="menu-item-wrapper-settings">
                <div className='link' onClick={() => history.push('/settings')}>Edit settings</div>
            </div>
            <div className="menu-item-wrapper-logout">
                <Link to='/logout'>Log out</Link>
            </div>
        </div>
    );
}

export default HeaderMenu;
