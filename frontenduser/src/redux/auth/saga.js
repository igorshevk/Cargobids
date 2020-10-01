import {all, call, fork, put, takeEvery} from 'redux-saga/effects';
import api from '../../services/api';
import {setLocalStorageUser} from '../../helpers/API';
import {
    LOGIN_USER,
    LOGIN_2FA_VERIFY,
    REGISTER_USER,
    KEY_VERIFY,
    COMPLETE_REGISTER_REQUEST,
    LOGOUT_USER,
    LOGIN_USER_SUCCESS,
    LOGIN_USER_ERROR
} from '../actions';
import {successNoti, errorNoti} from "../../helpers/Notifications"

import {
    loginUserSuccess,
    loginUserError,
    registerUserSuccess,
    registerUserError
} from './actions';

import Cookies from "universal-cookie";
import axios from "axios";
import {
    API_URL,
    LOGIN_URL,
    REGISTER_URL,
    VERIFY_KEY_URL,
    REGISTER_COMPLETE_URL,
    VERIFY_2FA_CODE
} from "../../helpers/Auth";
import {userTypesToGroups, URL_PREFIX} from "../../constants/defaultValues";
import { signOut } from "../../helpers/Auth";

const loginWithEmailPasswordAsync = async (email, password) =>
    await axios.post(API_URL + LOGIN_URL, {email, password})
        .then(authUser => authUser)
        .catch(error => error);

function* loginWithEmailPassword({payload}) {
    const {history, user:{email, password}, callback} = payload;

    try {
        const responseLoginUser = yield call(loginWithEmailPasswordAsync, email, password);
        if (responseLoginUser.data) {
            callback(null,responseLoginUser);
        } else {
            let errMsg = 'Failed to Login User';
            if (responseLoginUser.response && responseLoginUser.response.status !== 200 && responseLoginUser.response.data) {
                errMsg = responseLoginUser.response.data.error;
            }
            callback(responseLoginUser);
            yield put(loginUserError(errMsg));
        }
    } catch (error) {
        yield put(loginUserError(error));
        callback(error);
        errorNoti('Something went wrong while processing your request');
    }
}

const verify2FALoginAsync = async ({email, id, key}) =>
    await axios.post(API_URL + VERIFY_2FA_CODE, {email, id, key})
        .then(authUser => authUser)
        .catch(error => error);

function* verify2FALogin({payload}) {
    let {email, id, code2FA, history} = payload;

    try{
        const response2FA = yield call(verify2FALoginAsync, {email, id, key:code2FA});

        if(response2FA.data && response2FA.status === 200) {
            console.log('user logged In success');
            setLocalStorageUser(response2FA.data);
            yield put(loginUserSuccess(response2FA.data, history));
            successNoti('2FA has been accepted');
        } else {
            if(response2FA.response) {
                let {data:{error}} = response2FA.response;
                errorNoti(error);
            } else {
                errorNoti('Invalid 2FA has been provided');
            }
        }
    } catch(error) {
        errorNoti(error.response);
    }
}

const registerWithEmailPasswordAsync = async (email, password, firstname, lastname, userType) =>
    await axios.post(API_URL + REGISTER_URL, {email, password, firstname, lastname, groups: userType})
        .then(authUser => authUser)
        .catch(error => error);

function* registerWithEmailPassword({payload}) {
    const {email, password, firstname, lastname, userType} = payload.user;
    let {history, callback} = payload;

    try {
        let userGroupID = userTypesToGroups(userType);
        const responseRegisterUser = yield call(registerWithEmailPasswordAsync, email, password, firstname, lastname, userGroupID);
        if (responseRegisterUser && responseRegisterUser.status === 200 && responseRegisterUser.data.Success) {
            callback(null, responseRegisterUser.data);
        } else {
            callback(responseRegisterUser);
        }
    } catch (error) {
        yield put(registerUserError(error));
        callback(error);
    }
}

const verifyEmailAddressThroughKeyAsync = async (key) =>
    await axios.post(API_URL + VERIFY_KEY_URL, {key})
        .then(authUser => authUser)
        .catch(error => error);

