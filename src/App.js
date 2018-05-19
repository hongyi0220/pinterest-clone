import React from 'react';
import {
  // BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  AuthPageContainer,
  WallPageContainer,
  HeaderContainer,
  UserPageContainer,
  HeaderMenuContainer,
  SettingsPageContainer,
  ModalBackgroundOverlayContainer,
  PinPageContainer,
} from './components';
import randomWords from 'random-words';

class App extends React.Component {
  static propTypes = {
    logInUser: PropTypes.func.isRequired,
    account: PropTypes.object.isRequired,
    ui: PropTypes.object.isRequired,
    storeImgs: PropTypes.func.isRequired,
    storeTopTags: PropTypes.func.isRequired,
    imgs: PropTypes.shape({ topTags: [] }).isRequired,
    storeMagnifiedPinInfo: PropTypes.func.isRequired,
    storeOtherUserInfo: PropTypes.func.isRequired,
    history: PropTypes.shape({ location: PropTypes.shape({ pathname: PropTypes.string })}),
    concatImgsToStore: PropTypes.func.isRequired,
  };

  componentWillMount() {
    console.log('App will mount');
    // const username = this.props.account.user.username;
    this.getSessionData()
      .then(sessionData => {
        if (sessionData.user) { this.props.logInUser(sessionData.user); }
        if (sessionData.imgs) { this.props.storeImgs(sessionData.imgs); }
        if (sessionData.otherUser) {
          console.log('otherUser from session:', sessionData.otherUser);
          this.props.storeOtherUserInfo(sessionData.otherUser);
        }
        if (sessionData.magnifiedPin) { this.props.storeMagnifiedPinInfo(sessionData.magnifiedPin); }
      })
      .catch(err => console.log(err));

    this.getAllPins()
      .then(pins => {
        const myPins = pins.filter(pin => {
          // console.log('this:', this);
          return pin.users.includes(this.props.account.user.username);
        });
        let topTags = this.getTopTags(myPins);
        if (topTags.length < 3) {
          topTags = [
            ...topTags,
            // ...randomWords({
            //   exactly: 3 - topTags.length,
            //   formatter: word => [word, 2],
            // }).map(word => word.split(',')),
            ...randomWords({ exactly: 3 - topTags.length, }),
          ];
        }
        console.log('topTags:', topTags);
        this.props.storeTopTags(topTags);
        console.log('All Pins:', pins);
        return pins;
      })
      .then(pins => this.filterPinsMatchingTopTags(pins))
      .then(async topPins => {
        console.log('topPins:', topPins);
        // if (topPins.length < 20) {
        //
        //   var extraPins = await fetch(`/pics?q=${this.props.imgs.topTags[0]}&page=${2}`, {
        //     method: 'GET',
        //     credentials: 'include',
        //   })
        //     .then(res => res.json())
        //     .then(imgs => {
        //       // if (e.scroll) {
        //         this.props.concatImgsToStore(imgs);
        //       // } else {
        //       //   this.props.storeImgs(imgs);
        //       // }
        //       //
        //       // this.props.toggleFetchingPics();
        //       // console.log('state after fetchingPics:',this.state);
        //       return imgs;
        //     })
        //     .catch(err => console.log(err));
        // }
        // console.log('extraPins:',extraPins);
        // topPins = [...topPins, ...extraPins,];
        return this.shuffleArr(topPins);
      })
      .then(curatedPins => {
        // this.props.storeImgs(imgs);
        this.props.storeImgs(curatedPins);
        // Save curatedPins to session
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

  getSessionData = () => {
    console.log('getSessionData called');
    return fetch('/session', { credentials: 'include' })
    .then(res => res.json())
    .then(resJson => {
      console.log('session obj at getSessionData:', resJson);
      return resJson;
    })
    .catch(err => console.log(err));
  }

  getAllPins = () => {
    return fetch('/pins',{
      method: 'GET',
      credentials: 'include',
    })
      .then(res => res.json())
      .then(resJson => resJson)
      .catch(err => console.log(err));
  }

  getTopTags = pins => {
    console.log('getting top-tags');
    const aggregateTags = pins => {
      const result = pins.reduce((currPin, nextPin) => [...currPin, ...nextPin.tags], []);
      console.log('result from aggregating tags:', result);
      return result;
    };

    const beautifyTags = tags => {
      const result = tags.map(tag => tag.toString().trim().toLowerCase().replace(',', '').replace(/[-_]/g, ' ')).sort();
      console.log('result from beautifying tags:', result);
      return result;
    };

    // This will count how many times a tag is saved
    //   so top tags can be selected
    const getTopThreeTags = tags => {
      let result = [];
      tags.forEach((tag, i) => {
        // console.log('current tag:', tag, ' next tag:', tags[i + 1]);
        // console.log('[tag, 1]:',[tag, 1]);
        if (tag === tags[i + 1]) {
          if(!i) {
            // console.log('result:',result);
            // result.push({tag, score: 1});
            result.push([tag, 1]);
            // console.log('result after pushing:',result);
          }
          // result[result.length - 1].score++;
          result[result.length - 1][1]++;
          // console.log('after adding to score:', result);
          // console.log('[tag, 1]:',[tag, 1]);
        } else {
          // result.push({ tag: tags[i + 1], score: 1});
          result.push([tags[i + 1], 1]);
          // console.log('result after pushing:',result);
        }
      });
      return result
        // .filter(tag => typeof tag === 'object' && typeof tag.tag === 'string' && tag.score > 1)
        .filter(tag => typeof tag === 'object' && typeof tag[0] === 'string' && tag[1] > 1)
        // .sort((a, b) => b.score - a.score).slice(0, 3);
        .sort((a, b) => b[1] - a[1]).map(tag => tag[0]).slice(0, 3);

    };
    const result = getTopThreeTags(beautifyTags(aggregateTags(pins)));
    console.log('processing complete; result:', result);
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
      // console.log('pin.tags:',pin.tags);
      // console.log('topTag:', topTag);
      // console.log('tags include topTag?', pin.tags.includes(topTag));
      // return pin.tags.includes(topTag.tag);
      return pin.tags.includes(topTag);
    });

  });

  render() {
    const { account, ui, imgs } = this.props;
    return (
      // <Router>
        <div className="app-container">
          <Switch>
            <Route path='/pin/*' component={PinPageContainer}/>
            {account.user ?
              (imgs.topTags ?
              <Route component={HeaderContainer} /> : '') :
              // <Route render={() => <HeaderContainer input={this.props.history.location.pathname === '/home' ? this.props.imgs.topTags : null} />} /> :
              <Route exact path='/' component={AuthPageContainer} />}
          </Switch>


          {ui.headerMenu ?
            <Route component={HeaderMenuContainer} /> : ''}

          {account.user ?
            <Route path='/user' component={UserPageContainer} /> : ''}

          {ui.modalBackgroundOverlay ?
            <Route component={ModalBackgroundOverlayContainer} /> : ''}


          <Route exact path='/settings' component={SettingsPageContainer}/>
          <Route exact path='/(|home|search|find)' component={WallPageContainer} />
          {/* <Route exact path='/(|home|search|find)' render={() => <WallPageContainer similarPicsKeyword={this.props.imgs.topTags} />} /> */}
        </div>
    );
  }
}

export default App;
