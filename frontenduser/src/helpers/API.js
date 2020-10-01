


import api from "../services/api";
import $ from "jquery";
import { API_URL } from "./Auth";

// export function getToken2() {
//     let token = null;
//     if (localStorage.getItem('persist:cargobid-auth') != null) {
//         token = JSON.parse(localStorage.getItem('persist:cargobid-auth')).token;
//         if (token)
//             token = token.replace(/['"]+/g, '');
//     } else {
//         return null;
//     }
//     // check if this token is valid
//     let config = {
//         headers: {
//             Authorization: "token " + token
//         }
//     }
//     $.ajax({
//         type: "POST",
//         url: API_URL + "check_login",
//         headers: config.headers,
//         async: false,
//         error: function (xhr, status, error) {
//             if (xhr.status === 401) {
//                 localStorage.removeItem('persist:cargobid-auth');
//                 window.location.href = "/cb/landing";
//             } else {
//                 token = token;
//             }

//         },
//         success: function (result, status, xhr) {
//             token = token;
//         }
//     });
//     return token;
// }

export function getToken() {
    let token = null;

    if(localStorage.getItem('persist:cargobid-auth') != null) {
        token = JSON.parse(localStorage.getItem('persist:cargobid-auth')).token;
        if(token)
            token = token.replace(/['"]+/g, '');
    }

    return token;
}

export function getConfig(forAuth) {
    let token = getToken();
    if (forAuth){
        return token;
    }
    let config = {
        headers: {
            Authorization: "token " + token
        }
    }
    return config;
}

export function getUser() {
    let user = null;
     user = JSON.parse(localStorage.getItem('persist:cargobid-auth'));
        if(user)
            user = user;
    return user;
}


export function isAgent() {
    let user = null;
    user = JSON.parse(localStorage.getItem('persist:cargobid-auth'));
        if(user && user.groups !== undefined && user.groups.indexOf('Agent') > -1)
            return true;
    return false;
}

export function isAirline() {
    let user = null;
     user = JSON.parse(localStorage.getItem('persist:cargobid-auth'));
        if(user && user.groups !== undefined && user.groups.indexOf('Airline') > -1)
            return true;
    return false;
}

export function isLoggedIn() {
    let user = null;
    // user = JSON.parse(localStorage.getItem('persist:cargobid-auth'));
    // console.log("user : ",user)
    // debugger
    // console.log(user ,user.groups !== undefined, user.groups.indexOf('Agent') > -1)
    // debugger
    let status = false;
        user = JSON.parse(localStorage.getItem('persist:cargobid-auth'));
            if(user)
                status = true;
    return status;
}

export function isSubscribed() {
    let isSubscribed = false;
    let user = JSON.parse(localStorage.getItem('persist:cargobid-auth'));
    if(user && user.subscription !== null)
        isSubscribed = true;
   return isSubscribed;
}

export function isShowWelcome() {
    let isShowWelcome = false;
    let user = JSON.parse(localStorage.getItem('persist:cargobid-auth'));
    if(user.subscription.is_confirmed === false && user.plan !== undefined && user.plan != 'Trial')
        isShowWelcome = true;
   return isShowWelcome;
}


export function setLocalStorageUser(user) {
    localStorage.setItem('persist:cargobid-auth', JSON.stringify(user));
}

export function updateUser(props) {
      api.getCurrentUser('',(err, response)=>{
        console.log('err ', err);
        if(response === undefined) {
            props.history.push('/cb/account/login');
            localStorage.removeItem('persist:cargobid-auth')
        } else {
            response.user_id = response.id;
            localStorage.setItem('persist:cargobid-auth', JSON.stringify(response));
            let redirect = localStorage.getItem("redirect");
            if (redirect ) {
                window.location.href = redirect;
            }
        }
      });
    }


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

export const DROPDOWN_WAIT = 2000

export const STATUS_CHOICES= [
    {'value':'OPEN', 'label':"Open"},
    {'value':'CLOSED', 'label':"Closed"},
]

export const TYPES= [
    {'value':'AH', 'label':"Spot"},
    {'value':'RT', 'label':"Regular Traffic"},
]

export const ORIGIN_CHOICES= [
    {'value':'AOI', 'label':"AOI"},
    {'value':'BLQ', 'label':"BLQ"},
    {'value':'BRI', 'label':"BRI"},
    {'value':'CTA', 'label':"CTA"},
    {'value':'FCO', 'label':"FCO"},
    {'value':'FLR', 'label':"FLR"},
    {'value':'GOA', 'label':"GOA"},
    {'value':'MIL', 'label':"MIL"},
    {'value':'MXP', 'label':"MXP"},
    {'value':'NAP', 'label':"NAP"},
    {'value':'PSA', 'label':"PSA"},
    {'value':'TRN', 'label':"TRN"},
    {'value':'VCE', 'label':"VCE"},
    {'value':'VRN', 'label':"VRN"},
]

export const AREA_CHOICES= [
    {'value':'AF', 'label':"Africa"},
    {'value':'CA','label':'Central America'},
    {'value':'EU', 'label':"Europe"},
    {'value':'FE', 'label':"Far East"},
    {'value':'IN', 'label':"Indian SC"},
    {'value':'ME', 'label':"Middle East"},
    {'value':'AU', 'label':"Oceania"},
    {'value':'NA', 'label':"North America"},
    {'value':'RU', 'label':"Russia & Caspian"},
    {'value':'SA', 'label':"South America"},
]

export const All_IN= [
    {'value':'ALLIN', 'label':"ALLIN"},
    {'value':'SC', 'label':"SURCHARGES"},
]

export const CONDITIONS_CHOICES= [
    {'value':'ANY', 'label':"Qualsiasi Volo"},
    {'value':'SF', 'label':"Volo Specifico"},
    {'value':'SP', 'label':"Periodo Limitato"},
    {'value':'LP', 'label':"Periodo Specifico"},
    {'value':'SD', 'label':"Data Specifica"},
]
export const TYPES_CHOICES= [
    {'value':'AH', 'label':"Spot"},
    {'value':'RT', 'label':"Regular Traffic"},
]
export const PAYMENT_TYPES= [
    {'value':'Stripe', 'label':"Stripe"},
    {'value':'Bank Transfer', 'label':"Bank Transfer"},
]
export const PLAN_IDS= {
    "Basic":1,
    "Premium":2,
}
export const PLAN_DURATIONS= {
    "1 Month":1,
    "3 Months":3,
    "6 Months":6
}