function* verifyEmailAddressThroughKey({payload}) {
    let {key, callback} = payload;
    try {
        let responseVerifyEmailAddress = yield call(verifyEmailAddressThroughKeyAsync, key);
        if (responseVerifyEmailAddress && responseVerifyEmailAddress.status === 200 && responseVerifyEmailAddress.data) {
            callback(null, responseVerifyEmailAddress.data);
        } else {
            callback(responseVerifyEmailAddress);
        }
    } catch (error) {
        callback(error);
    }
}

const completeRegistrationRequestAsync = async (userData) =>
    await axios.patch(API_URL + REGISTER_COMPLETE_URL,userData)
        .then(authUser => authUser)
        .catch(error => error);

function* completeRegistrationRequest({payload}) {
    let {userDetails, callback} = payload;
    try {
        let responseCompleteReg = yield call(completeRegistrationRequestAsync, userDetails);
        if (responseCompleteReg && responseCompleteReg.status === 200 && responseCompleteReg.data) {
            callback(null, responseCompleteReg.data);
            let {Success} = responseCompleteReg.data;
            successNoti(Success);
        } else {
            let {response} = responseCompleteReg;
            if(response) {
                let {data:{error}} = response;
                errorNoti(error);
            }
            callback(responseCompleteReg);
        }
    } catch(error) {
        console.log('i am in catch',error);
        callback(error);
    }
}

const logoutAsync = async (history) => {
    await signOut().then(authUser => authUser).catch(error => error);
    history.push('/')
};

function* logout({payload}) {
    const {history} = payload;
    try {
        yield call(logoutAsync, history);
        localStorage.removeItem(process.env.REACT_APP_AUTH_TOKEN);
    } catch (error) {

    }
}

//For Events
function* userLoggedInSuccessfully({payload:{user,history}}) {
    if (user && user.groups) {
        let {groups} = user;

        console.log('groups is ', groups);
        switch (groups[0]) {
            case'Admin':
                window.location.href = process.env.REACT_APP_URL_ADMIN;
                break;
            case 'Agent':
                window.location.assign("/"+URL_PREFIX+"/agent/dashboard");
                break;
            case 'Airline':
                window.location.assign("/"+URL_PREFIX+"/airline/dashboard");
                break;
            default:
                history.push("/");
        }
    }
    const cookies = new Cookies();
    cookies.set('cargobid', user, {path: '/'});
    localStorage.setItem(process.env.REACT_APP_AUTH_TOKEN, JSON.stringify(user));
}

function* userLoginFailed({payload}) {
    let msg = payload.message;
    (msg) ? errorNoti(msg) : errorNoti('Something went wrong while processing your request');
}


export function* watchRegisterUser() {
    yield takeEvery(REGISTER_USER, registerWithEmailPassword);
}

export function* watchLoginUser() {
    yield takeEvery(LOGIN_USER, loginWithEmailPassword);
}

export function* watchLogoutUser() {
    yield takeEvery(LOGOUT_USER, logout);
}

export function* watchLoginUserSuccess() {
    yield takeEvery(LOGIN_USER_SUCCESS, userLoggedInSuccessfully);
}

export function* watchLoginUserError() {
    yield takeEvery(LOGIN_USER_ERROR, userLoginFailed);
}

export function* watchVerifyEmailAddress() {
    yield takeEvery(KEY_VERIFY, verifyEmailAddressThroughKey);
}

export function* watchCompleteRegistrationRequest() {
    yield takeEvery(COMPLETE_REGISTER_REQUEST, completeRegistrationRequest);
}

export function* watch2FALoginVerification() {
    yield takeEvery(LOGIN_2FA_VERIFY, verify2FALogin);
}

export default function* rootSaga() {
    yield all([
        fork(watchLoginUser),
        fork(watchLogoutUser),
        fork(watchRegisterUser),
        fork(watchCompleteRegistrationRequest),
        fork(watchLoginUserSuccess),
        fork(watchLoginUserError),
        fork(watch2FALoginVerification),
        fork(watchVerifyEmailAddress)
    ]);
}