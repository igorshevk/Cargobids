import Config from "../config";
import * as _ from 'lodash'
import $ from 'jquery';

import Cookies from 'universal-cookie';
import {getToken} from '../helpers/API'
import { signOut  } from "../helpers/Auth";

export default {
  async baseApi(sub_url, method, json_data, cb, tokenRequired=true) {
      // let user = localStorage.currentUser?JSON.parse(localStorage.currentUser):null
    // let user = JSON.parseocalStorage.get('cargobid-auth')
    try {
      let request = {
        method,
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        }
      };

      if(tokenRequired == true)
        request.headers['Authorization'] = "Token " + getToken();

      if (method == "POST" || method == "PUT" || method == "PATCH") {
        console.log("just before:",json_data)
        request["body"] = JSON.stringify(json_data);
      }
      let response = await fetch(Config.SERVICE_API_URL + sub_url, request);
      let responseJson = await response.json();
      if (response.status == 200) {
        cb(null, responseJson);
      } else {
        cb(responseJson);
      }
    } catch (error) {
      cb(error);
    }
  },

  async init(cb) {
    //check if current user exists or not
    var email = localStorage.email
    var password = localStorage.password

    if (password) {
      this.login(email, password, (err, user) => {
        cb(err, user)
      })
    } else {
      cb(null)
    }
  },

  login(email, password, cb) {
    this.baseApi('login', 'POST', { email, password }, (err, res) => {
      if (err == null && res.token) {
/*        const cookies = new Cookies();
        cookies.set('cargobid', res, { path: '/' });
        localStorage.currentUser = JSON.stringify(res);*/
        // localStorage.email=email
        // localStorage.password=password;
      }
      cb(err, res)
    })
  },
  register(data, cb) {
    this.baseApi('/register', 'POST', data, (err, res) => {
      cb(err, res)
    })
  },
  verifyEmailRequest(data, cb) {
    console.log('data on email requestxx',data)
    this.baseApi('/api/request/email', 'POST', data, (err, res) => {
      cb(err, res)
    })
  },
  smsVerifyRequest(data, cb) {
    this.baseApi('/api/request/sms', 'POST', data, (err, res) => {
      cb(err, res)
    })
  },
  emailVerify(data, cb) {
    console.log('data for verify-',data)
    this.baseApi('/api/verify/email', 'POST', data, (err, res) => {
      cb(err, res)
    })
  },
  smsVerify(data, cb) {
    this.baseApi('/api/verify/sms', 'POST', data, (err, res) => {
      cb(err, res)
    })
  },
  getContacts(cb) {
    this.baseApi('/front/user/getchatcontacts', 'GET', {}, (err, res) => {
      cb(err, res)
    })
  },

  async logout() {
    await signOut()
    .then( res => {
      localStorage.removeItem('persist:cargobid-auth')
      delete localStorage.email
      delete localStorage.password
    })
    .catch(error => console.log(err));
  },


  uploadFile(file, callback, ext, progressCallback) {
    var obj = {
        _filename: file.name,
        size: file.size,
        mimeType: file.type
    };

    if (ext) {
        _.extend(obj, ext);
    }

    var formData = new FormData();
    formData.append('file', file)
    formData.append('filename', file.name)
    formData.append('size', file.size)
    formData.append('mimeType', file.type)

    //console.log('uploading data is ', formData);
    $.ajax({
        url: Config.BACKEND_FILE_URL + "/api/fileUpload",
        data: formData,
        method: 'post',
        xhr: function () {
            var myXhr = $.ajaxSettings.xhr();
            if (myXhr.upload) {
                myXhr.upload.addEventListener('progress', function (e) {
                    console.log('here', e)
                    if (e.lengthComputable) {
                        var max = e.total;
                        var current = e.loaded;

                        if (progressCallback) {
                            progressCallback(max, current)
                        }
                    }
                }, false);
            }
            return myXhr;
        },
        cache: false,
        contentType: false,
        processData: false,
        headers: {
            Authorization: 'Basic ' + localStorage.token
        },
        success: function (data) {
            if (data) {
                callback(data);
            } else {
                callback('empty data')
            }
        },
        error: function (data) {
            callback(data)
        }
    });
},



  async chatFileUpload(file, cb) {
    try {
      let formData = new FormData();
      formData.append("file", file);

      let response = await fetch(
        Config.BACKEND_FILE_URL + '/api/fileUpload',
        {
          method: "POST",
          // headers: {
          //   Accept: "application/json",
          //   "Content-Type": "multipart/form-data"
          // },
          body: formData
        }
      );
      let status = response.status;
     // console.log('status', status)

      let responseJson = await response.json();
     // console.log('respo', responseJson)
      if (status == 200 || status == 201) {
        cb(null, responseJson);
      } else {
        cb(responseJson.message);
      }
    } catch (error) {
      cb(error);
    }

  },
  async uploadImage(file, cb) {
    let user = localStorage.currentUser?JSON.parse(localStorage.currentUser):null
    try {
      let image={
        _filename: file.name,
        size: file.size,
        mimeType: file.type,
        uri: file.preview,
        type: file.type,
        name: file.name
      }
      let formData = new FormData();
      formData.append("file", image);
      let response = await fetch(
        Config.SERVICE_API_URL + '/api/fileUpload',
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
            "Authorization": user
            ? "Bearer " + user['access_token']
            : null,
          },
          body: formData
        }
      );
      let status = response.status;
      console.log('status', status)

      let responseJson = await response.json();
      console.log('respo', responseJson)
      if (status == 200 || status == 201) {
        cb(null, responseJson);
      } else {
        cb(responseJson.message);
      }
    } catch (error) {
      cb(error);
    }
  },
  getUsers(cb){
    this.baseApi('/api/users', 'GET', {}, cb)
  },
  getFamilyFriend(id, groupId, cb) {
    console.log('id,groupID on getFamilyFriend', id,groupId)
    if (groupId == 1 || groupId == 2) {
      this.baseApi(`/api/users/groups/${id}?group_id=` + groupId, 'GET', {}, cb)
    } else {
      this.baseApi(`/api/users/groups/${id}`, 'GET', {}, cb)
    }
  },
  getProjects(cb) {
    this.baseApi('/api/projects', 'GET', {}, cb)
  },
  getProject(id, cb){
    this.baseApi('/api/projects/'+id, 'GET', {}, cb)
  },
  setProject(data, cb){
    this.baseApi('/api/projects', 'POST', data, cb)
  },
  createPaypalPayment(data, cb) {
    this.baseApi('/api/createPaypalPayment', 'POST', data, cb)
  },
  executePaypalPayment(data, cb) {
    this.baseApi('/api/executePaypalPayment', 'POST', data, cb)
  },
  getProjectTypes(cb) {
    this.baseApi('/api/projectTypes', 'GET', {}, cb)
  },
  getProjectTypeById(id, cb) {
    this.baseApi(`/api/projectTypes/${id}`, 'GET', {}, cb)
  },
  getCurrencies(cb) {
    this.baseApi('/api/currencies', 'GET', {}, cb)
  },
  donates(data, cb){
      this.baseApi('/api/donates', 'POST', {data}, cb)
  },
  activate(token, cb){
      this.baseApi('/api/activate/'+token, 'GET', {}, cb)
  },
  getMyWallet(cb){
    this.baseApi('/api/myWallet', 'GET', {}, cb)
  },
  getHistory(cb){
    this.baseApi('/api/userDonates', 'GET', {}, cb)
  },
  chargeStripe(data, cb){
    this.baseApi('/api/web/chargeStripe', 'POST', data, cb)
  },
  getTransactions(data, cb) {
    console.log('from,to--',data.from,data.to)
    this.baseApi('/api/transactions?pageNum=' + 1 + '&pageSize=' + 20 + '&from='+data.from + '&to='+data.to, 'GET', {}, cb)
  },
  calcFee(data, cb){
    this.baseApi('/api/calcFee', 'POST', data, cb)
  },
  transfer(data, cb){
    console.log('data on transfer api--',data)
    this.baseApi('/api/transfer', 'POST', data, cb)
  },
  forgotPassword(data, cb){
    this.baseApi('reset/request', 'POST', data, cb, false)
  },
  getExchangeRate(base, cb) {
    this.baseApi(`/api/currencies/rates/${base}`, 'GET', {}, cb)
  },
  resetPassword(data, cb){
    this.baseApi('users/resetPassword', 'POST', data, cb, false)
  },
  updateUser(data, cb){
    this.baseApi('/api/users/me', 'POST', {data}, cb)
  },
  requestWithdraw(data, cb) {
    this.baseApi('/api/requestWithdraw', 'POST', data, cb)
  },
  paymentDetails(data, cb){
    this.baseApi('paymentDetails', 'POST', data, cb)
  },
  isSubscribed(data, cb){
    this.baseApi('users/isSubscribed', 'GET', data, cb)
  },
  plansList(data, cb){
    this.baseApi('allplans', 'GET', data, cb)
  },
  customer(data, cb){
    this.baseApi('customer', 'POST', data, cb)
  },
  cancelsubscriptions(data, cb){
    this.baseApi('cancelsubscriptions', 'POST', data, cb)
  },
  getCurrentUser(data, cb){
    this.baseApi('users/me', 'GET',  data, cb)
  },
  subscriptions(data, cb){
    this.baseApi('subscriptions', 'GET', data, cb)
  },
  createQuote(data, cb){
    this.baseApi('quotes', 'POST', data, cb)
  },
  getAirports(data, cb){
    this.baseApi('airports', 'GET',  'data', cb)
  },
  getAirport(code, cb){
    this.baseApi('airports/'+code+'/', 'GET',  'data', cb)
  },
  getQuote(id, cb){
    this.baseApi('quotes/'+id, 'GET',  'data', cb)
  },

  updateQuote(data, cb){
    this.baseApi('quotes/'+data.slug+'/', 'PUT',  data, cb)
  },
  publishQuote(data, cb){
    this.baseApi('quotes/'+data.slug+'/', 'PATCH',  data, cb)
  },
  closeQuote(data, cb){
    this.baseApi('quotes/'+data.slug+'/', 'PATCH',  data, cb)
  },
  updateQuoteCount(data, cb){
    this.baseApi('quotes/'+data.slug+'/', 'PATCH',  data, cb)
  },

  list(method, params, cb){
    let query = Object.keys(params)
             .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
             .join('&');
    this.baseApi(method+'?'+query, 'GET', '', cb)
  },

  delete(url, cb){
    this.baseApi(url, 'DELETE', '', cb)
  },

  createBid(data, cb){
    this.baseApi('bids', 'POST', data, cb)
  },

  getBid(id, cb){
    this.baseApi('bids/'+id, 'GET',  'data', cb)
  },

   getBidSummary(id, cb){
    this.baseApi('bids/'+id+'/sm/', 'GET',  'data', cb)
  },

   updateBid(data, cb){
    this.baseApi('bids/'+data.id+'/', 'PUT',  data, cb)
  },

   publishBid(data, cb){
    this.baseApi('bids/'+data.id+'/', 'PATCH',  data, cb)
  },

  patch(url, data, cb){
    this.baseApi(url, 'PATCH',  data, cb)
  },

  post(url, data, cb){
    this.baseApi(url, 'POST',  data, cb)
  },

  async activateTrial(data, cb){
    let request = {
        method:'POST',
        body: JSON.stringify(data),
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        }
      };
     let response = await fetch(Config.SERVICE_API_URL + 'activate-trial', request);
      let responseJson = await response.json();
      if (response.status == 200) {
        cb(responseJson);
      } else {
        cb(responseJson);
      }
  },
};
