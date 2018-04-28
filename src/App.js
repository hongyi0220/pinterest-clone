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

    };

    static propTypes = {
        logInUser: PropTypes.func.isRequired,
        account: PropTypes.object.isRequired,
        ui: PropTypes.object.isRequired
    };

    getSessionData = () => {
        console.log('getSessionData called');
        return fetch('/session', {credentials: 'include'})
                .then(res => res.json())
                .then(resJson => {
                    console.log('session obj at getSessionData:', resJson);
                    return resJson;
                })
                .catch(err => console.log(err));
    }

    processTags = user => {
        console.log('processing tags');
        const aggregateTags = user => {
            const result = user.pins.reduce((currPin, nextPin) => [...currPin, ...nextPin.tags], []);
            console.log('result from aggregating tags:', result);
            return result;
        }

        const beautifyTags = tags => {
            const result = tags.map(tag => tag.toString().trim().toLowerCase()).sort();
            console.log('result from beautifying tags:', result);
            return result;
        }

        // This will count how many times a tag is saved
        //     so top tags can be analyzed
        const getTopThreeTags = tags => {
            let _tags = [];
            tags.forEach((tag, i) => {
                // console.log('current tag:', tags[i], ' next tag:', tags[i + 1]);
                if (tag === tags[i + 1]) {
                    if(!i) {
                        _tags.push({tag, score: 1});
                    }

                    _tags[_tags.length - 1].score++;
                    // console.log('after adding to score:', _tags);
                } else {
                    _tags.push({ tag: tags[i + 1], score: 1});
                }
            });
            const result =
            _tags
            .filter(tag => typeof tag === 'object')
            .sort((a, b) => b.score - a.score).slice(0, 4);
            // console.log('result from analyzing tags:', result);
            return result;
        }
        const result = getTopThreeTags(beautifyTags(aggregateTags(user)));
        console.log('processing complete; result:', result);
        return result;
    }

    componentWillMount() {
        console.log('App will mount');
        const { logInUser, storeImgs, storeTopTags } = this.props;

        this.getSessionData()
        .then(sessionData => {
            if (sessionData.user) { logInUser(sessionData.user); }
            if (sessionData.imgs) { storeImgs(sessionData.imgs); }
            console.log('sessionData:', sessionData.user);
            const topTags = this.processTags(sessionData.user);
            console.log('topTags:', topTags);
            storeTopTags(topTags);
        })
        .catch(err => console.log(err));

    }

    render() {
        const { account, ui } = this.props;
        return (
            <Router>
                <div className="app-container">
                    {account.user ?
                        <Route component={HeaderContainer} /> :
                        <Route exact path='/' component={AuthPageContainer} />
                    }
                    {ui.headerMenu ?
                        <Route component={HeaderMenu} /> : ''
                    }
                    {account.user ?
                            <Route exact path='/user' component={UserPageContainer} /> : ''
                    }

                    {
                        ui.modalBackgroundOverlay ? <Route component={ModalBackgroundOverlayContainer} /> : ''
                    }
                    <Route exact path='/settings' component={SettingsPageContainer}/>
                    <Route exact path='/(|home|search|find)' component={WallPageContainer} />
                </div>
            </Router>
        );
    }
}

export default App;
