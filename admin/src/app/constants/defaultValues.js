
//URLS
export const REACT_APP_URL_USER = process.env.REACT_APP_URL_USER;
export const AUTH_TOKEN_KEY = process.env.REACT_APP_AUTH_TOKEN;
export const AUTH_COOKIE_NAME = process.env.REACT_APP_AUTH_COOKIE;
export const LOGIN_URL = REACT_APP_URL_USER + '/account/login';

export const URL_PREFIX = 'admin'

export const userTypesToGroups = (userType) => {
    switch(userType) {
        case 'admin':
            return '1';
            break;
        case 'agent':
            return '2';
            break;
        case 'airline':
            return '3';
            break;
        default:
            return false;
    }
};

export const getUserRoleFromGroupID = (groupID) => {
    switch(groupID){
        case 1:
            return 'Admin';
        case 2:
            return 'Agent';
        case 3:
            return 'Airline';
    }
};
