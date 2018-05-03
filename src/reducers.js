import { combineReducers } from 'redux';
const LOG_IN_USER = 'LOG_IN_USER';
const STORE_IMGS = 'STORE_IMGS';
const TOGGLE_HEADER_MENU = 'TOGGLE_HEADER_MENU';
const TOGGLE_MODAL = 'TOGGLE_MODAL';
const OPEN_MSG_MODAL = 'OPEN_MSG_MODAL';
const CONCAT_IMGS_TO_STORE = 'CONCAT_IMGS_TO_STORE';
const STORE_TOP_TAGS = 'STORE_TOP_TAGS';
const TOGGLE_FETCHING_PICS = 'TOGGLE_FETCHING_PICS';
const STORE_OTHER_USER_INFO = 'STORE_OTHER_USER_INFO';
const initState = {
  account: {
    user: null,
    otherUser: null,
  },
  imgs: {
    search: null,
    topTags: null,
  },
  ui: {
    headerMenu: false,
    modalBackgroundOverlay: false,
    msgModal: false,
    createPinModal: false,
    fetchingPics: false,
  },
};

const account = (state = initState.account, action) => {
  switch(action.type) {
    case LOG_IN_USER:
      return {
        ...state,
        user: action.user
      };

    case STORE_OTHER_USER_INFO:
      return {
        ...state,
        otherUser: action.otherUser
      };

    default:
    return state;
  }
};
const imgs = (state = initState.imgs, action) => {
  switch(action.type) {
    case STORE_IMGS:
      return {
        ...state,
        search: action.imgs
      };

    case CONCAT_IMGS_TO_STORE:
      return {
        ...state,
        search: [...state.search, ...action.imgs]
      };

    case STORE_TOP_TAGS:
      return {
        ...state,
        topTags: action.tags
      };

    default:
    return state;
  }
};

const ui = (state = initState.ui, action) => {
  console.log(action);
  switch(action.type) {
    case TOGGLE_HEADER_MENU:
      return {
        ...state,
        headerMenu: !state.headerMenu
      };

    case TOGGLE_MODAL:
      return {
        ...state,
        modalBackgroundOverlay: action.open
      };

    case OPEN_MSG_MODAL:
      return {
        ...state,
        msgModal: action.content
      };

    case TOGGLE_FETCHING_PICS:
      return {
        ...state,
        fetchingPics: !state.fetchingPics
      };

    default:
    return state;
  }
};
const reducer = combineReducers(
  {
    account,
    imgs,
    ui
  }
);
export default reducer;
