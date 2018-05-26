import { combineReducers } from 'redux';
const LOG_IN_USER = 'LOG_IN_USER';
const STORE_IMGS = 'STORE_IMGS';
const TOGGLE_HEADER_MENU = 'TOGGLE_HEADER_MENU';
const TOGGLE_MODAL = 'TOGGLE_MODAL';
const TOGGLE_MSG_MODAL = 'TOGGLE_MSG_MODAL';
const CONCAT_IMGS_TO_STORE = 'CONCAT_IMGS_TO_STORE';
const STORE_TOP_TAGS = 'STORE_TOP_TAGS';
const TOGGLE_LOADING_SPINNER = 'TOGGLE_LOADING_SPINNER';
const STORE_OTHER_USER_INFO = 'STORE_OTHER_USER_INFO';
const STORE_MAGNIFIED_PIN_INFO = 'STORE_MAGNIFIED_PIN_INFO';
const STORE_SEARCH_KEYWORDS = 'STORE_SEARCH_KEYWORDS';
const STORE_CURATED_PINS = 'STORE_CURATED_PINS';

const initState = {
  account: {
    user: null,
    otherUser: null,
  },
  imgs: {
    searchKeywords: [],
    search: null,
    topTags: null,
    magnifiedPin: null,
    curatedPins: null,
  },
  ui: {
    headerMenu: false,
    modalBackgroundOverlay: false,
    msgModal: false,
    createPinModal: false,
    loadingSpinner: false,
  },
};
console.log('initState:',initState);
const account = (state = initState.account, action) => {
  console.log(action);
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
  console.log(action);
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
    case STORE_MAGNIFIED_PIN_INFO:
      return {
        ...state,
        magnifiedPin: action.magnifiedPin,
      };
    case STORE_SEARCH_KEYWORDS:
      return {
        ...state,
        searchKeywords: action.keywords,
      };
    case STORE_CURATED_PINS:
      return {
        ...state,
        curatedPins: action.pins,
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
        headerMenu: !state.headerMenu,
      };

    case TOGGLE_MODAL:
      return {
        ...state,
        modalBackgroundOverlay: action.open,
      };

    case TOGGLE_MSG_MODAL:
      return {
        ...state,
        msgModal: action.content,
      };

    case TOGGLE_LOADING_SPINNER:
      return {
        ...state,
        loadingSpinner: !state.loadingSpinner,
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
