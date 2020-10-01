import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import * as auth from "../store/ducks/auth.duck";
import { login, ME_URL } from "../crud/auth.crud";
import {getToken, getUserByToken} from "../crud/api";
import Cookies from "universal-cookie";
import { useHistory } from "react-router-dom";
import axios from "axios";
import {hasValidAuthToken} from './commons';
import {AUTH_COOKIE_NAME, AUTH_TOKEN_KEY} from '../constants/defaultValues';




function logTheUserIn({props,cargoBidCookie,isSynced,cookies,cargoBidToken}) {
    getUserByToken()
        .then(res=>{
            let {response, data} = res;
            if(data) {
                //As we have active token available, Check if user is properly loggedIn or not, i-e if we have proper localstorage value set
                // if(!hasValidAuthToken()) {
                    props.login(cargoBidToken);
                // }
            } else if (response) {
                console.log(' i am in else');
                let {status, data} = response;


                console.log('show the damn response',response);

                if(status === 401 && data && data.detail && data.detail === 'Invalid token.' && !isSynced) {
                    localStorage.removeItem('persist:'+AUTH_TOKEN_KEY);
                    //Tokens seems to be failed.
                    //Check if we have Cookie with updated Token.
                    if(cargoBidCookie && !isSynced) {
                        if(cargoBidCookie.token && cargoBidToken !== cargoBidCookie.token) {
                            //Try to login with Cookie.
                            props.login(cargoBidCookie.token);
                        } else if(cargoBidCookie.token) {
                            cookies.remove(AUTH_COOKIE_NAME); //remove the Invalid Cookie.
                        }
                    }
                }



            }
        })
        .catch(error=>{
            let {response, status} = error;

            console.log('response error in AuthSync.js', error);

            if(response && status === 401) { //Un-Authorized
                console.log('response error 2 in AuthSync.js',response);
            }
        });
}

const loginWithCookie = async ({cookieToken,props}) =>
    await props.login(cookieToken);


/**
 * @return {boolean}
 */
function AuthSync(props) {
    const [isSynced, setIsSynced] = useState(null);
    const history = useHistory();
    console.log('the props',history);

    useEffect(() => {

        //TODO:should implement interceptors.
        axios.interceptors.request.use(config => {
            // perform a task before the request is sent
            console.log('Request was sent',config);

            return config;
        }, error => {
            // handle the error
            return Promise.reject(error);
        });



        if(!isSynced) {

            let CookieLogin = true;
            let cargoBidToken = getToken();
            let hasValidAuthTokenVar = hasValidAuthToken({history});
            const cookies = new Cookies();
            let cargoBidCookie = cookies.get(AUTH_COOKIE_NAME);


            console.log('hasValidAuthToken',hasValidAuthTokenVar);
            console.log('cargoBidCookie',cargoBidCookie);
            console.log('cargoBidToken',cargoBidToken);

            //If First Login then no CargoBid Token Exists, check for cookie.
            if(!hasValidAuthTokenVar && cargoBidCookie && cargoBidCookie.token && CookieLogin) {
                loginWithCookie({cookieToken:cargoBidCookie.token,props});
                cookies.remove(AUTH_COOKIE_NAME);
                CookieLogin = false;
            }

            /*if(!hasValidAuthTokenVar && !CookieLogin) {
                logTheUserIn({props,cargoBidCookie,isSynced,cookies,cargoBidToken});
            }*/

            setIsSynced(true);
        }

    },[]);


    return !!isSynced;
}

export default injectIntl(
    connect(
        null,
        auth.actions
    )(AuthSync)
);