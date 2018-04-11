import React from 'react';
import PropTypes from 'prop-types';

class UserPage extends React.Component {
    state = {

    }
    static propTypes = {

    }
    render() {
        const { account } = this.props;
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

                </div>
            </div>
        );
    }
}

export default UserPage;
