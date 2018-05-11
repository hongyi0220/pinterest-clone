import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import MsgModalContainer from '../Msg/MsgModal';
import PasswordModalContainer from '../Password/PasswordModalContainer';
import CreatePinModalContainer from '../CreatePin/CreatePinModalContainer';
import {
  toggleModal
} from '../../../actions';

class ModalBackgroundOverlay extends React.Component {
  static propTypes = {
    toggleModal: PropTypes.func.isRequired,
    ui: PropTypes.shape({}).isRequired,
    history: PropTypes.shape({}),
  };

  closeModalFromBackground = e => {
    if (e.target.className === 'modal-background-overlay') {
      console.log('close modal from modal-background-overlay');
      this.props.toggleModal(false);
    }
  }

  componentDidMount() {
    console.log('ModalBackgroundOverlay mounted');
  }
  componentWillUnmount() {
    console.log('ModalBackgroundOverlay will UNmount');
  }

  render() {
    const { ui, history } = this.props;
    console.log('ModalBackgroundOverlay rendered');

    return (
      <div className="modal-background-overlay" onClick={this.closeModalFromBackground}>
        <Route exact path='/settings' render={() => ui.msgModal ? <MsgModalContainer /> : <PasswordModalContainer />} />
        <Route exact path='/user/*' render={() => ui.msgModal? <MsgModalContainer /> : <CreatePinModalContainer history={history}/>} />
      </div>
    );
  }
}

const ModalBackgroundOverlayContainer = connect(
  state => ({ ui: state.ui }),
  {
    toggleModal
  }
)(ModalBackgroundOverlay);

export default ModalBackgroundOverlayContainer;
