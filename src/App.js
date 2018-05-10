import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  AuthPageContainer,
  WallPageContainer,
  HeaderContainer,
  UserPageContainer,
  HeaderMenu,
  SettingsPageContainer,
  ModalBackgroundOverlayContainer,
  PinPageContainer,
} from './components';

class App extends React.Component {
  static propTypes = {
    logInUser: PropTypes.func.isRequired,
    account: PropTypes.object.isRequired,
    ui: PropTypes.object.isRequired,
    storeImgs: PropTypes.func.isRequired,
    storeTopTags: PropTypes.func.isRequired,
    imgs: PropTypes.shape({ topTags: [] }).isRequired,
    storeMagnifiedPinInfo: PropTypes.func.isRequired,
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
    };

    const beautifyTags = tags => {
      const result = tags.map(tag => tag.toString().trim().toLowerCase()).sort();
      console.log('result from beautifying tags:', result);
      return result;
    };

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
    };
    const result = getTopThreeTags(beautifyTags(aggregateTags(user)));
    console.log('processing complete; result:', result);
    return result;
  }

  getAllUsersWithPins = () => {
    return fetch('/pins',{
      method: 'GET',
      credentials: 'include',
    })
      .then(res => res.json())
      .then(resJson => resJson)
      .catch(err => console.log(err));
  }

  extractAllPins = users => {
    const result = users.map((user) =>
      user.pins.map((pin) => ({
        src: pin.src,
        tags: pin.tags,
        username: user.username,
        profileImg: user.profileImg,
      })
    ))
      .reduce((currUserPins, nextUserPins) => [...currUserPins, ...nextUserPins], []);
    console.log('extracted pins:',result);
    return result;
  }

  shuffleArr = arr => {
    let result = [];
    let ns = [...arr];
    const helper = ns => {
      if (!ns.length) { return; }
      const randomIndex = Math.floor(Math.random() * ns.length);
      result.push(ns[randomIndex]);
      ns.splice(randomIndex, 1);
      helper(ns);
    };
    helper(ns);
    return result;
  };

  filterPinsMatchingTopTags = pins => pins.filter(pin => {
    // console.log('pin.tags:', pin.tags);
    return this.props.imgs.topTags.some(topTag => {
      // console.log('topTag:', topTag.tag);
      // console.log('tags include topTag?', pin.tags.includes(topTag.tag));
      return pin.tags.includes(topTag.tag);
    });

  });

  componentWillMount() {
    console.log('App will mount');
    // const { logInUser, storeImgs, storeTopTags } = this.props;
    fetch('/shared-pin', {
      method: 'GET',
      credentials: 'include',
    })
      .then(res => res.json())
      .then(resJson => this.props.storeMagnifiedPinInfo(resJson))
      .catch(err => console.log(err));

    this.getSessionData()
      .then(sessionData => {
        if (sessionData.user) { this.props.logInUser(sessionData.user); }
        if (sessionData.imgs) { this.props.storeImgs(sessionData.imgs); }
        console.log('sessionData:', sessionData.user);
        const topTags = this.processTags(sessionData.user);
        console.log('topTags:', topTags);
        this.props.storeTopTags(topTags);
      })
      .catch(err => console.log(err));

    // Pin: { src: http://example.com/resource, tags: ['a', 'b', 'c'] }

    this.getAllUsersWithPins()
      .then(users => this.extractAllPins(users))
      .then(pins => this.filterPinsMatchingTopTags(pins))
      .then(topPins => {
        console.log('topPins:', topPins);
        // if (topPins.length < 60)
        return this.shuffleArr(topPins);
      })
      .then(curatedPins => {
        // this.props.storeImgs(imgs);
        this.props.storeImgs(curatedPins);
        // Save curatedPins in session
        fetch('/session', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'content-type': 'application/json'
          },
          body: JSON.stringify({ imgs: curatedPins }),
        });
      })
      .catch(err => console.log(err));

  }

  render() {
    const { account, ui } = this.props;
    return (
      <Router>
        <div className="app-container">
          <Switch>
            <Route path='/pin/*' component={PinPageContainer}/>
            {account.user ?
              <Route component={HeaderContainer} /> :
              <Route exact path='/' component={AuthPageContainer} />}
          </Switch>


          {ui.headerMenu ?
            <Route component={HeaderMenu} /> : ''}

          {account.user ?
            <Route path='/user' component={UserPageContainer} /> : ''}

          {ui.modalBackgroundOverlay ?
            <Route component={ModalBackgroundOverlayContainer} /> : ''}


          <Route exact path='/settings' component={SettingsPageContainer}/>
          <Route exact path='/(|home|search|find)' component={WallPageContainer} />
        </div>
      </Router>
    );
  }
}

export default App;
