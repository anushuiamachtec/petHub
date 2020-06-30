import { Config } from '../../../../providers/Config';
import { CommonHelper } from '../../../../providers/helper';
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { ModalController, NavController, ActionSheetController } from "@ionic/angular";
import { commonService } from '../../../services/serviceFile';
import { validationService } from '../../../services/validation.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
declare var RazorpayCheckout: any;
import { File } from '@ionic-native/file/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';
@Component({
  selector: "app-uploadprofile",
  templateUrl: 'uploadProfile.html',
  styleUrls: ['uploadProfile.scss'],
})
export class uploadProfile implements OnInit {
  showReg = false;
  petId;
  pettype;
  petData:any = {}
  constructor(
    public router: Router,
    public helper: CommonHelper,
    public formBuilder: FormBuilder,
    public modalCtrl: ModalController,
    public nav: NavController,
    public Config: Config,
    public commonService: commonService,
    public validation: validationService,
    public camera: Camera,
    public actionSheetController: ActionSheetController,
    private transfer: FileTransfer,
    private file: File,
    public storage: Storage,
    public navCtrl: NavController,
  ) {
    this.petId = localStorage.getItem('petId');
    this.pettype = localStorage.getItem('pettype')

  }

  ngOnInit() {
    this.petId = localStorage.getItem('petId')
    console.log(this.petId)
    let token = JSON.parse(this.validation.getToken())
    const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);
    let url;
    if(this.pettype == 'petreg'){
      url ='pets/getpet/'
    }else if(this.pettype == 'adoption'){
      url = 'petsadoption/getpetadopt/'
    } else if(this.pettype == 'sale'){
      url = 'petsale/getpetsale/'
    }
    this.commonService.get(url + this.petId, {}, { headers: headers }).subscribe((resdata: any) => {
      this.validation.dismissLoading()
      if (resdata.status) {
        this.petData = resdata.data;
        console.log(this.petData, "pet")
      } else {
        this.validation.presentToast(resdata.message);
      }
    }), err => {
      this.validation.presentToast(err);
    };
  }
  
}