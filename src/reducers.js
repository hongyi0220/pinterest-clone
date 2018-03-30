import { combineReducers } from 'redux';
const LOG_IN_USER = 'LOG_IN_USER';

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
const reducer = combineReducers(
    {
        account
    }
);
export default reducer;
