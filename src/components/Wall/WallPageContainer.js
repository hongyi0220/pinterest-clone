import { connect } from 'react-redux';
import WallPage from './WallPage';
// import some actions

const mapStateToProps = state => ({imgs: state.imgs});

const WallPageContainer = connect(
    mapStateToProps,
    {}
)(WallPage);

export default WallPageContainer;
