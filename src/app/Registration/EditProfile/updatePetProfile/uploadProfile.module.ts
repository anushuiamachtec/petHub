import { SharedModule } from 'src/providers/SharedModule';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { uploadProfileRoutingModule } from './uploadProfile-routing';
import { uploadProfile } from './uploadProfile';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    uploadProfileRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [uploadProfile]
})
export class uploadProfileModule {}
