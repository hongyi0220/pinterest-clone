import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from 'react-router-dom';
import PropTypes from 'prop-types';
import {
    AuthContainer 
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
                <Switch>
                    <Route exact path='/' component={AuthContainer} />
                </Switch>
            </Router>
        );
    }
}

export default App;
