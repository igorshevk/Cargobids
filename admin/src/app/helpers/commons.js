import {API_URL, headers, getAuthToken} from '../crud/api';
import axios from "axios";
import {getUserByToken,logoutUser} from '../crud/auth.crud';
import {AUTH_TOKEN_KEY, LOGIN_URL} from "../constants/defaultValues";
import XLSX from 'xlsx';


export const getRoles = async () =>
    await axios.get(API_URL + 'groups',{headers})
    .then(({data:{results}})=>results)
    .catch(error=>error);


export const getAgents = async () =>
    await axios.get(API_URL + 'agents',{headers})
        .then(({data:{results}})=>results)
        .catch(error=>error);

export const getAirlines = async () =>
    await axios.get(API_URL + 'airlines',{headers})
        .then(({data:{results}})=>results)
        .catch(error=>error);

export function hasValidAuthToken({history},validateAuthTokenClientOnly=false) {
    let authTokenJSON = getAuthToken();
    if(!authTokenJSON)
        return false;

    let {user, authToken} = authTokenJSON;
    //If No User or no Auth Token Exist, then its not a valid Auth Token.

    if(!user || !authToken) {
        localStorage.removeItem('persist:'+AUTH_TOKEN_KEY);
        return false;
    }


    //Now if we are here, seems like we have valid localstorage. Just check if token inside is valid or not.
    getUserByToken().then(res=>{
        console.log('response promise', res);
    })
        .catch(error=>{
            let {response} = error;
            if(response && response.status === 401 && response.data && response.data.detail === 'Invalid token.') {
                logoutUser(false)
                    .then(res=>{
                        window.location.assign(LOGIN_URL);
                    });
            }
        });
}

export const validateEmail = (mail) => {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail);
};

export const ucFirst = (string) => {
    return string.replace(/^\w/, c => c.toUpperCase());
};

export const formatBytes = (a,b) =>
{if(0==a)return"0 Bytes";var c=1024,d=b||2,e=["Bytes","KB","MB","GB","TB","PB","EB","ZB","YB"],f=Math.floor(Math.log(a)/Math.log(c));return parseFloat((a/Math.pow(c,f)).toFixed(d))+" "+e[f]};

/* generate an array of column objects */
export const make_cols = refstr => {
    let o = [], C = XLSX.utils.decode_range(refstr).e.c + 1;
    for(var i = 0; i < C; ++i) o[i] = {name:XLSX.utils.encode_col(i), key:i}
    return o;
};


export const getDateWithFormat = (date=null, format=null) => {
  if(date === null)
    date = new Date();

  let dd = date.getDate();
  let mm = date.getMonth() + 1; //January is 0!

  var yyyy = date.getFullYear();
  if (dd < 10) {
    dd = '0' + dd;
  }
  if (mm < 10) {
    mm = '0' + mm;
  }
  if(format === 'YYYY-MM-DD')
    return yyyy+'-'+mm+'-'+dd;
  else if(format === 'DD-MM-YY')
    return dd+'-'+mm+'-'+yyyy;
  // else if(format === 'DD-MM-YY')
  //   return dd+'-'+mm+'-'+yyyy.toString().substr(-2);

  return dd + '-' + mm + '-' + yyyy;

}

/*
export const getDateWithFormat = (date=null, format=null) => {

  let yyyy='', mm='', dd='';
  if(date != null) {
    if(date.indexOf('T') > -1) {
      date = (date.split('T')[0]).split('-')
      yyyy = date[0];
      mm = date[1];
      dd = date[2];
    }
  } else {
    date = new Date();
    dd = date.getDate();
    mm = date.getMonth() + 1; //January is 0!
    yyyy = date.getFullYear();
    if (dd < 10) {
      dd = '0' + dd;
    }
    if (mm < 10) {
      mm = '0' + mm;
    }
  }
  if(format === 'YYYY-MM-DD')
    return yyyy+'-'+mm+'-'+dd;
  else if(format === 'DD-MM-YY')
    return dd+'-'+mm+'-'+yyyy;
  // else if(format === 'DD-MM-YY')
  //   return dd+'-'+mm+'-'+yyyy.toString().substr(-2);

  return dd + '-' + mm + '-' + yyyy;

}*/


export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}