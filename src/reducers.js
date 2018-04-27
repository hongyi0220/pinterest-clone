import { combineReducers } from 'redux';
const LOG_IN_USER = 'LOG_IN_USER';
const STORE_IMGS = 'STORE_IMGS';
const TOGGLE_HEADER_MENU = 'TOGGLE_HEADER_MENU';
const TOGGLE_MODAL = 'TOGGLE_MODAL';
const OPEN_MSG_MODAL = 'OPEN_MSG_MODAL';
const CONCAT_TO_IMGSTORE = 'CONCAT_TO_IMGSTORE';
const STORE_TOP_TAGS = 'STORE_TOP_TAGS';

const initState = {
    account: {
        user: null
    },
    imgs: {
        search: null,
        topTags: null
    },
    // imgs: null,
    // topTags: null,
    ui: {
        headerMenu: false,
        modalBackgroundOverlay: false,
        msgModal: false,
        createPinModal: false
    }
};

const account = (state = initState.account, action) => {
    switch(action.type) {
        case LOG_IN_USER:
            return {
                ...state,
                user: action.user
            };
            break;
        default:
            return state;
    }
}
const imgs = (state = initState.imgs, action) => {
    switch(action.type) {
        case STORE_IMGS:
            return {
                ...state,
                search: action.imgs
            };
            break;
        case CONCAT_TO_IMGSTORE:
            return {
                ...state,
                search: [...state.search, ...action.imgs]
            };
            break;
        case STORE_TOP_TAGS:
            return {
                ...state,
                topTags: action.tags
            };
            break;
        default:
            return state;
    }
}

// const uiInitState = {
//     headerMenu: false,
//     modalBackgroundOverlay: false,
//     msgModal: false,
//     createPinModal: false
// }
const ui = (state = initState.ui, action) => {
    console.log(action);
    switch(action.type) {
        case TOGGLE_HEADER_MENU:
            return {
                ...state,
                headerMenu: !state.headerMenu
            };
            break;
        case TOGGLE_MODAL:
            return {
                ...state,
                modalBackgroundOverlay: action.open
            }
            break;
        case OPEN_MSG_MODAL:
            return {
                ...state,
                msgModal: action.content
            }
            break;
        default:
            return state;
    }
}
const reducer = combineReducers(
    {
        account,
        imgs,
        ui
    }
);
export default reducer;
