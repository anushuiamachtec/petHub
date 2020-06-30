// import { AutoLocationPageModule } from './auto-location/auto-location.module';
import { AutoLocationPage } from './auto-location/auto-location.page';
import { Config } from 'src/providers/Config';
import { CommonHelper } from './../providers/helper';
import { IonicStorageModule } from '@ionic/storage';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import {  HttpClientModule } from "@angular/common/http";
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FCM } from '@ionic-native/fcm/ngx';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { CameraProvider } from './../providers/camera';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { PermissionsService } from 'src/providers/PermissionCheck';
import { Chat } from 'src/providers/Chat';
import { Network } from '@ionic-native/network/ngx';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { Sim } from '@ionic-native/sim/ngx';
import { RecaptchaModule } from 'ng-recaptcha';
import { IonicSelectableModule } from 'ionic-selectable';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    //  AutoLocationPageModule,
     HttpClientModule,
     IonicStorageModule.forRoot(),
      IonicModule.forRoot(),
      AppRoutingModule,
      RecaptchaModule.forRoot(),
      IonicSelectableModule
    ],
  providers: [
    StatusBar,Sim,
    SplashScreen,Network,Keyboard,
    CommonHelper,FileTransfer,File,Chat,PermissionsService,
    Camera,Diagnostic,FCM,CameraProvider,
    Config,NativeGeocoder,Geolocation,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
