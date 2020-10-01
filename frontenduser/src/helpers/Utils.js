import { defaultDirection } from "../constants/defaultValues";

export const mapOrder = (array, order, key) => {
  array.sort(function (a, b) {
    var A = a[key], B = b[key];
    if (order.indexOf(A + "") > order.indexOf(B + "")) {
      return 1;
    } else {
      return -1;
    }
  });
  return array;
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

export const getCurrentTime=()=>{
  const now = new Date();
  return now.getHours() + ":" + now.getMinutes()
}


export const getDirection = () => {
  let direction = defaultDirection;
  if (localStorage.getItem("direction")) {
    const localValue = localStorage.getItem("direction");
    if (localValue === "rtl" || localValue === "ltr") {
      direction = localValue;
    }
  }
  return {
    direction,
    isRtl: direction === "rtl"
  };
};

export const setDirection = localValue => {
  let direction = "ltr";
  if (localValue === "rtl" || localValue === "ltr") {
    direction = localValue;
  }
  localStorage.setItem("direction", direction);
};

export const validateEmail = (mail) => {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail);
};

export const ucFirst = (string) => {
  return string.replace(/^\w/, c => c.toUpperCase());
};

export function setupAxios(axios, store) {
  axios.interceptors.request.use(
      config => {
  /*        const {
          auth: { authToken }
        } = store.getState();

        if (authToken) {
          config.headers.Authorization = `Token ${authToken}`;
        }*/

        console.log('i am just an interceptor in _metronic/utils/utils.js');

        return config;
      },
      err => Promise.reject(err)
  );
}

export function addDaysToDate(date, days){
  let result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function makeDbFormat(obj, fields) {
  fields.map((field) => {
    if(field in obj && obj[field] !== null) {
      if(typeof obj[field].format === 'function')
        obj[field] = obj[field].format('YYYY-MM-DD')
      else if(obj[field] instanceof Date)
        obj[field] = getDateWithFormat(obj[field], 'YYYY-MM-DD');
    }
  })

  return obj;
}


export function sendError(err, errors=[]) {
    if(Object.keys(err).length){
      for (let index in Object.keys(err)) {
        let innerErr = Object.keys(err)[index];
        if(Array.isArray(err[innerErr])) {
          for (let i in err[innerErr]) {
            if(typeof err[innerErr][i] === 'object')
              return this.sendError(err[innerErr][i], errors);
            errors.push(innerErr.charAt(0).toUpperCase() + innerErr.slice(1)+' : '+err[innerErr][i]);
          }
        } else {
          return this.sendError(err[innerErr], errors);
        }
      }
    }
    return errors;
}

function calculateWeight(dimensions) {
  let net_volume = 0;
  if(dimensions.length) {
   dimensions.map((dimension, i) => net_volume += parseFloat(dimension.cbm))
    net_volume =  net_volume / 6000;
  }
  return net_volume;
}

export function getWeight(weight, dimensions) {
  try {
    let calculatedWeight = calculateWeight(JSON.parse(dimensions))
    if(parseFloat(weight) > calculatedWeight)
      return parseFloat(weight).toFixed(2)
    else
      return parseFloat(calculatedWeight).toFixed(2)
  } catch {
    return parseFloat(weight).toFixed(2)
  }
}

