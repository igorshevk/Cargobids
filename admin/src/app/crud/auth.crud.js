import axios from "axios";
import {useHistory} from "react-router-dom";
import {AUTH_COOKIE_NAME, AUTH_TOKEN_KEY} from "../constants/defaultValues";
import Cookies from "universal-cookie";



export const API_URL = process.env.REACT_APP_API_URL + "/api/";
export const LOGIN_URL = API_URL + "login";
export const REGISTER_URL = API_URL + "register";
export const LOGOUT_URL = API_URL + "logout";
export const REQUEST_TOKEN_URL = API_URL + "authenticate";
export const REQUEST_PASSWORD_URL = API_URL + "reset/request";
export const RESET_PASSWORD_URL = API_URL + "users/resetPassword";
export const ME_URL = process.env.REACT_APP_API_URL + "/api/users/me/";


export function login(email, password) {
  return axios.post(LOGIN_URL, { email, password });
}

export function logout() {
  return axios.post(LOGOUT_URL);
}

export function register(email, fullname, username, password) {
  return axios.post(REGISTER_URL, { email, fullname, username, password });
}

export function requestPassword(email) {
  return axios.post(REQUEST_PASSWORD_URL, { email });
}

export function resetPasword(email, password, c_password, key) {
  return axios.post(RESET_PASSWORD_URL, { email, password, c_password, key });
}

export function requestToken(key, id, email) {
  return axios.post(REQUEST_TOKEN_URL, { key, id, email });
}

export function getUserByToken() {
  return axios.get(ME_URL);
}

export async function logoutUser(sendLogoutAjax=true) {
  if(sendLogoutAjax)
    logout().then(response => removeStorageItems()).catch(e => removeStorageItems());
  else
    removeStorageItems()
  return true;
}

function removeStorageItems() {

  localStorage.removeItem('persist:cargobid-auth');

  localStorage.removeItem('persist:'+AUTH_TOKEN_KEY);
  const cookies = new Cookies();
  cookies.remove(AUTH_COOKIE_NAME);
}