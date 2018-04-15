import React from 'react';

class HeaderMenu extends React.Component {
    render() {
        return (
            <div className="header-menu-container">
                <div className="settings-button">
                    <a href="/settings" className="settings-button">Edit settings</a>
                </div>
                <div className="logout-button">
                    <a href="/logout" className="logout-link">Log out</a>
                </div>
            </div>
        );
    }
}

export default HeaderMenu;
