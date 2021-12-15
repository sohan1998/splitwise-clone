import { LOGIN_ERROR } from '../actions/actions';
import { LOGIN_SUCCESS } from '../actions/actions';
import { reducer as formReducer } from 'redux-form';

const initialState = {
    logindetails: '',
};

export default function (state = initialState, action) {
    console.log('In Login Reducer');
    switch (action.type) {
        case LOGIN_SUCCESS:
            return {
                ...state,
                logindetails: action.payload,
            };
        case LOGIN_ERROR:
            return {
                ...state,
                logindetails: action.payload,
            };
        default:
            return state;
    }
}
