import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider, connect } from 'react-redux';
import { createStore } from 'redux';
import reducer from './reducers';
import {
    logInUser,
    storeImgs,
    storeTopTags,
    storeMagnifiedPinInfo,
    storeOtherUserInfo,
    concatImgsToStore,
    storeSearchKeywords,
} from './actions';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';

let store = createStore(reducer);

const mapStateToProps = state => state;

const AppContainer = connect(
    mapStateToProps,
    {
        logInUser,
        storeImgs,
        storeTopTags,
        storeMagnifiedPinInfo,
        storeOtherUserInfo,
        concatImgsToStore,
        storeSearchKeywords,
    }
)(App);

ReactDOM.render(
    <Provider store={store}>
      <Router>
        <Route component={AppContainer} />
      </Router>
    </Provider>
    ,
    document.getElementById('root')
);
