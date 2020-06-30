import { Config } from '../../../../../providers/Config';
import { CommonHelper } from '../../../../../providers/helper';
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { ModalController, NavController, ActionSheetController } from "@ionic/angular";
import { commonService } from '../../../../services/serviceFile';
import { validationService } from '../../../../services/validation.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
declare var RazorpayCheckout: any;
import { File } from '@ionic-native/file/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';
@Component({
  selector: "app-createprofile",
  templateUrl: 'createProfile.page.html',
  styleUrls: ['createProfile.page.scss'],
})
export class createProfile implements OnInit {
  showReg = false;
  petObj:any = {}
  breedsOrgLists:any = [];
  breedsLists:any = [];
  showbreedList = false;
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
  
  changeLists(event) {
    let category = event.target.value;
    this.breedsOrgLists = [];
    if (category == "Dog") {
      this.breedsOrgLists = this.validation.getDogBreeds();
    } else if (category == "Cat") {
      this.breedsOrgLists = this.validation.getCatBreeds();
    } else if (category == "Goat") {
      this.breedsOrgLists = this.validation.getGoatBreeds();
    } else if (category == "Sheep") {
      this.breedsOrgLists = this.validation.getSheepBreeds();
    } else if (category == "Cow") {
      this.breedsOrgLists = this.validation.getCowBreeds();
    } else if (category == "Buffalo") {
      this.breedsOrgLists = this.validation.getBuffaloBreeds();
    } else if (category == "Horse") {
      this.breedsOrgLists = this.validation.getHorseBreeds();
    } else if (category == "Hen") {
      this.breedsOrgLists = this.validation.getHenBreeds();
    } else if (category == "Parrot") {
      this.breedsOrgLists = this.validation.getParrotBreeds();
    }
  }
  searchCountry(event, type) {
    this.breedsLists = []
    var q = event.target.value;
    if (type == 'petreg') {
      this.petObj.pet_breed = q;
    } 
    //if (type == 'sale') {
    //   this.petsaleObj.pet_breed = q;
    // }  else if (type == 'petreg') {
    //   this.petObj.pet_breed = q;
    // } else if (type == 'adoption') {
    //   this.petadoptionObj.pet_breed = q;
    // }
    if (q != undefined) {
      if (q.trim() != '') {
        let result = this.breedsOrgLists.filter(find => find.toUpperCase().includes(q.toUpperCase()));
        this.breedsLists = result
        this.showbreedList = true;
      }
    }
  }
  medClicked(item, type) {
    if (type == 'petreg') {
     this.petObj.pet_breed = item;
   }
    // if (type == 'sale') {
    //   this.petsaleObj.pet_breed = item;
    // } // else if (type == 'petreg') {
    //   this.petObj.pet_breed = item;
    // } else if (type == 'adoption') {
    //   this.petadoptionObj.pet_breed = item;
    // }
    this.showbreedList = false;
  }
  checkDigit(data, type) {
    console.log(data, type)
    if (type == 'petreg-year') {
      if (data.value.length == 1) {
        this.petObj.ageyears = 0 + data.value
      }
    } else if (type == 'petreg-month') {
      if (data.value.length == 1) {
        this.petObj.agemonth = 0 + data.value
      }
    }
    //  else if (type == 'petsale-year') {
    //   if (data.value.length == 1) {
    //     this.petsaleObj.years = 0 + data.value
    //   }
    // } else if (type == 'petsale-month') {
    //   if (data.value.length == 1) {
    //     this.petsaleObj.month = 0 + data.value
    //   }
    // } else if (type == 'petadoption-year') {
    //   if (data.value.length == 1) {
    //     this.petadoptionObj.years = 0 + data.value
    //   }
    // } else if (type == 'petadoption-month') {
    //   if (data.value.length == 1) {
    //     this.petadoptionObj.month = 0 + data.value
    //   }
    // }
  }
  getValues(){
    console.log(this.petObj, "objobj")
    //[routerLink]="['/UploadProfile']"
    this.Config.setNav('petdetails', this.petObj)
    this.router.navigate(['/UploadProfile'])
  }
}