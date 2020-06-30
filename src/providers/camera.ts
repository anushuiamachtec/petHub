import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {  ActionSheetController } from '@ionic/angular';
 import {Camera,CameraOptions } from '@ionic-native/camera/ngx';
import { Config } from './Config';
import { CommonHelper } from 'src/providers/helper';

 declare var cordova;
/*
  Generated class for the CameraProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CameraProvider {
  //public camera:Camera,public config:Config,
  constructor(public http: HttpClient,
    public camera:Camera,
    public actionSheetCtrl:ActionSheetController,
    public helper:CommonHelper,
    public config:Config) {
    console.log('Hello CameraProvider Provider');
  }


 

  open(cb){
    this.presentActionSheet(cb)
  }
  async presentActionSheet(cb) {
    const actionSheet = await this.actionSheetCtrl.create({
    header: 'Select type',
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          console.log('Destructive clicked');
        }
      },
      {
        text: 'Camera',
        handler: () => {
          this.openNative(1, cb);
        }
      },
      {
        text: 'Gallery',
        handler: () => {
          this.openNative(0, cb);
        }
      }
    ]
  });
await actionSheet.present();

}


openNative(types,cb){

    const options: CameraOptions = {
                     quality: 50,
                     destinationType: this.camera.DestinationType.DATA_URL,
                     encodingType: this.camera.EncodingType.JPEG,
                     sourceType: types,
                     correctOrientation:true,
                     mediaType: this.camera.MediaType.PICTURE,
                     allowEdit : true

                       }
    this.camera.getPicture(options).then((imageData) => {

    let base64Image = 'data:image/jpeg;base64,' + imageData;
    let data = { image:base64Image,file:this.convertToFile(base64Image) };
    cb(data);
   }, (err) => {
     
     if(err==20 || err=="20"){
       let that = this;
       this.helper.permissionConfirm("Allow "+this.config.getConf('app_name')+" access to your device's photo,media and camera.",function(status){
         if(status){
           cordova.plugins.diagnostic.switchToSettings();
         }
       });
     }
      cb(-1);
   });
}
convertToFile(dataURI){
  let blob=this.dataURItoBlob2(dataURI);
 // let file = new File([blob], 'image.jpeg', {type: "'image/jpeg"});
  return blob;
}

dataURItoBlob(dataURI) {

 // convert base64/URLEncoded data component to raw binary data held in a string
 var byteString;
 if (dataURI.split(',')[0].indexOf('base64') >= 0)
     byteString = atob(dataURI.split(',')[1]);
 else
     byteString = encodeURI(dataURI.split(',')[1]);

 // separate out the mime component
 var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

 // write the bytes of the string to a typed array
 var ia = new Uint8Array(byteString.length);
 for (var i = 0; i < byteString.length; i++) {
     ia[i] = byteString.charCodeAt(i);
 }

 return new Blob([ia], {type:mimeString});
}

dataURItoBlob2(dataURI) {
var byteString = atob(dataURI.split(',')[1]);
var ab = new ArrayBuffer(byteString.length);
var ia = new Uint8Array(ab);
for (var i = 0; i < byteString.length; i++) {
ia[i] = byteString.charCodeAt(i);
}
return new Blob([ab], { type: 'image/jpeg' });
}

}

