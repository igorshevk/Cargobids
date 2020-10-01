import axios from "axios";
import {ME_URL} from "./auth.crud";
import {AUTH_TOKEN_KEY} from "../constants/defaultValues";
export const API_URL = process.env.REACT_APP_API_URL+'/api/';

//Headers
export const headers = {
    "Accept": "application/json",
    'Content-Type': 'application/json',
    'Authorization': 'Token '+ getToken()
};

export function getToken() {
    let token = null,
        cargoBidToken = localStorage.getItem('persist:'+AUTH_TOKEN_KEY);
    if(cargoBidToken) {
        token = JSON.parse(cargoBidToken).authToken;
        if(token)
            token = token.replace(/['"]+/g, '');
    }
    return token;
}

export function getAuthToken() {
    let cargoBidToken = localStorage.getItem('persist:'+AUTH_TOKEN_KEY);
    return (cargoBidToken? JSON.parse(cargoBidToken):null);
}

export const getUserByToken = async () =>
    await axios.get(ME_URL,{headers})
        .then(res=>res)
        .catch(error=>error);

export function setLocalStorageUser(user) {
    if(localStorage.getItem('persist:cargobid-auth') != null) {
        let data = JSON.parse(localStorage.getItem('persist:cargobid-auth'));
        data.user = JSON.stringify(user);
        localStorage.setItem('persist:cargobid-auth', JSON.stringify(user));
    }
}

export function userHasPermission(permission) {
    if(localStorage.getItem('persist:demo1-auth') != null) {
        let user = JSON.parse(localStorage.getItem('persist:demo1-auth')).user;
        if(user != undefined){
            user = JSON.parse(user);
            if(user.group_name.toLowerCase() == "admin")
                return true;

            if(Array.isArray(permission)){
                for(let i in permission) {
                    if(user.permissions.indexOf(permission[i]) > -1)
                        return true;
                    else if(user.group_permissions.indexOf(permission[i]) > -1)
                        return true;
                }
            } else {
                if(user.permissions.indexOf(permission) > -1)
                    return true;
                else if(user.group_permissions.indexOf(permission) > -1)
                    return true;
            }
        }
    }
    return false;
}

export function get(endpoint, params={}) {
    let config = {
        headers: headers,
        params: params,
    };
    return axios.get(API_URL+endpoint, config).then(response => {
        if(response.data.results) {
            // pagination response handling there :)
            response.extra_data = {
                count : response.data.count,
                next : response.data.next,
                previous : response.data.previous,
            };
            response.data = response.data.results;
        }
        return response;
    })
}

export function patch(endpoint, data) {
    let config = {
        headers: headers,
    };
    return axios.patch(API_URL+endpoint, data, config)
}

export function post(endpoint, data) {
    let config = {
        headers,
    };
    return axios.post(API_URL+endpoint, data, config)
}

export function del(endpoint, data={}) {
    let config = {
        headers: headers,
        data: data,
    };
    return axios.delete(API_URL+endpoint, config)
}


export async function importData(data, cols, model) {
    let config = {
        headers, data, cols, model
    };
    return await axios.post(API_URL+'import_data', config);
}


export const AIRLINE_MODES = [
    {label:'Airline', value:'Airline'},
    {label:'GSA', value:'GSA'},
]

export const PAYMENT_TYPES = [
    {label:'Stripe', value:'Stripe'},
    {label:'Bank Transfer', value:'Bank Transfer'},
]

export const YES_NO = [
    {label:'Yes', value:'Yes'},
    {label:'No', value:'No'},
]

export const sleep = ms =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, ms);
});

export const loadOptions = async (search, prevOptions, options, modelsLoaded) => {
    // let's sleep unless models data loaded
    
    await sleep(100);
    console.log('options are ', options);
    /*do {
        await sleep(100);
    } while (!modelsLoaded)*/

    let filteredOptions;
    if (!search) {
        filteredOptions = options;
     } else {
        const searchLower = search.toLowerCase();

    filteredOptions = options.filter(({ label }) =>
          label.toLowerCase().includes(searchLower)
        );
      }

    const hasMore = filteredOptions.length > prevOptions.length + 10;
    const slicedOptions = filteredOptions.slice(
      prevOptions.length,
      prevOptions.length + 10
    );

    return {
      options: slicedOptions,
      hasMore
    };
};