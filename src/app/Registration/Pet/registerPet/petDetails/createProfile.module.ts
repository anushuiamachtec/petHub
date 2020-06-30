import { SharedModule } from 'src/providers/SharedModule';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { createProfileRoutingModule } from './createProfile-routing.module';
import { createProfile } from './createProfile.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    createProfileRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [createProfile]
})
export class createProfileModule {}
