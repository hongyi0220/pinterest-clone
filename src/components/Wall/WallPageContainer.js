import { connect } from 'react-redux';
import WallPage from './WallPage';
import {
    storeImgs,
    logInUser,
} from '../../actions';

const mapStateToProps = state => state;

const WallPageContainer = connect(
    mapStateToProps,
    {
        storeImgs,
        logInUser
    }
)(WallPage);

export default WallPageContainer;
