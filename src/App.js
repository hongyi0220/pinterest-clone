import React from 'react';
import {
  Route,
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
    imgs: PropTypes.shape({
      topTags: PropTypes.array,
      input: PropTypes.array,
     }).isRequired,
    storeMagnifiedPinInfo: PropTypes.func.isRequired,
    storeOtherUserInfo: PropTypes.func.isRequired,
    history: PropTypes.shape({ location: PropTypes.shape({ pathname: PropTypes.string })}),
    concatImgsToStore: PropTypes.func.isRequired,
    storeSearchKeywords: PropTypes.func.isRequired,
    toggleHeaderMenu: PropTypes.func.isRequired,
  };

  state = {
    isOkToMountHeader: false,
  };

  componentWillMount() {
    const pathname = this.props.history.location.pathname;

    const getSessionDataPromise = new Promise((resolve, reject) => {
      this.getSessionData()
        .then(result => {
          resolve(result);
        })
        .catch(err => {
          reject();
        });
    });
    const getAllPinsPromise = new Promise((resolve, reject) => {
      this.getAllPins()
        .then(result => {
          resolve(result);
        })
        .catch(err => {
          reject();
        });
    });

    Promise.all([getSessionDataPromise, getAllPinsPromise])
      .then(values => {
        const sessionData = values[0];
        const allPins = values[1];

        if (sessionData.user) {
          this.props.logInUser(sessionData.user);
        }
        if (sessionData.imgs && pathname !== '/' && pathname !== '/home') {
          this.props.storeImgs(sessionData.imgs);
          this.setState({ isOkToMountHeader: true });
        } else {
          this.curateWall(allPins);
        }
        if (sessionData.otherUser) {
          this.props.storeOtherUserInfo(sessionData.otherUser);
        }
        if (sessionData.magnifiedPin) {
          this.props.storeMagnifiedPinInfo(sessionData.magnifiedPin);
          if (pathname.includes('/pin')) {
            this.props.storeSearchKeywords([sessionData.magnifiedPin.tags[0]]);
          }
        }

      })
      .catch(err => console.log(err));
  }

  curateWall = allPins => {
    const myPins = allPins.filter(pin => {
      return pin.users.includes(this.props.account.user.username);
    });
    let topTags = this.getTopTags(myPins);
    if (topTags.length < 3) {
      topTags = [
        ...topTags,
        ...randomWords({ exactly: 3 - topTags.length, }),
      ];
    }
    this.props.storeTopTags(topTags);
    const curatedPins = this.shuffleArr(this.filterPinsMatchingTopTags(allPins));
    // setTimeout(() => this.props.storeImgs(curatedPins), 5000);
    this.props.storeImgs(curatedPins);
    fetch('/session', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({ imgs: curatedPins }),
    })
      .then(() => this.setState({ isOkToMountHeader: true }))
      .catch(err => console.log(err));
  }

  getSessionData = () => {
    return fetch('/session', { credentials: 'include' })
    .then(res => res.json())
    .then(resJson => {
      return resJson;
    })
    .catch(err => console.log(err));
  }

  getAllPins = () => {
    return fetch('/pins',{
      method: 'GET',
      credentials: 'include',
    })
      .then(res => {
        return res.json();
      })
      // .then(resJson => resJson)
      .catch(err => console.log(err));
  }

  getTopTags = pins => {
    const aggregateTags = pins => {
      const result = pins.reduce((currPin, nextPin) => [...currPin, ...nextPin.tags], []);
      return result;
    };

    const beautifyTags = tags => {
      const result = tags.map(tag => tag.toString().trim().toLowerCase().replace(',', '').replace(/[-_]/g, ' ')).sort();
      return result;
    };

    // This will count how many times a tag appears in user's saved Pins
    //   so that top tags can be selected
    const getTopThreeTags = tags => {
      let result = [];
      tags.forEach((tag, i) => {
        if (tag === tags[i + 1]) {
          if(!i) {
            result.push([tag, 1]);
          }
          result[result.length - 1][1]++;
        } else {
          result.push([tags[i + 1], 1]);
        }
      });
      return result
        .filter(tag => typeof tag === 'object' && typeof tag[0] === 'string' && tag[1] > 1)
        // .sort((a, b) => b.score - a.score).slice(0, 3);
        .sort((a, b) => b[1] - a[1]).map(tag => tag[0]).slice(0, 3);

    };
    const result = getTopThreeTags(beautifyTags(aggregateTags(pins)));
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
    return this.props.imgs.topTags.some(topTag => {
      return pin.tags.includes(topTag);
    });

  });

  render() {
    const { account, ui, imgs, } = this.props;
    return (
      <div className="app-container" onClick={() => this.props.toggleHeaderMenu(false)}>

        {imgs.magnifiedPin && <Route path='/pin/*' component={PinPageContainer}/>}
        {account.user ?
          <div>
            {this.state.isOkToMountHeader &&
              <Route render={props => <HeaderContainer { ...props } input={this.props.imgs.input} atPinPage={this.props.history.location.pathname.includes('/pin')} />} />
            }
            <Route exact path='/(|home|search|find)' component={WallPageContainer} />
          </div>
          : <Route path='/' component={AuthPageContainer} />}

        {ui.headerMenu && <Route component={HeaderMenuContainer} />}

        {account.user && <Route path='/user' component={UserPageContainer} />}

        {ui.modalBackgroundOverlay && <Route component={ModalBackgroundOverlayContainer} />}

        <Route exact path='/settings' component={SettingsPageContainer} />

      </div>
    );
  }
}

export default App;
