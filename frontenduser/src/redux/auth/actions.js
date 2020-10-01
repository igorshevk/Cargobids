import {
  LOGIN_USER,
  LOGIN_2FA_VERIFY,
  LOGIN_USER_SUCCESS,
  LOGOUT_USER,
  REGISTER_USER,
  REGISTER_USER_SUCCESS,
  COMPLETE_REGISTER_REQUEST,
  LOGIN_USER_ERROR,
  REGISTER_USER_ERROR,
  KEY_VERIFY
} from '../actions';

export const loginUser = (user, history, callback = () => {}) => ({
  type: LOGIN_USER,
  payload: { user, history, callback }
});

export const login2FAVerify = (code2FA, email, id, history={}) => ({
  type: LOGIN_2FA_VERIFY,
  payload: { code2FA, email, id, history}
});

export const loginUserSuccess = (user,history={}) => ({
  type: LOGIN_USER_SUCCESS,
  payload: {user, history}
});
export const loginUserError = (message) => ({
  type: LOGIN_USER_ERROR,
  payload: { message }
});

export const registerUser = (user, history, callback = () => {}) => ({
  type: REGISTER_USER,
  payload: { user, history, callback }
});
export const registerUserSuccess = (user) => ({
  type: REGISTER_USER_SUCCESS,
  payload: user
});
export const registerUserError = (message) => ({
  type: REGISTER_USER_ERROR,
  payload: { message }
});

export const verifyEmailAddress = (key,callback = () => {}) => ({
  type: KEY_VERIFY,
  payload: {key, callback}
});

export const completeRegistrationRequest = (userDetails, callback = () => {}) => ({
  type: COMPLETE_REGISTER_REQUEST,
  payload: {userDetails, callback}
});

export const logoutUser = (history) => ({
  type: LOGOUT_USER,
  payload: { history }
});