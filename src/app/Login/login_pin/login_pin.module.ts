import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoginPinPageRoutingModule } from './login_pin-routing.module';

import { LoginPinPage } from './login_pin.page';
import { RecaptchaModule } from 'ng-recaptcha';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoginPinPageRoutingModule,
    ReactiveFormsModule,
    RecaptchaModule.forRoot(),

  ],
  declarations: [LoginPinPage]
})
export class loginPinpageModule {

  
}
