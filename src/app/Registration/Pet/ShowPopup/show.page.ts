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
  selector: "app-show",
  templateUrl: 'show.page.html',
  styleUrls: ['show.page.scss'],
})
export class showProfile implements OnInit {
  showReg = false;
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

  }

  ngOnInit() {
    
  }
  
}