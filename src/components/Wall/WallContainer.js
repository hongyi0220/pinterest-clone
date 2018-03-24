import { connect } from 'react-redux';
import WallPage from './WallPage';
// import some actions

const mapStateToProps = state => ({...state});

const WallContainer = connect(
    mapStateToProps,
    {}
)(WallPage);

export default WallContainer;
