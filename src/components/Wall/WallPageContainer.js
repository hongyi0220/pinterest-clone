import { connect } from 'react-redux';
import WallPage from './WallPage';
import {
    storeImgs
} from '../../actions';

const mapStateToProps = state => ({imgs: state.imgs});

const WallPageContainer = connect(
    mapStateToProps,
    {
        storeImgs
    }
)(WallPage);

export default WallPageContainer;
