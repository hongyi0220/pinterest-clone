import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from 'react-router-dom';
import PropTypes from 'prop-types';
import {
    AuthPageContainer,
    WallPageContainer,
    HeaderContainer,
    UserPageContainer
} from './components';

class App extends React.Component {
    state = {

    }

    static propTypes = {
        logInUser: PropTypes.func.isRequired,
        account: PropTypes.object
    }

    getSession = () => {
        console.log('getSession called');
        return fetch('/session', {credentials: 'include'})
                .then(res => res.json())
                .then(resJson => {
                    console.log('session obj at getSession:', resJson);
                    return resJson;
                })
                .catch(err => console.log(err));
    }

    componentWillMount() {
        console.log('cmpWlMnt');
        const { logInUser, storeImages } = this.props;
        this.getSession()
                .then(sessionObj => {
                    if (sessionObj.user) logInUser(sessionObj.user);
                    if (sessionObj.images) storeImages(sessionObj.images);
                })
                .catch(err => console.log(err));

    }

    render() {
        const { account } = this.props;
        return (
            <Router>
                <div className="app-container">
                    {account.user ?
                        <Route path='/' component={HeaderContainer} /> :
                        <Route exact path='/' component={AuthPageContainer} />
                    }
                    {account.user ?
                            <Route exact path='/user' component={UserPageContainer} /> :
                            ''
                    }
                    <Route exact path='/search' component={WallPageContainer} />
                </div>
            </Router>
        );
    }
}

export default App;
