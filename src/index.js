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
} from './actions';

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
    }
)(App);

ReactDOM.render(
    <Provider store={store}>
        <AppContainer />
    </Provider>
    ,
    document.getElementById('root')
);
