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
    UserPageContainer,
    HeaderMenu,
    SettingsPageContainer,
    ModalBackgroundOverlayContainer
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
        const { logInUser, storeImgs } = this.props;
        this.getSession()
                .then(session => {
                    if (session.user) logInUser(session.user);
                    if (session.imgs) storeImgs(session.imgs);
                })
                .catch(err => console.log(err));

    }

    render() {
        const { account, ui } = this.props;
        return (
            <Router>
                <div className="app-container">
                    {account.user ?
                        <Route path='/' component={HeaderContainer} /> :
                        <Route exact path='/' component={AuthPageContainer} />
                    }
                    {ui.headerMenu ?
                        <Route path='/' component={HeaderMenu} /> :
                        ''
                    }
                    {account.user ?
                            <Route exact path='/user' component={UserPageContainer} /> :
                            ''
                    }

                    {
                        ui.modal ? <ModalBackgroundOverlayContainer /> : ''
                    }
                    <Route exact path='/settings' component={SettingsPageContainer}/>
                    <Route exact path='/(search|find)' component={WallPageContainer} />
                </div>
            </Router>
        );
    }
}

export default App;
