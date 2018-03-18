import { combineReducers } from 'redux';
const GET_USER_INFO = 'GET_USER_INFO';
const HANDLE_USER_INPUT ='HANDLE_USER_INPUT';

const initState = {
    userInput: ''
};

const account = (state = initState, action) => {
    switch(action.type) {
        case GET_USER_INFO:
            return {
                ...state,
                userInfo: action.userInfo
            }
            break;
        case HANDLE_USER_INPUT:
            return {
                ...state,
                userInput: action.userInput
            }
            break;
        default:
            return state;
    }
}
const reducer = combineReducers(
    {
        account
    }
);
export default reducer;
