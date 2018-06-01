import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  toggleHeaderMenu,
} from '../../actions';

const HeaderMenu = ({ history, toggleHeaderMenu, }) => {
  return (
    <div className="header-menu-container">
      <div className='rect'></div>
      <div className="menu-item-wrapper settings">
        <div className='link' onClick={() => {history.push('/settings'); toggleHeaderMenu();}}>Edit settings</div>
      </div>
      <hr />
      <div className="menu-item-wrapper logout">
        <a href='/logout'>Log out</a>
      </div>
    </div>
  );
};

HeaderMenu.propTypes = {
  history: PropTypes.shape({}),
  toggleHeaderMenu: PropTypes.func.isRequired,
};

const HeaderMenuContainer = connect(
  () => ({ }),
  {
    toggleHeaderMenu,
  }
)(HeaderMenu);
export default HeaderMenuContainer;
