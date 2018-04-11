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
import {
    logInUser
} from './actions';

class App extends React.Component {
    state = {

    }

    static propTypes = {
        logInUser: PropTypes.func.isRequired,
        account: PropTypes.object
    }

    getSession = () => {
        console.log('getSession called');
        return fetch('http://localhost:3000/user_session', {credentials: 'include'})
                .then(res => res.json())
                .then(user => {
                    console.log('user at getSession:', user);
                    return user;
                })
                .catch(err => console.log(err));
    }

    componentWillMount() {
        console.log('cmpWlMnt');
        this.getSession()
                .then(user => {
                    if (user) this.props.logInUser(user);
                })
                .catch(err => console.log(err));

    }

    render() {
        const { account } = this.props;
        return (
            <Router>
                <div className="app-container">
                    {account.user ?
                        <Route exact path='/' component={HeaderContainer} /> :
                        <Route exact path='/' component={AuthPageContainer} />
                    }
                    {account.user ?
                            <Route exact path='/user' component={UserPageContainer} /> :
                            ''
                    }
                    <Route exact path='/' component={WallPageContainer} />
                </div>
            </Router>
        );
    }
}

export default App;
