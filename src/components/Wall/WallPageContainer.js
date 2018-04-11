import { connect } from 'react-redux';
import WallPage from './WallPage';
// import some actions

const mapStateToProps = state => ({images: state.images});

const WallPageContainer = connect(
    mapStateToProps,
    {}
)(WallPage);

export default WallPageContainer;
