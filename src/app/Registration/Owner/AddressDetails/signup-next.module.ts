import { SharedModule } from 'src/providers/SharedModule';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { SignupNextPageRoutingModule } from './signup-next-routing.module';

import { SignupNextPage } from './signup-next.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    ReactiveFormsModule,
    SignupNextPageRoutingModule
  ],
  declarations: [SignupNextPage]
})
export class SignupNextPageModule {}
