
const DEV_MODE = 1
const PRODUCT_MODE = 2
const CURRENT_MODE = DEV_MODE



class Config {
    constructor() {
        this.config = {}
        this.configReady = false;

        if(CURRENT_MODE==DEV_MODE){            
            this.SERVICE_API_URL = process.env.REACT_APP_API_URL + '/api/';
            this.BACKEND_FILE_URL= "http://192.168.1.19:7000";
            this.STRIPE_PUB_KEY = "pk_test_idlBsrYVebHKxkWFJi85tgLV00owUEtezM"; 
        }
        else if(CURRENT_MODE==PRODUCT_MODE){
            this.SERVICE_API_URL = "http://159.122.201.34:30558"
            this.BACKEND_FILE_URL= "http://159.122.201.34:30558"
            this.STRIPE_PUB_KEY = "pk_live_eoJz8twdr0bjI7kpthxTUILM"; 
        }
        else{

        }
        this.WS_CENTRIFUGO = "ws://192.168.1.14:9000/connection/websocket"
        this.GOOGLE_MAP_API = "https://maps.googleapis.com/maps/api/js?key=AIzaSyAxbKpNVHpiGeaMQPulIu4CESkuScJ5izk&v=3.exp&libraries=geometry,drawing,places"
        this.GOOGLE_PLAY_URL = "https://play.google.com/store/apps/details?id=com.greenbay.sweden";
        this.APPLE_STORE_URL = "https://apps.apple.com/jp/app/greenbay-donation/id1446541224";
        this.STRIPE_PUB_KEY = "pk_live_eoJz8twdr0bjI7kpthxTUILM"; 
        this.PAYPAL_PRODUCT_ID = "pk_test_idlBsrYVebHKxkWFJi85tgLV00owUEtezM";
    }
}

export default (new Config);
