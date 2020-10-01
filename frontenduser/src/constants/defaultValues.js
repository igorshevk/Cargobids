/* 
Menu Types:
"menu-default", "menu-sub-hidden", "menu-hidden"
*/
export const defaultMenuType = "menu-default";

export const subHiddenBreakpoint = 1440;
export const menuHiddenBreakpoint = 768;
export const defaultLocale = "en";

export const URL_PREFIX  = 'cb'

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
export const localeOptions = [
  { id: "en", name: "English - LTR", direction: "ltr" },
  { id: "es", name: "Español", direction: "ltr" },
  { id: "enrtl", name: "English - RTL", direction: "rtl" }
];

export const searchPath = "/app/pages/search";
export const servicePath = "https://api.coloredstrategies.com";

export const firebaseConfig = {
  apiKey: "AIzaSyA_xFizfLj8TBXKvUOlocpf65mDYAq-V5w",
  authDomain: "takechangenxt.firebaseapp.com",
  databaseURL: "https://takechangenxt.firebaseio.com",
  projectId: "takechangenxt",
  storageBucket: "takechangenxt.appspot.com",
  messagingSenderId: "7587766266",
  appId: "1:7587766266:web:609c57b880bc7ad186ce43",
  measurementId: "G-ENQGH65NRN"
};
/* 
Color Options:
"light.purple", "light.blue", "light.green", "light.orange", "light.red", "dark.purple", "dark.blue", "dark.green", "dark.orange", "dark.red"
*/
export const themeColorStorageKey="__theme_color"
export const isMultiColorActive = true;
export const isDarkSwitchActive = true;
export const defaultColor = "light.orange";
export const defaultDirection = "ltr";
export const themeRadiusStorageKey = "__theme_radius";
export const isDemo = true;