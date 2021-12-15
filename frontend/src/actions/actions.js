import axios from 'axios';
import backendServer from '../webConfig';

export const SIGNUP_SUCCESS = 'SIGNUP_SUCCESS';
export const FETCH_LOGIN = 'FETCH_LOGIN';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_ERROR = 'LOGIN_ERROR';
export const EMAIL = 'EMAIL';

export const signup = (values) => (dispatch) => {
    console.log('Actions SIGNUP :', values);
    console.log('In action', backendServer);
    axios.defaults.withCredentials = true;
    const request = axios.post(`${backendServer}/users/signup`, values).then((res) => {
        console.log('Response actions signup:', res);
        if (res.status === 200) {
            localStorage.setItem('signupcheck', true);
            dispatch({
                type: SIGNUP_SUCCESS,
                payload: true,
            });
        }
    });
};

export const login = (values) => (dispatch) => {
    console.log('Login Actions :', values);
    console.log('Got user email at the backend:', values.email);
    axios.defaults.withCredentials = true;
    const request = axios.post(`${backendServer}/users/login`, values).then((res) => {
        console.log('Response actions signup:', res);
        if (res.status === 200) {
            console.log(res.data);
            console.log('My token is:', res.data.token);
            console.log('Inside Login Success');

            // var userdetails={
            //     myjwttoken:res.data.token,
            //     useremail:values.email}

            // localStorage.setItem('userdetails',userdetails);

            console.log('checking');
            localStorage.setItem('myjwttoken', res.data.token);
            localStorage.setItem('useremail', values.email);
            dispatch({
                type: LOGIN_SUCCESS,
                payload: true,
            });
        } else {
            console.log('res ' + res);
            dispatch({
                type: LOGIN_ERROR,
                payload: false,
            });
        }
    });
};
