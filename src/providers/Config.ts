import {Injectable} from '@angular/core';
// import {Storage} from '@ionic/storage';
// import {NavController, ActionSheetController} from 'ionic-angular';

@Injectable()
export class Config {
  static conf = {
    url:"http://52.66.252.162:3000/api/",
    img_url:"https://52.66.252.162:3000/",
    socket_url:"http://52.66.252.162:3000/",
    isOnline: 1,
    app_name: 'MyApp',
  };

  static nav = {};

  constructor() {
  }

  getConf(key) {
    let val = Config.conf[key];
    if (val != undefined)
      return Config.conf[key];
    else
      return "";
  }

  setConf(k, v) {
    if (k != "")
      Config.conf[k] = v;
  }
  getNav(key) {
    let val = Config.nav[key];
    if (val != undefined){
       const data = Config.nav[key];
       delete Config.nav[key];
       return data;
    }else{
      return "";
    }
  }
  setNav(k, v) {
    if (k != "")
      Config.nav[k] = v;
  }


}
