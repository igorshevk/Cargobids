import axios from "axios";
import { getConfig } from "./API"

//URL's
export const API_URL = process.env.REACT_APP_API_URL + "/api/";
export const LOGIN_URL = "login";
export const REGISTER_URL = "registrations";
export const REGISTER_COMPLETE_URL = "account/complete";
export const REQUEST_PASSWORD_URL = "forgot-password";
export const VERIFY_KEY_URL = "activations";
export const VERIFY_2FA_CODE = "authenticate";
export const ME_URL = "users/me/";
export const Question_URL = API_URL + "questions";

export function login(email, password) {
  return axios.post(API_URL + LOGIN_URL, { email, password });
}

export function register(email, fullname, username, password) {
  console.log("regster url is ", REGISTER_URL);
  return axios.post(REGISTER_URL, { email, fullname, username, password });
}

export function requestPassword(email) {
  return axios.post(REQUEST_PASSWORD_URL, { email });
}

export function getUserByToken() {
  return axios.get(API_URL + ME_URL);
}

export function signOut() {
  let config = getConfig()
  return axios.post(API_URL + "logout", null, config)
}
