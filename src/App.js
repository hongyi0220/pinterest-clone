import React from 'react';
import { withRouter, Switch, Route } from 'react-router-dom';
import PropTypes from 'prop-types';

class App extends React.Component {
    constructor() {
        super()
        this.state = {}
    }
    render() {
        const { } = this.props;
        return (
            <div>Welcome! This is a Pinterest clone.</div>
        );
    }
}


export default withRouter(App);
