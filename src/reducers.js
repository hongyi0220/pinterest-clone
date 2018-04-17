import { combineReducers } from 'redux';
const LOG_IN_USER = 'LOG_IN_USER';
const STORE_IMAGES = 'STORE_IMAGES';
const TOGGLE_HEADER_MENU = 'TOGGLE_HEADER_MENU';
const OPEN_PASSWORD_WINDOW = 'OPEN_PASSWORD_WINDOW';

const initState = {
    user: null
};

const account = (state = initState, action) => {
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
const images = (state = null, action) => {
    switch(action.type) {
        case STORE_IMAGES:
            return action.images;
            break;
        default:
            return state;
    }
}
const ui = (state = { headerMenu: false, passwordWindow: false }, action) => {
    switch(action.type) {
        case TOGGLE_HEADER_MENU:
            return {
                ...state,
                headerMenu: !state.headerMenu
            };
            break;
        case OPEN_PASSWORD_WINDOW:
            return {
                ...state,
                passwordWindow: true
            }
            break;
        default:
            return state;
    }
}
const reducer = combineReducers(
    {
        account,
        images,
        ui
    }
);
export default reducer;
