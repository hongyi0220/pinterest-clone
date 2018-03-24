import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from 'react-router-dom';
import PropTypes from 'prop-types';
import {
    AuthContainer,
    WallContainer
} from './components';

class App extends React.Component {
    constructor() {
        super()
        this.state = {}
    }
    render() {
        const { } = this.props;
        return (
            <Router>
                <div className="app-container">
                    <Route exact path='/' component={AuthContainer} />
                    <Route exact path='/' component={WallContainer} />
                </div>
            </Router>
        );
    }
}

export default App;
