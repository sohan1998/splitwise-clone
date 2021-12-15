import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import signupreducer from './signupreducer';
import loginreducer from './loginreducer';

const rootReducer = combineReducers({
    form: formReducer,
    login: loginreducer,
    usersignup: signupreducer,
});

export default rootReducer;
