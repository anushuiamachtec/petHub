import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';

declare var cordova;

@Injectable()
export class PermissionsService {

  constructor(
    public _platform: Platform,
    public _Diagnostic: Diagnostic
  ) {
  }

  isAndroid() {
    return this._platform.is('android')
  }

  isiOS() {
    return this._platform.is('ios');
  }

  isUndefined(type) {
    return typeof type === "undefined";
  }

  pluginsAreAvailable() {
    return !this.isUndefined(cordova.plugins);
  }


  checkCameraPermissions(): Promise<boolean> {
    return new Promise(resolve => {
      if (!this.pluginsAreAvailable()) {
        alert('Dev: Camera plugin unavailable.');
        resolve(false);
      }
      else if (this.isiOS()) {
        this._Diagnostic.getCameraAuthorizationStatus().then(status => {
          if (status == this._Diagnostic.permissionStatus.GRANTED) {
            resolve(true);
          }
          else if (status == this._Diagnostic.permissionStatus.DENIED) {
            resolve(false);
          }
          else if (status == this._Diagnostic.permissionStatus.NOT_REQUESTED || status.toLowerCase() == 'not_determined') {
            this._Diagnostic.requestCameraAuthorization().then(authorisation => {
              resolve(authorisation == this._Diagnostic.permissionStatus.GRANTED);
            });
          }
        });
      }
      else if (this.isAndroid()) {
        this._Diagnostic.isCameraAuthorized().then(authorised => {
          if (authorised) {
            resolve(true);
          }
          else {
            this._Diagnostic.requestCameraAuthorization().then(authorisation => {
              resolve(authorisation == this._Diagnostic.permissionStatus.GRANTED);
            });
          }
        });
      }
    });
  }


  checkMicroPermissions(): Promise<boolean> {
    return new Promise(resolve => {
      if (!this.pluginsAreAvailable()) {
        alert('Dev: Microphone plugin unavailable.');
        resolve(false);
      }
      else if (this.isiOS()) {
        this._Diagnostic.getMicrophoneAuthorizationStatus().then(status => {
          if (status == this._Diagnostic.permissionStatus.GRANTED) {
            resolve(true);
          }
          else if (status == this._Diagnostic.permissionStatus.DENIED) {
            resolve(false);
          }
          else if (status == this._Diagnostic.permissionStatus.NOT_REQUESTED || status.toLowerCase() == 'not_determined') {
            this._Diagnostic.requestMicrophoneAuthorization().then(authorisation => {
              resolve(authorisation == this._Diagnostic.permissionStatus.GRANTED);
            });
          }
        });
      }
      else if (this.isAndroid()) {
        this._Diagnostic.isMicrophoneAuthorized().then(authorised => {
          if (authorised) {
            resolve(true);
          }
          else {
            this._Diagnostic.requestMicrophoneAuthorization().then(authorisation => {
              resolve(authorisation == this._Diagnostic.permissionStatus.GRANTED);
            });
          }
        });
      }
    });
  }
}
