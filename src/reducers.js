import { combineReducers } from 'redux';
const LOG_IN_USER = 'LOG_IN_USER';
const STORE_IMGS = 'STORE_IMGS';
const TOGGLE_HEADER_MENU = 'TOGGLE_HEADER_MENU';
const TOGGLE_MODAL = 'TOGGLE_MODAL';
const OPEN_MSG_MODAL = 'OPEN_MSG_MODAL';

const account = (state = { user: null }, action) => {
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
const imgs = (state = null, action) => {
    switch(action.type) {
        case STORE_IMGS:
            return action.imgs;
            break;
        default:
            return state;
    }
}

const uiInitState = {
    headerMenu: false,
    modal: false,
    msgModal: false,
    createPinModal: false
}
const ui = (state = uiInitState, action) => {
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
                modal: action.open
            }
            break;
        case OPEN_MSG_MODAL:
            return {
                ...state,
                msgModal: true
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
